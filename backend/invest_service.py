"""Investment engine. 1 card = 1 separate investment.

- Amount is FIXED to the plan price (no custom amount).
- Plan terms are SNAPSHOTTED onto the investment at purchase time so later admin
  plan edits never mutate existing investments.
- Buying debits the wallet atomically & idempotently (backend source of truth).
"""
import asyncio
import math
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

import wallet_service
from db import db
from money import d128, fmt, to_dec

SUCCESSFUL_STATUSES = ["active", "matured"]


def _now_dt():
    return datetime.now(timezone.utc)


def _now():
    return _now_dt().isoformat()


def _parse(dt_str):
    try:
        return datetime.fromisoformat(dt_str)
    except (TypeError, ValueError):
        return None


def remaining_days(maturity_at: str) -> int:
    m = _parse(maturity_at)
    if not m:
        return 0
    delta = m - _now_dt()
    if delta.total_seconds() <= 0:
        return 0
    return max(0, math.ceil(delta.total_seconds() / 86400))


async def get_plan(plan_key: str) -> dict:
    plan = await db.investment_plans.find_one({"key": plan_key})
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    return plan


def _compute_amounts(plan: dict):
    principal = to_dec(plan["price"])
    profit = principal * to_dec(plan["profit_percentage"]) / to_dec(100)
    maturity = principal * to_dec(plan["maturity_percentage"]) / to_dec(100)
    return principal, profit, maturity


def serialize_investment(inv: dict) -> dict:
    return {
        "id": inv["id"],
        "plan_key": inv["plan_key"],
        "plan_name": inv.get("plan_name"),
        "principal": fmt(inv["principal"]),
        "profit_amount": fmt(inv["profit_amount"]),
        "maturity_amount": fmt(inv["maturity_amount"]),
        "lock_days": inv.get("lock_days_snapshot"),
        "status": inv["status"],
        "source": inv.get("source"),
        "start_at": inv.get("start_at"),
        "maturity_at": inv.get("maturity_at"),
        "matured_at": inv.get("matured_at"),
        "remaining_days": remaining_days(inv.get("maturity_at")) if inv.get("status") == "active" else 0,
        "created_at": inv.get("created_at"),
    }


async def buy_plan(user: dict, plan_key: str, idempotency_key: str | None = None) -> dict:
    user_id = user["id"]
    plan = await get_plan(plan_key)
    if not plan.get("is_active", True):
        raise HTTPException(status_code=400, detail="This plan is not currently available.")

    # Idempotent replay: return prior investment for same key.
    if idempotency_key:
        prior = await db.investments.find_one({"idempotency_key": idempotency_key, "user_id": user_id})
        if prior:
            return serialize_investment(prior)

    principal, profit, maturity = _compute_amounts(plan)

    # Early friendly insufficient-balance check.
    wallet = await wallet_service.get_or_create_wallet(user_id)
    if to_dec(wallet["available_balance"]) < principal:
        raise wallet_service.InsufficientBalance(principal, wallet["available_balance"])

    inv_id = str(uuid.uuid4())
    inv_key = idempotency_key or f"invest:{inv_id}"
    ts = _now()
    inv_doc = {
        "id": inv_id, "user_id": user_id,
        "plan_id": plan["id"], "plan_key": plan["key"], "plan_name": plan["name"],
        "status": "pending", "source": "wallet",
        "principal": d128(principal), "profit_amount": d128(profit),
        "maturity_amount": d128(maturity),
        "profit_percentage_snapshot": d128(plan["profit_percentage"]),
        "maturity_percentage_snapshot": d128(plan["maturity_percentage"]),
        "lock_days_snapshot": int(plan["lock_days"]),
        "referral_paid": False, "idempotency_key": inv_key,
        "start_at": None, "maturity_at": None, "matured_at": None,
        "created_at": ts, "updated_at": ts,
    }
    try:
        await db.investments.insert_one(inv_doc)
    except DuplicateKeyError:
        # A concurrent request with the SAME idempotency_key won the insert race.
        # Return that single investment. Retry the read briefly to tolerate the
        # tiny window before the winning insert is visible, so we never surface a
        # 500 for a duplicate/retried request (spec: idempotent, no double-spend).
        prior = None
        for _ in range(10):
            prior = await db.investments.find_one({"idempotency_key": inv_key, "user_id": user_id})
            if prior:
                break
            await asyncio.sleep(0.05)
        if prior:
            return serialize_investment(prior)
        raise HTTPException(status_code=409, detail="Duplicate request in progress, please retry.")

    # Debit wallet (atomic, idempotent). Roll back the pending investment on failure.
    try:
        await wallet_service.debit(
            user_id, principal, tx_type="INVESTMENT",
            ref_type="investment", ref_id=inv_id,
            idempotency_key=f"invest-debit:{inv_id}",
            note=f"Investment in {plan['name']} plan",
            inc={"total_invested": principal},
        )
    except wallet_service.InsufficientBalance:
        await db.investments.update_one({"id": inv_id}, {"$set": {"status": "cancelled", "updated_at": _now()}})
        raise

    start_dt = _now_dt()
    maturity_dt = start_dt + timedelta(days=int(plan["lock_days"]))
    await db.investments.update_one(
        {"id": inv_id},
        {"$set": {
            "status": "active",
            "start_at": start_dt.isoformat(),
            "maturity_at": maturity_dt.isoformat(),
            "updated_at": _now(),
        }},
    )
    inv_doc = await db.investments.find_one({"id": inv_id})
    return serialize_investment(inv_doc)


async def list_investments(user_id: str, plan_key: str | None = None):
    q = {"user_id": user_id, "status": {"$ne": "pending"}}
    if plan_key:
        q["plan_key"] = plan_key
    cur = db.investments.find(q).sort("created_at", -1)
    return [serialize_investment(i) async for i in cur]


async def _plan_summary(user_id: str, plan: dict) -> dict:
    """Backend-computed lock state + aggregates for one plan."""
    invs = [i async for i in db.investments.find(
        {"user_id": user_id, "plan_key": plan["key"], "status": {"$in": SUCCESSFUL_STATUSES}}
    )]
    unlocked = len(invs) > 0
    active = [i for i in invs if i["status"] == "active"]

    total_invested = sum((to_dec(i["principal"]) for i in invs), to_dec(0))
    expected_profit = sum((to_dec(i["profit_amount"]) for i in active), to_dec(0))
    expected_maturity = sum((to_dec(i["maturity_amount"]) for i in active), to_dec(0))
    next_maturity = None
    if active:
        next_maturity = min(i["maturity_at"] for i in active if i.get("maturity_at"))

    principal, profit, maturity = _compute_amounts(plan)
    return {
        "key": plan["key"],
        "name": plan["name"],
        "display_order": plan["display_order"],
        "price": fmt(principal),
        "lock_days": int(plan["lock_days"]),
        "profit_percentage": fmt(plan["profit_percentage"]),
        "maturity_percentage": fmt(plan["maturity_percentage"]),
        "profit_amount": fmt(profit),
        "maturity_amount": fmt(maturity),
        "unlocked": unlocked,
        "cards": len(invs),
        "active_investments": len(active),
        "total_invested": fmt(total_invested),
        "expected_profit": fmt(expected_profit),
        "expected_maturity": fmt(expected_maturity),
        "next_maturity": next_maturity,
    }


async def get_plans_state(user_id: str):
    plans = [p async for p in db.investment_plans.find({}).sort("display_order", 1)]
    return [await _plan_summary(user_id, p) for p in plans]


async def get_dashboard(user: dict):
    wallet = await wallet_service.wallet_summary(user["id"])
    plans = await get_plans_state(user["id"])
    total_active = sum(p["active_investments"] for p in plans)
    total_cards = sum(p["cards"] for p in plans)
    return {
        "user": {"id": user["id"], "name": user["name"], "email": user["email"],
                 "referral_code": user.get("referral_code"), "kyc_status": user.get("kyc_status", "none")},
        "wallet": wallet,
        "plans": plans,
        "totals": {"active_investments": total_active, "total_cards": total_cards},
    }

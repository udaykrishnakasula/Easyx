"""Authenticated user routes: plans, investments, wallet, transactions, dashboard, notifications."""
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from typing import Optional

import invest_service
import notify_service
import wallet_service
from deps import get_current_user

router = APIRouter(prefix="/api", tags=["user"])


class BuyIn(BaseModel):
    plan_key: str = Field(pattern="^(silver|gold|platinum|diamond)$")
    idempotency_key: Optional[str] = Field(default=None, max_length=80)


@router.get("/dashboard")
async def dashboard(user: dict = Depends(get_current_user)):
    return await invest_service.get_dashboard(user)


@router.get("/plans")
async def plans(user: dict = Depends(get_current_user)):
    return await invest_service.get_plans_state(user["id"])


@router.post("/investments", status_code=201)
async def buy_investment(payload: BuyIn, user: dict = Depends(get_current_user)):
    return await invest_service.buy_plan(user, payload.plan_key, payload.idempotency_key)


@router.get("/investments")
async def investments(plan_key: Optional[str] = Query(default=None),
                      user: dict = Depends(get_current_user)):
    return await invest_service.list_investments(user["id"], plan_key)


@router.get("/wallet")
async def wallet(user: dict = Depends(get_current_user)):
    return await wallet_service.wallet_summary(user["id"])


@router.get("/wallet/consistency")
async def wallet_consistency(user: dict = Depends(get_current_user)):
    return await wallet_service.check_consistency(user["id"])


@router.get("/transactions")
async def transactions(limit: int = Query(default=50, le=200), skip: int = Query(default=0, ge=0),
                       user: dict = Depends(get_current_user)):
    return await wallet_service.list_transactions(user["id"], limit=limit, skip=skip)


@router.get("/notifications")
async def notifications(unread_only: bool = Query(default=False),
                        limit: int = Query(default=50, le=200),
                        user: dict = Depends(get_current_user)):
    return await notify_service.list_for_user(user["id"], unread_only=unread_only, limit=limit)


@router.get("/notifications/unread-count")
async def notifications_unread_count(user: dict = Depends(get_current_user)):
    return {"count": await notify_service.unread_count(user["id"])}


@router.post("/notifications/{notif_id}/read")
async def notification_read(notif_id: str, user: dict = Depends(get_current_user)):
    ok = await notify_service.mark_read(user["id"], notif_id)
    return {"ok": ok}


@router.post("/notifications/read-all")
async def notifications_read_all(user: dict = Depends(get_current_user)):
    return {"updated": await notify_service.mark_all_read(user["id"])}

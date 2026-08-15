"""Minimal admin routes needed this phase: manual wallet adjustment (credit/debit).

This supports admin platform control and lets funds enter a wallet (manual deposit
verification is a later phase). Guarded by require_admin. All actions are ledgered.
"""
import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Optional

import wallet_service
from db import db
from deps import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


class AdjustIn(BaseModel):
    user_id: str
    amount: str = Field(description="Positive decimal string")
    direction: str = Field(pattern="^(credit|debit)$")
    note: Optional[str] = Field(default=None, max_length=200)
    idempotency_key: Optional[str] = Field(default=None, max_length=80)


@router.post("/wallet/adjust")
async def adjust_wallet(payload: AdjustIn, admin: dict = Depends(require_admin)):
    target = await db.users.find_one({"id": payload.user_id})
    if not target:
        return {"error": "user_not_found"}
    key = payload.idempotency_key or f"adjust:{uuid.uuid4()}"
    tx_type = "adjustment_credit" if payload.direction == "credit" else "adjustment_debit"
    fn = wallet_service.credit if payload.direction == "credit" else wallet_service.debit
    tx = await fn(
        payload.user_id, payload.amount, tx_type=tx_type,
        ref_type="admin", ref_id=admin["id"],
        idempotency_key=key, note=payload.note or "Admin adjustment",
    )
    return wallet_service.serialize_tx(tx)

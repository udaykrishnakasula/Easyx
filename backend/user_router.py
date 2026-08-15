"""Authenticated user routes: plans, investments, wallet, transactions, dashboard."""
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from typing import Optional

import invest_service
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
    w = await wallet_service.get_or_create_wallet(user["id"])
    return wallet_service.serialize_wallet(w)


@router.get("/transactions")
async def transactions(limit: int = Query(default=50, le=200), skip: int = Query(default=0, ge=0),
                       user: dict = Depends(get_current_user)):
    return await wallet_service.list_transactions(user["id"], limit=limit, skip=skip)

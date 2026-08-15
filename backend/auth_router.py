"""Auth routes mounted under /api/auth."""
from fastapi import APIRouter, Depends

import auth_service
from deps import get_current_user
from schemas import LoginIn, RegisterIn, TokenOut, UserOut
from security import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=201)
async def register(payload: RegisterIn):
    user = await auth_service.register_user(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        password=payload.password,
        referral_code=payload.referral_code,
    )
    token = create_access_token(subject=user["id"], role=user["role"])
    return TokenOut(access_token=token, user=UserOut(**auth_service.public_user(user)))


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn):
    user = await auth_service.authenticate_user(payload.email, payload.password)
    token = create_access_token(subject=user["id"], role=user["role"])
    return TokenOut(access_token=token, user=UserOut(**auth_service.public_user(user)))


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(**auth_service.public_user(user))

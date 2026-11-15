"""
users.py — User management endpoints backed by MongoDB Atlas.
"""
from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter()


def _get_mongo_users_col():
    try:
        from app.core.mongo import get_mongodb_database
        db = get_mongodb_database()
        if db is not None:
            return db["users"]
    except Exception as e:
        print(f"MongoDB users route notice: {e}")
    return None


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


@router.get("", summary="List all users")
async def list_users(skip: int = 0, limit: int = 20):
    col = _get_mongo_users_col()
    if col is None:
        return []
    try:
        users = list(col.find({}, {"_id": 0, "password_hash": 0}).skip(skip).limit(limit))
        return users
    except Exception:
        return []


@router.post("", status_code=status.HTTP_201_CREATED, summary="Register a user directly")
async def register_user(payload: UserCreate):
    col = _get_mongo_users_col()
    if col is None:
        raise HTTPException(status_code=503, detail="Database service unavailable")

    email = payload.email.strip().lower()
    existing = col.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="User with this email already exists")

    max_user = col.find_one(sort=[("id", -1)])
    next_id = (max_user.get("id", 0) + 1) if max_user else 1

    from datetime import datetime, timezone
    now_str = datetime.now(timezone.utc).isoformat()

    new_user = {
        "id": next_id,
        "full_name": payload.full_name.strip(),
        "email": email,
        "phone": payload.phone.strip() if payload.phone else None,
        "password_hash": get_password_hash(payload.password),
        "role": "user",
        "is_verified": True,
        "created_at": now_str,
        "updated_at": now_str,
    }
    col.insert_one(new_user)
    new_user.pop("_id", None)
    new_user.pop("password_hash", None)
    return new_user


@router.post("/login", summary="Authenticate user directly")
async def login(payload: UserLogin):
    col = _get_mongo_users_col()
    if col is None:
        raise HTTPException(status_code=503, detail="Database service unavailable")

    email = payload.email.strip().lower()
    user = col.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({
        "sub": user["email"],
        "id": user["id"],
        "name": user.get("full_name", ""),
        "role": user.get("role", "user"),
    })

    user_clean = {k: v for k, v in user.items() if k not in ["_id", "password_hash"]}
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_clean,
    }

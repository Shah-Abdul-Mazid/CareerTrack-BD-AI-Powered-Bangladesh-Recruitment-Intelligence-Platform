import time
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import hashlib
from app.core.config import settings

try:
    import bcrypt
    if not hasattr(bcrypt, "__about__"):
        class _About:
            __version__ = getattr(bcrypt, "__version__", "4.0.1")
        bcrypt.__about__ = _About()
except Exception:
    pass

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception:
    pwd_context = None

try:
    from jose import jwt, JWTError
except Exception:
    jwt = None
    JWTError = Exception


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if pwd_context is not None:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password


def get_password_hash(password: str) -> str:
    if pwd_context is not None:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    return hashlib.sha256(password.encode()).hexdigest()


def create_access_token(data: dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        exp_seconds = int(time.time() + expires_delta.total_seconds())
    else:
        exp_seconds = int(time.time() + settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    to_encode["exp"] = exp_seconds
    if jwt is not None:
        try:
            return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        except Exception:
            pass
    return hashlib.sha256(f"{to_encode}:{settings.SECRET_KEY}".encode()).hexdigest()


def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    if jwt is not None:
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except Exception as e:
            print(f"Token decode error: {e}")
            return None
    return None

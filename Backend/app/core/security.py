import time
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import hashlib
import hmac
import base64
import json
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


# ── RFC 7519 Compliant JSON Web Token (JWT) Engine ──────────────────────────
def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (4 - (len(data) % 4)) if (len(data) % 4) != 0 else ""
    return base64.urlsafe_b64decode((data + padding).encode("utf-8"))


def create_access_token(data: dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        exp_seconds = int(time.time() + expires_delta.total_seconds())
    else:
        exp_seconds = int(time.time() + settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    to_encode["exp"] = exp_seconds

    # Prefer python-jose if available, else pure Python standard RFC 7519 JWT
    if jwt is not None:
        try:
            return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        except Exception:
            pass

    header = {"alg": "HS256", "typ": "JWT"}
    h_b64 = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    p_b64 = _b64url_encode(json.dumps(to_encode, separators=(",", ":"), default=str).encode("utf-8"))
    signing_input = f"{h_b64}.{p_b64}".encode("utf-8")
    sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    sig_b64 = _b64url_encode(sig)
    return f"{h_b64}.{p_b64}.{sig_b64}"


def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    if not token or not isinstance(token, str):
        return None

    # First attempt with python-jose if available
    if jwt is not None:
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except Exception:
            pass

    # Pure Python RFC 7519 HS256 verification (zero external dependency)
    parts = token.split(".")
    if len(parts) != 3:
        return None
    h_b64, p_b64, sig_b64 = parts
    signing_input = f"{h_b64}.{p_b64}".encode("utf-8")
    expected_sig = _b64url_encode(
        hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    )
    if not hmac.compare_digest(sig_b64, expected_sig):
        return None

    try:
        payload = json.loads(_b64url_decode(p_b64).decode("utf-8"))
        exp = payload.get("exp")
        if exp and int(time.time()) > int(exp):
            return None
        return payload
    except Exception as e:
        print(f"Token decode error: {e}")
        return None

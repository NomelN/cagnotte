"""Verify Supabase-issued JWTs locally using the project's JWT secret."""
from __future__ import annotations

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.config import Settings, get_settings

bearer_scheme = HTTPBearer(auto_error=True)


class AuthUser(BaseModel):
    id: str
    email: str | None = None
    role: str | None = None


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> AuthUser:
    if not settings.supabase_jwt_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_SECRET is not configured",
        )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token expired") from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token") from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token missing subject")

    return AuthUser(
        id=user_id,
        email=payload.get("email"),
        role=payload.get("role"),
    )

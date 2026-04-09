from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()


def hashear_password(password: str) -> str:
    return pwd_context.hash(password)


def verificar_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def crear_token(data: dict) -> str:
    payload = data.copy()
    expira = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload.update({"exp": expira})
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decodificar_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


def get_usuario_actual(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    return decodificar_token(credentials.credentials)


def requiere_rol(*roles):
    def verificar(usuario: dict = Depends(get_usuario_actual)):
        if usuario.get("rol") not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Se requiere uno de estos roles: {', '.join(roles)}"
            )
        return usuario
    return verificar

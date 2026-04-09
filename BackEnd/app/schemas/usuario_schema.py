from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


#Estado

class EstadoUsuarioBase(BaseModel):
    nombre: str

class EstadoUsuarioRespuesta(EstadoUsuarioBase):
    id: int

    model_config = {"from_attributes": True}


#Rol

class RolUsuarioBase(BaseModel):
    nombre: str

class RolUsuarioRespuesta(RolUsuarioBase):
    id: int

    model_config = {"from_attributes": True}


#Usuario
class UsuarioBase(BaseModel):
    username: str = Field(..., max_length=50)
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8)


class UsuarioUpdate(BaseModel):
    username: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None
    estado_id: Optional[int] = None
    rol_id: Optional[int] = None


class UsuarioRespuesta(UsuarioBase):
    id: int
    estado_id: int
    estado_usuario: RolUsuarioRespuesta
    rol_id: int
    rol_usuario: RolUsuarioRespuesta
    fecha_creacion: datetime

    model_config = {"from_attributes": True}


# Auth

class LoginRequest(BaseModel):
    username: str
    password: str

class CambiarPasswordRequest(BaseModel):
    nueva_password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario_id: int
    username: str
    rol: str  # "admin" o  "usuario"


class TokenData(BaseModel):
    usuario_id: Optional[int] = None
    username: Optional[str] = None
    rol: Optional[str] = None  # "admin" | "usuario"
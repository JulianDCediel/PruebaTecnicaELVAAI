from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.usuario_model import RolUsuario, EstadoUsuario
from app.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate, UsuarioRespuesta, LoginRequest, Token, \
    CambiarPasswordRequest
from app.services.usuario_service import (
    crear_usuario,
    login_usuario,
    obtener_usuarios,
    obtener_usuario_por_id,
    actualizar_usuario,
    eliminar_usuario, cambiar_password_usuario
)
from app.core.security import get_usuario_actual, requiere_rol

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/roles")
def obtener_roles(db: Session = Depends(get_db),usuario=Depends(requiere_rol("admin"))):
    return db.query(RolUsuario).all()


@router.get("/estados")
def obtener_estados(db: Session = Depends(get_db),usuario=Depends(requiere_rol("admin"))):
    return db.query(EstadoUsuario).all()

#Registro
@router.post("/", response_model=UsuarioRespuesta)
def registrar(
    usuario: UsuarioCreate,
    db: Session = Depends(get_db),
    current_user = Depends(requiere_rol("admin"))
):
    return crear_usuario(db, usuario)

#Login
@router.post("/login", response_model=Token)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    return login_usuario(db, datos)



@router.patch("/{usuario_id}/password",response_model=dict)
def cambiar_password_usuario_router(
    usuario_id: int,
    datos: CambiarPasswordRequest,
    db: Session = Depends(get_db),
    usuario=Depends(requiere_rol("admin"))
):
    cambiar_password_usuario(db, usuario_id, datos.nueva_password)
    return {"mensaje": "Contraseña actualizada correctamente"}

#Listar usuarios (solo admin)
@router.get("/", response_model=list[UsuarioRespuesta])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario=Depends(requiere_rol("admin"))
):
    return obtener_usuarios(db)

@router.get("/me", response_model=UsuarioRespuesta)
def get_me(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_usuario_actual),
):
    return obtener_usuario_por_id(db, current_user["usuario_id"])

#Obtener usuario por ID
@router.get("/{usuario_id}", response_model=UsuarioRespuesta)
def obtener_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    return obtener_usuario_por_id(db, usuario_id)


#Actualizar usuario
@router.put("/{usuario_id}", response_model=UsuarioRespuesta)
def actualizar(
    usuario_id: int,
    datos: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    return actualizar_usuario(db, usuario_id, datos)


#Eliminar usuario (solo admin)
@router.delete("/{usuario_id}")
def eliminar(
    usuario_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(requiere_rol("admin"))
):
    return eliminar_usuario(db, usuario_id)

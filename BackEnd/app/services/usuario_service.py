from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.usuario_model import Usuario
from app.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate, LoginRequest, Token
from app.core.security import hashear_password, verificar_password, crear_token


#Crear usuario (registro)
def crear_usuario(db: Session, usuario: UsuarioCreate):
    # Validar username
    if db.query(Usuario).filter(Usuario.username == usuario.username).first():
        raise HTTPException(status_code=400, detail="El username ya existe")

    #Validar email
    if db.query(Usuario).filter(Usuario.email == usuario.email).first():
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    nuevo_usuario = Usuario(
        username=usuario.username,
        email=usuario.email,
        password=hashear_password(usuario.password),
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario

#cambiar clave usuarios
def cambiar_password_usuario(db: Session, usuario_id: int, nueva_password: str):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.password = hashear_password(nueva_password)
    db.commit()
    db.refresh(usuario)
    return usuario

#Login
def login_usuario(db: Session, datos: LoginRequest) -> Token:
    usuario = db.query(Usuario).filter(Usuario.username == datos.username).first()

    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")


    if not verificar_password(datos.password, usuario.password):
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    if usuario.estado_usuario.nombre != 'activo':
        raise HTTPException(status_code=400, detail="Estado inválido")

    #Crear payload del token
    token_data = {
        "usuario_id": usuario.id,
        "username": usuario.username,
        "rol": usuario.rol_usuario.nombre
    }

    access_token = crear_token(token_data)

    return Token(
        access_token=access_token,
        usuario_id=usuario.id,
        username=usuario.username,
        rol=usuario.rol_usuario.nombre
    )


#Obtener todos los usuarios
def obtener_usuarios(db: Session):
    return db.query(Usuario).all()


#Obtener usuario por ID
def obtener_usuario_por_id(db: Session, usuario_id: int):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return usuario


#Actualizar usuario
def actualizar_usuario(db: Session, usuario_id: int, datos: UsuarioUpdate):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if datos.username is not None:
        usuario.username = datos.username

    if datos.email is not None:
        usuario.email = datos.email

    if datos.estado_id is not None:
        usuario.estado_id = datos.estado_id

    if datos.rol_id is not None:
        usuario.rol_id = datos.rol_id

    db.commit()
    db.refresh(usuario)

    return usuario


# Eliminar usuario
def eliminar_usuario(db: Session, usuario_id: int):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()

    return {"message": "Usuario eliminado correctamente"}
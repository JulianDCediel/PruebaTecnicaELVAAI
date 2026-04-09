from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class EstadoUsuario(Base):

    __tablename__ = "estados_usuario"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), unique=True, nullable=False)

    usuarios = relationship("Usuario", back_populates="estado_usuario")

    def __repr__(self) -> str:
        return f"<EstadoUsuario id={self.id} nombre='{self.nombre}'>"


class RolUsuario(Base):

    __tablename__ = "roles_usuario"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), unique=True, nullable=False)

    usuarios = relationship("Usuario", back_populates="rol_usuario")

    def __repr__(self) -> str:
        return f"<RolUsuario id={self.id} nombre='{self.nombre}'>"


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    estado_id = Column(
        Integer,
        ForeignKey("estados_usuario.id"),
        nullable=False,
        default=1,  # 1 = "activo"
    )
    estado_usuario = relationship("EstadoUsuario", back_populates="usuarios")

    rol_id = Column(
        Integer,
        ForeignKey("roles_usuario.id"),
        nullable=False,
        default=2,
    )
    rol_usuario = relationship("RolUsuario", back_populates="usuarios")

    fecha_creacion = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    tareas = relationship("Tarea", back_populates="usuario", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Usuario id={self.id} username='{self.username}'>"
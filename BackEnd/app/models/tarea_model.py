
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class EstadoTarea(Base):
    __tablename__ = "estados_tarea"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), unique=True, nullable=False)

    tareas = relationship("Tarea", back_populates="estado_tarea")

    def __repr__(self) -> str:
        return f"<EstadoTarea id={self.id} nombre='{self.nombre}'>"


class Tarea(Base):
    __tablename__ = "tareas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    descripcion = Column(String(500), nullable=True)

    estado_id = Column(
        Integer,
        ForeignKey("estados_tarea.id"),
        nullable=False,
        default=1,  # 1 = "pendiente"
    )
    estado_tarea = relationship("EstadoTarea", back_populates="tareas")

    fecha_creacion = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    usuario = relationship("Usuario", back_populates="tareas")

    def __repr__(self) -> str:
        return f"<Tarea id={self.id} titulo='{self.titulo}'>"
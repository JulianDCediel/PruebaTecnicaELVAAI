from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.tarea_model import Tarea
from app.schemas.tarea_schema import TareaCreate, TareaUpdate


#Crear tarea
def crear_tarea(db: Session, tarea: TareaCreate, usuario_id: int):
    nueva_tarea = Tarea(
        titulo=tarea.titulo,
        descripcion=tarea.descripcion,
        estado_id=tarea.estado_id,
        usuario_id=usuario_id
    )

    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)

    return nueva_tarea


#Obtener todas las tareas
def obtener_tareas(db: Session):
    return db.query(Tarea).all()


#Obtener tarea por ID
def obtener_tarea_por_id(db: Session, tarea_id: int):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()

    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    return tarea


#Filtrar por estado
def obtener_tareas_por_estado(db: Session, estado_id: int):
    return db.query(Tarea).filter(Tarea.estado_id == estado_id).all()


#Actualizar tarea
def actualizar_tarea(db: Session, tarea_id: int, datos: TareaUpdate):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()

    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    if datos.titulo is not None:
        tarea.titulo = datos.titulo

    if datos.descripcion is not None:
        tarea.descripcion = datos.descripcion

    if datos.estado_id is not None:
        tarea.estado_id = datos.estado_id

    db.commit()
    db.refresh(tarea)

    return tarea


#Eliminar tarea
def eliminar_tarea(db: Session, tarea_id: int):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()

    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    db.delete(tarea)
    db.commit()

    return {"message": "Tarea eliminada correctamente"}

def obtener_tareas_por_usuario(db: Session, usuario_id: int):
    return db.query(Tarea).filter(Tarea.usuario_id == usuario_id).all()
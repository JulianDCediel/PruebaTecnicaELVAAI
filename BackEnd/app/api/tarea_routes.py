from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.tarea_schema import TareaCreate, TareaUpdate, TareaRespuesta
from app.services.tarea_service import (
    crear_tarea,
    obtener_tarea_por_id,
    actualizar_tarea,
    eliminar_tarea
)
from app.models.tarea_model import Tarea
from app.core.security import get_usuario_actual, requiere_rol

router = APIRouter(prefix="/tareas", tags=["Tareas"])


#Crear tarea
@router.post("/", response_model=TareaRespuesta, status_code=status.HTTP_201_CREATED)
def create(
    tarea: TareaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_usuario_actual),
):
    return crear_tarea(db, tarea, current_user["usuario_id"])


#Mis tareas (paginadas)
@router.get("/", response_model=list[TareaRespuesta])
def get_my_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_usuario_actual),
):
    return (
        db.query(Tarea)
        .filter(Tarea.usuario_id == current_user["usuario_id"])
        .offset(skip)
        .limit(limit)
        .all()
    )


#Todas las tareas (solo admin)
@router.get("/all", response_model=list[TareaRespuesta])
def get_all_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=100),
    db: Session = Depends(get_db),
    usuario=Depends(requiere_rol("admin")),
):
    return db.query(Tarea).offset(skip).limit(limit).all()


#Obtener por ID
@router.get("/{tarea_id}", response_model=TareaRespuesta)
def get_by_id(
    tarea_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_usuario_actual),
):
    tarea = obtener_tarea_por_id(db, tarea_id)

    if tarea.usuario_id != current_user["usuario_id"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    return tarea


#Actualizar
@router.put("/{tarea_id}", response_model=TareaRespuesta)
def update(
    tarea_id: int,
    datos: TareaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_usuario_actual),
):
    tarea = obtener_tarea_por_id(db, tarea_id)

    if tarea.usuario_id != current_user["usuario_id"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    return actualizar_tarea(db, tarea_id, datos)


@router.patch("/{tarea_id}/estado/{estado_id}")
def cambiar_estado(
    tarea_id: int,
    estado_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_usuario_actual),
):
    tarea = obtener_tarea_por_id(db, tarea_id)

    if tarea.usuario_id != current_user["usuario_id"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    tarea.estado_id = estado_id
    db.commit()
    db.refresh(tarea)

    return tarea


# Eliminar
@router.delete("/{tarea_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    tarea_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_usuario_actual),
):
    tarea = obtener_tarea_por_id(db, tarea_id)

    if tarea.usuario_id != current_user["usuario_id"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    eliminar_tarea(db, tarea_id)
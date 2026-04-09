from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


#Estado

class EstadoTareaBase(BaseModel):
    nombre: str

class EstadoTareaOut(EstadoTareaBase):
    id: int

    model_config = {"from_attributes": True}


#Tarea

class TareaBase(BaseModel):
    titulo: str = Field(..., max_length=100)
    descripcion: Optional[str] = Field(None, max_length=500)


class TareaCreate(TareaBase):
    estado_id: int = Field(default=1, description="1=pendiente, 2=en_progreso, 3=completado")


class TareaUpdate(BaseModel):
    titulo: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = Field(None, max_length=500)
    estado_id: Optional[int] = None


class TareaRespuesta(TareaBase):
    id: int
    estado_id: int
    estado_tarea: EstadoTareaOut
    fecha_creacion: datetime
    usuario_id: int

    model_config = {"from_attributes": True}
from fastapi import APIRouter
from app.api.usuario_routes import router as usuario_router
from app.api.tarea_routes import router as tarea_router

router = APIRouter()

router.include_router(usuario_router)
router.include_router(tarea_router)
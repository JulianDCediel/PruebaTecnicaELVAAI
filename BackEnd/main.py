from fastapi import FastAPI
from app.api.routes import router
from app.db.database import Base, engine, SessionLocal

from app.models.usuario_model import Usuario, RolUsuario, EstadoUsuario
from app.models.tarea_model import EstadoTarea

from app.core.security import hashear_password
from fastapi.middleware.cors import CORSMiddleware

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Prueba Tecnica ElvaAI",
    description="Gestion de Tareas",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.on_event("startup")
def inicializar_datos():
    db = SessionLocal()

    try:
        roles = ["admin", "usuario"]
        for rol in roles:
            existe = db.query(RolUsuario).filter(RolUsuario.nombre == rol).first()
            if not existe:
                db.add(RolUsuario(nombre=rol))

        estados_usuario = ["activo", "inactivo"]
        for estado in estados_usuario:
            existe = db.query(EstadoUsuario).filter(EstadoUsuario.nombre == estado).first()
            if not existe:
                db.add(EstadoUsuario(nombre=estado))

        estados_tarea = ["pendiente", "en_progreso", "completado"]
        for estado in estados_tarea:
            existe = db.query(EstadoTarea).filter(EstadoTarea.nombre == estado).first()
            if not existe:
                db.add(EstadoTarea(nombre=estado))

        db.commit()

        rol_admin = db.query(RolUsuario).filter(RolUsuario.nombre == "admin").first()
        estado_activo = db.query(EstadoUsuario).filter(EstadoUsuario.nombre == "activo").first()

        existe_admin = db.query(Usuario).filter(Usuario.username == "admin").first()

        if not existe_admin:
            admin = Usuario(
                username="admin",
                email="admin@admin.com",
                password=hashear_password("admin123"),
                rol_id=rol_admin.id,
                estado_id=estado_activo.id
            )

            db.add(admin)
            db.commit()

            print("Usuario admin creado (username: admin / password: admin123)")

    finally:
        db.close()
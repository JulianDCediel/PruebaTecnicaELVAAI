from pydantic_settings import BaseSettings
from typing import Dict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:admin@localhost:5432/pruebaTecnicaElVA"
    # JWT
    JWT_SECRET:    str = "Token_Prueba_Tecnica"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 480

    class Config:
        env_file = ".env"

settings = Settings()
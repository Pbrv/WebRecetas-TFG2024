from fastapi import FastAPI
from routers import recetas,usuarios

app = FastAPI()
app.include_router(recetas.app)
app.include_router(usuarios.app)

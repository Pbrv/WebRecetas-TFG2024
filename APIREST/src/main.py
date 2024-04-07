from fastapi import FastAPI
from routers import recetas,usuarios,paises
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000"  # Permite solicitudes desde React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(recetas.app)
app.include_router(usuarios.app)
app.include_router(paises.app)
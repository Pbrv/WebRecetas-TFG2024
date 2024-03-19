from fastapi import FastAPI
from routers import recetas, users
from fastapi.staticfiles import StaticFiles # Para recursos estáticos de la carpeta del proyecto

app = FastAPI()


# Routers
app.include_router(recetas.router)
app.include_router(users.router)
app.mount("/static", StaticFiles(directory="static"), name="static") # Para recursos estáticos de la carpeta del proyecto


@app.get("/")
async def root():
    return "Hola FastAPI!"

#Levantar el servidor uvicorn main:app --reload
#Documentacion Swagger http://127.0.0.1:8000/docs
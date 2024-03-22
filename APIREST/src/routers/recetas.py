from fastapi import APIRouter,Depends,HTTPException, status
from typing import Annotated
from models import receta
from database.database import SessionLocal
from sqlalchemy.orm import Session

app = APIRouter()


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_con = Annotated[Session,Depends(get_db)]


@app.get("/mostrar_recetas")
async def recetas_mostrar(db:db_con):
    recetas = db.query(receta.Receta).all()
    #Asi seria la consulta con "where" siempre al final hay que añadir "first" si solo quieres una fila si no "all"
    # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).first()
    # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).all()
    return recetas

@app.post("/insertar_receta")
async def recetas_mostrar(insertar: receta.InsertarReceta,db:db_con):
    informacion_receta = insertar.dict
    informacion_receta['usuario_receta'] = 1 #Coger el id del usuario que esta ejecutando este post
     # Se podria usar **insertar.dict si no queremos modificar o añadir ningun campo a lo que hemos pedido al usuario para que inserte
    receta_insertar = receta.Receta(**informacion_receta)
    db.add(receta_insertar)
    db.commit()
    return "El registro se completo con exito"

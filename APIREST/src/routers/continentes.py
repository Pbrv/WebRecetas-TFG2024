from fastapi import APIRouter,Depends,HTTPException
from fastapi.responses import JSONResponse
from typing import Annotated
from models import continente
from database.database import SessionLocal
from sqlalchemy.orm import Session, class_mapper
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
import json

app = APIRouter()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_con = Annotated[Session,Depends(get_db)]
    
    
# PRUEBA (ESTO DEBE IR EN UNA RUTA DE CONTINENTES)

@app.get("/mostrar_continentes") # mostrar continentes
async def mostrar_receta(db: db_con):
    try:
        continentes = db.query(continente.Continente).all()
        # nom_pais = db.query(pais.Pais).join(continente.Continente).filter(continente.Continente.nombre_continente == nom_continente).all()
        if continentes is None:
            return {"error": "Continente no valido"}
        return continentes
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")


@app.get("/mostrar_continente/{id_continente}") # mostrar continente pasando id del continente
async def mostrar_continente(id_continente: int, db: db_con):
    try:
        cont = db.query(continente.Continente).filter(continente.Continente.id_continente == id_continente).first()
        if cont is None:
            return {"error": "Continente no válido"}
        return cont
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

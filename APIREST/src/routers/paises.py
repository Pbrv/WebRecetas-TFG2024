from fastapi import APIRouter,Depends,HTTPException, status
from fastapi.responses import JSONResponse
from typing import Annotated, Optional
from models import pais,continente
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

@app.get("/mostrar_paises/{nom_continente}") # mostrar paises pasando nombre continente
async def mostrar_receta(nom_continente: str, db: db_con):
    try:
        nom_pais = db.query(pais.Pais.nombre_pais)\
            .join(continente.Continente, pais.Pais.continente_pais == continente.Continente.id_continente)\
            .filter(continente.Continente.nombre_continente == nom_continente).all()
        # nom_pais = db.query(pais.Pais).join(continente.Continente).filter(continente.Continente.nombre_continente == nom_continente).all()
        if nom_pais is None:
            return {"error": "Continente no valido"}
        nom_pais = [row._asdict() for row in nom_pais]
        return nom_pais
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    
    
    
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



@app.post("/insertar_pais")
async def insertar_pais(insertar: pais.InsertarPais,db:db_con):
    try:
        # Tener en cuenta que cuando el usuario introduce el pais hay que coger con otra API a que continente pertenece y hacer una consulta para que nos de el id
        # y poder insertarle el id al pais
        db.add(**insertar.dict())
        db.commit()
        return "Pais insertado correctamente"
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

# ENDPOINT que no se va a usar al igual que el delete pero por si acaso 
# @app.put("/modificar_pais")
# async def insertar_pais(nombre_pais:str,nombre_pais_modificado:str,db:db_con):
#     try:
#         #Comprobar que el nombre del pais que se desea modificar existe
#         nom_valido = db.query(pais.Pais.nombre_pais).filter(pais.Pais.nombre_pais == nombre_pais)
#         if not nom_valido:
#             return "Pais no encontrado"
#         db.query(pais.Pais).filter(pais.Pais.nombre_pais == nombre_pais).update({pais.Pais.nombre_pais: nombre_pais_modificado}, synchronize_session=False)
#         db.commit()
#         return "Pais insertado correctamente"
#     except SQLAlchemyError as se:
#        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

from datetime import datetime
import os
import shutil
from fastapi import APIRouter,Depends,HTTPException, status, UploadFile, File
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import Annotated, Optional
from models import receta,pais
from database.database import SessionLocal
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, class_mapper, sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
from routers.usuarios import get_current_user
from models.usuario import InfoUsuario
import json, base64


app = APIRouter()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_con = Annotated[Session,Depends(get_db)]

# GET

@app.get("/mostrar_recetas") # mostrar todas las recetas
async def mostrar_recetas(db:db_con):
    try:
        recetas = db.query(receta.Receta).all()
        #Asi seria la consulta con "where" siempre al final hay que añadir "first" si solo quieres una fila si no "all"
        # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).first()
        # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).all()
        return [r.to_dict() for r in recetas]
        # return recetas
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")


@app.get("/mostrar_receta/{id_receta}") # mostrar receta pasando id
async def mostrar_receta(id_receta: int, db: db_con):
    try:
        receta_encontrada = db.query(receta.Receta).filter(receta.Receta.id_receta == id_receta).first()
        if receta_encontrada is None:
            return {"error": "Receta no encontrada"}

        # Convertir el objeto de SQLAlchemy a un diccionario
        receta_dict = jsonable_encoder(receta_encontrada)

        return receta_dict
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    
    
#Pasar quizas nombre de usuario para que pueda ser mas facil desde el front

@app.get("/recetas_usuario/{id_usuario}") # mostrar receta pasando id de usuario
async def mostrar_receta(id_usuario: int, db: db_con):
    try:
        recetas = db.query(receta.Receta).filter(receta.Receta.usuario_receta == id_usuario).all()
        if recetas is None:
            return {"error": "Usuario no encontrado"}
        return recetas
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    
    
@app.get("/recetas_pais/{pais_nom}") # mostrar receta pasando nombre del pais
async def mostrar_receta(pais_nom: str, db: db_con):
    try:
        idPais = db.query(pais.Pais.id_pais).filter(pais.Pais.nombre_pais == pais_nom).first()
        if idPais is None:
            return {"error": "Pais no encontrado"}
        recetas = db.query(receta.Receta).filter(receta.Receta.pais_receta == idPais[0]).all()
        return recetas
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    

@app.get("/recetas_filtros") # mostrar receta pasando un filtro de ingredientes
async def mostrar_receta(filtro: str, db: db_con, pagina: int = 1, items_por_pagina: int = 10):
    try:

        # Inicia la consulta
        query = db.query(receta.Receta)

        # Si hay algun filtro
        if(filtro != ''):
            # Divide los ingredientes por el caracter ';'
            ingredientes = filtro.split(';')
            for ingrediente in ingredientes:
                query = query.filter(receta.Receta.ingredientes_receta.notlike(f'%{ingrediente}%'))

        # Devuelve 10 items en funcion de la pagina
        recetas = query.offset((pagina - 1) * items_por_pagina).limit(items_por_pagina).all()

        if recetas is None:
            return {"error": "No hay recetas con ese filtro"}

        return recetas

    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    
@app.post("/insertar_imagen_receta")
async def imagen_receta(db: db_con, imagen_receta: UploadFile = File(...)):
    #Guarda imagen en local
    try:
        # Obtener la última receta
        ultima_receta = db.query(receta.Receta).order_by(receta.Receta.id_receta.desc()).first()
        ultima_receta.imagen_receta = imagen_receta.filename
        db.commit()
        
        with open(os.path.join("../../app/src/imgs", imagen_receta.filename), "wb") as buffer:
            shutil.copyfileobj(imagen_receta.file, buffer)
        return {"Imagen subida con exito"}
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    

# POST

@app.post("/insertar_receta")
async def insertar_receta(insertar: receta.InsertarReceta, db: db_con, current_user:InfoUsuario=Depends(get_current_user)):
    try:
        informacion_receta = insertar.dict()
        informacion_receta['usuario_receta'] = current_user.id_usuario
        # informacion_receta['fecha_creacion'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # informacion_receta['fecha_modificacion'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(informacion_receta)
        print(imagen_receta)
        print(informacion_receta)
        # Se podria usar **insertar.dict si no queremos modificar o añadir ningun campo a lo que hemos pedido al usuario para que inserte
        receta_insertar = receta.Receta(**informacion_receta)
        print(receta_insertar)
        db.add(receta_insertar)
        db.commit()
        return {"mensaje": "El registro se completó con éxito"}
    except ValidationError as ve:
        print(ve)
        raise HTTPException(status_code=422, detail=f"Validación fallida: {ve}")
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    finally:
        db.close()

# PUT

@app.put("/modificar_receta/{id_receta}")
async def modificar_receta(id_receta: int, actualizar: dict, db: db_con):
    try:
        receta_existente = db.query(receta.Receta).filter(receta.Receta.id_receta == id_receta).first()
        if receta_existente is None:
            raise HTTPException(status_code=404, detail=f"Receta con id {id_receta} no encontrada")
    
        datos_modificados = receta.ActualizarReceta.parse_obj(actualizar).dict(exclude_unset=True)
        # exclude_unset = True -> excluye los campos no incluidos en la solicitud PUT
        for key, value in datos_modificados.items():
            setattr(receta_existente, key, value)
        
        db.commit()
        return receta_existente
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=f"Validación fallida: {ve}")
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

# DELETE

@app.delete("/eliminar_receta/{id_receta}")
async def eliminar_receta(id_receta: int, db: db_con):
    try:
        receta_encontrada = db.query(receta.Receta).filter(receta.Receta.id_receta == id_receta).first()
        if receta_encontrada is None:
            raise HTTPException(status_code=404, detail="Receta no encontrada")
        db.delete(receta_encontrada)
        db.commit()
        return {"mensaje": "Receta eliminada correctamente"}
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

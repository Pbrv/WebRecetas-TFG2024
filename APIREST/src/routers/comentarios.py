from fastapi import APIRouter,Depends,HTTPException, status, UploadFile, File
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import Annotated, Optional
from models import comentario
from database.database import SessionLocal
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, class_mapper, sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
from jose import JWTError, jwt
import json, base64


app = APIRouter()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_con = Annotated[Session,Depends(get_db)]

SECRET_KEY = "Pilar_Imanol"
ALGORITHM = "HS256"

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

@app.get("/mostrar_comentarios") # mostrar todos los comentarios
async def mostrar_comentarios(db:db_con):
    try:
        comentarios = db.query(comentario.Comentario).all()
        return comentarios
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

@app.get("/mostrar_comentarios/{id_receta}") # mostrar todos los comentarios de una receta
async def mostrar_comentarios_receta(id_receta: int,db:db_con):
    try:
        comentarios = db.query(comentario.Comentario).filter(comentario.Comentario.id_receta_comentario == id_receta).all()
        return comentarios
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

@app.post("/insertar_comentario") # Insertar comentario en una receta
async def insertar_comentario(comentarioInsertado: comentario.InsertarComentario,db:db_con):
    try:
        #Transformar el token del local storage en el id del usuario
        comentarioInsertado.id_usuario_comentario = int(decode_token(comentarioInsertado.id_usuario_comentario))
        #Crear un nuevo comentario
        comentario_insertar = comentario.Comentario(**comentarioInsertado.dict())
        #Insertar comentario
        db.add(comentario_insertar)
        db.commit()
        return "Comentario subido" #Return de prueba no tiene que retornar nada
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
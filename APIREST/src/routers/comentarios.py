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
import json, base64


app = APIRouter()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_con = Annotated[Session,Depends(get_db)]

@app.get("/mostrar_comentarios") # mostrar todos los comentarios
async def mostrar_comentarios(db:db_con):
    try:
        comentarios = db.query(comentario.Comentario).all()
        return comentarios
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

@app.get("/mostrar_comentarios/{id_receta}") # mostrar todos los comentarios de una receta
async def mostrar_comentarios(id_receta: int,db:db_con):
    try:
        comentarios = db.query(comentario.Comentario).filter(comentario.Comentario.id_receta_comentario == id_receta).all()
        return comentarios
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
from fastapi import APIRouter,Depends,HTTPException, status, UploadFile, File
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import Annotated, Optional
from models import comentario, usuario
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


@app.get("/mostrar_comentarios") # mostrar TODOS los comentarios
async def mostrar_comentarios(db:db_con):
    try:
        comentarios = db.query(comentario.Comentario).all()
        return comentarios
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")


@app.get("/mostrar_comentarios/{id_receta}") # mostrar todos los comentarios de UNA RECETA además del nombre del usuario
async def mostrar_comentarios_receta(id_receta: int,db:db_con):
    try:
        comentarios = db.query(
            comentario.Comentario,
            usuario.Usuario.nombre_usuario
        ).join(
            usuario.Usuario, comentario.Comentario.id_usuario_comentario == usuario.Usuario.id_usuario
        ).filter(
            comentario.Comentario.id_receta_comentario == id_receta
        ).all()
        
        # Convertir los resultados en una lista de diccionarios
        resultado = []
        for c, nombre_usuario in comentarios:
            comentario_dict = c.__dict__
            comentario_dict['nombre_usuario'] = nombre_usuario
            comentario_dict.pop('_sa_instance_state', None)  # Eliminar el campo interno de SQLAlchemy
            resultado.append(comentario_dict)

        return resultado
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")


# POST

@app.post("/insertar_comentario") # Insertar comentario en una receta
async def insertar_comentario(comentarioInsertado: comentario.InsertarComentario,db:db_con):
    try:
        print("se mete")
        #Transformar el token del local storage en el id del usuario
        comentarioInsertado.id_usuario_comentario = int(decode_token(comentarioInsertado.id_usuario_comentario))
        
        # Comprobar si el usuario ya ha comentado esta receta
        comentario_existente = db.query(comentario.Comentario).filter(
            comentario.Comentario.id_usuario_comentario == comentarioInsertado.id_usuario_comentario,
            comentario.Comentario.id_receta_comentario == comentarioInsertado.id_receta_comentario
        ).first()

        if comentario_existente:
            raise HTTPException(status_code=400, detail="Ya has comentado esta receta")
        
        #Crear un nuevo comentario
        comentario_insertar = comentario.Comentario(**comentarioInsertado.dict())
        #Insertar comentario
        db.add(comentario_insertar)
        db.commit()
        return "Comentario subido" # Return de prueba no tiene que retornar nada
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    

# DELETE

@app.delete("/eliminar_comentario/{id_comentario}") # Eliminar un comentario
async def eliminar_comentario(id_comentario: int, db: db_con):
    try:
        # Buscar el comentario en la base de datos
        comentario_eliminar = db.query(comentario.Comentario).get(id_comentario)
        print(comentario_eliminar)
        if comentario_eliminar is None:
            raise HTTPException(status_code=404, detail="Comentario no encontrado")

        # Eliminar el comentario
        db.delete(comentario_eliminar)
        db.commit()

        return {"mensaje": "Comentario eliminado con éxito"}
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

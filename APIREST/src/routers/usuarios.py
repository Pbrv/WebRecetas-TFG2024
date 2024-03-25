from fastapi import APIRouter,Depends,HTTPException, status
from typing import Annotated
from models import usuario
from database.database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
import hashlib

app = APIRouter()


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_con = Annotated[Session,Depends(get_db)]


#METODO DE PRUEBA
@app.get("/mostrar_usuarios")
async def recetas_mostrar(db:db_con):
    try:
        usuarios = db.query(usuario.Usuario).all()
        #Asi seria la consulta con "where" siempre al final hay que añadir "first" si solo quieres una fila si no "all"
        # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).first()
        # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).all()
        return usuarios
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

@app.get("/recetas_guardadas_usuario/{usuario_nombre}")
async def recetas_mostrar(usuario_nombre:str, db:db_con):
    try:
        recetas_id = db.query(usuario.Usuario.recetas_guardadas_usuario).filter(usuario.Usuario.nombre_usuario == usuario_nombre).first()
        #Devuelve todos los datos de esa columna(ids de las recetas)
        return recetas_id
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

@app.get("/suscripcion_usuario/{usuario_nombre}")
async def recetas_mostrar(usuario_nombre:str, db:db_con):
    try:
        suscripcion = db.query(usuario.Usuario.suscripcion_usuario).filter(usuario.Usuario.nombre_usuario == usuario_nombre).first()
        return suscripcion
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

@app.post("/registrar_usuario")
async def recetas_mostrar(insertar: usuario.RegistrarUsuario,db:db_con):
    try:
        informacion_usuario = insertar.dict()
        #Encriptacion de pass a sha_256
        informacion_usuario['pass_usuario'] =  hashlib.sha256(informacion_usuario['pass_usuario'].encode()).hexdigest()
        informacion_usuario['suscripcion_usuario'] = 1 #Crearle de base la suscripcion gratuita
        # Se podria usar **insertar.dict si no queremos modificar o añadir ningun campo a lo que hemos pedido al usuario para que inserte
        usuario_insertar = usuario.Usuario(**informacion_usuario)
        db.add(usuario_insertar)
        db.commit()
        return "Usuario registrado correctamente"
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=f"Validación fallida: {ve}")
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    
@app.put("/modificar_suscripcion_usuario/{usuario_nombre}")
async def recetas_mostrar(usuario_nombre:str, actualizar: dict, db:db_con):
    try:
        usuario_existente = db.query(usuario.Usuario.recetas_guardadas_usuario).filter(usuario.Usuario.nombre_usuario == usuario_nombre).first()
        if usuario_existente is None:
            raise HTTPException(status_code=404, detail=f"Usuario con nombre {usuario_nombre} no encontrado")
        datos_modificados = usuario.ModificarSuscripcion.parse_obj(actualizar).dict(exclude_unset=True)
        # exclude_unset = True -> excluye los campos no incluidos en la solicitud PUT
        for key, value in datos_modificados.items():
            setattr(usuario_existente, key, value)
        db.commit()
        return "Suscripcion modificada"
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

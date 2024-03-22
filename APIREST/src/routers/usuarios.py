from fastapi import APIRouter,Depends,HTTPException, status
from typing import Annotated
from models import usuario
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


#METODO DE PRUEBA
@app.get("/mostrar_usuarios")
async def recetas_mostrar(db:db_con):
    usuarios = db.query(usuario.Usuario).all()
    #Asi seria la consulta con "where" siempre al final hay que añadir "first" si solo quieres una fila si no "all"
    # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).first()
    # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).all()
    return usuarios

@app.post("/registrar_usuario")
async def recetas_mostrar(insertar: usuario.RegistrarUsuario,db:db_con):
    informacion_usuario = insertar.dict()
    informacion_usuario['suscripcion_usuario'] = 1 #Crearle de base la suscripcion gratuita
     # Se podria usar **insertar.dict si no queremos modificar o añadir ningun campo a lo que hemos pedido al usuario para que inserte
    usuario_insertar = usuario.Usuario(**informacion_usuario)
    db.add(usuario_insertar)
    db.commit()
    return "Usuario registrado"
from fastapi import FastAPI
from routers import recetas,usuarios

app = FastAPI()
app.include_router(recetas.app)
app.include_router(usuarios.app)

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
    recetas = db.query(receta.Receta).all()
    #Asi seria la consulta con "where" siempre al final hay que añadir "first" si solo quieres una fila si no "all"
    # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).first()
    # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).all()
    return recetas

@app.get("/mostrar_receta/{id_receta}") # mostrar receta pasando id
async def mostrar_receta(id_receta: int, db: db_con):
    receta_encontrada = db.query(receta.Receta).filter(receta.Receta.id_receta == id_receta).first()
    if receta_encontrada is None:
        return {"error": "Receta no encontrada"}
    return receta_encontrada


# POST

@app.post("/insertar_receta")
async def insertar_receta(insertar: receta.InsertarReceta,db:db_con):
    informacion_receta = insertar.dict()
    informacion_receta['usuario_receta'] = 1 #Coger el id del usuario que esta ejecutando este post
     # Se podria usar **insertar.dict si no queremos modificar o añadir ningun campo a lo que hemos pedido al usuario para que inserte
    receta_insertar = receta.Receta(**informacion_receta)
    db.add(receta_insertar)
    db.commit()
    return "El registro se completo con exito"


# PUT

@app.put("/modificar_receta/{id_receta}")
async def modificar_receta(id_receta: int, actualizar: dict, db: db_con):
    receta_existente = db.query(receta.Receta).filter(receta.Receta.id_receta == id_receta).first()
    if receta_existente is None:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    
    datos_modificados = receta.ActualizarReceta.parse_obj(actualizar).dict(exclude_unset=True)
    # exclude_unset = True -> excluye los campos no incluidos en la solicitud PUT
    for key, value in datos_modificados.items():
        setattr(receta_existente, key, value)
    
    db.commit()
    return receta_existente


# DELETE

@app.delete("/eliminar_receta/{id_receta}")
async def eliminar_receta(id_receta: int, db: db_con):
    receta_encontrada = db.query(receta.Receta).filter(receta.Receta.id_receta == id_receta).first()
    if receta_encontrada is None:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    db.delete(receta_encontrada)
    db.commit()
    return {"mensaje": "Receta eliminada correctamente"}
from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import Annotated
from models.usuario import Usuario, RegistrarUsuario, InfoUsuario
from models.suscripcion import Suscripcion
from models.receta import Receta
from database.database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
import hashlib

app = APIRouter()

# JWT - En vez de usar cookies usamos tokens para validar las sesiones
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Clave secreta para firmar y verificar tokens JWT
SECRET_KEY = "Pilar_Imanol"
ALGORITHM = "HS256"

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_con = Annotated[Session,Depends(get_db)]

# Función para generar el token JWT
def create_access_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# Función para verificar y decodificar el token JWT
def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# Función para identificar al usuario con el token JWT
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        return InfoUsuario(id_usuario=user.id_usuario, nombre_usuario=user.nombre_usuario, correo_usuario=user.correo_usuario, 
                        pass_usuario=user.pass_usuario, suscripcion_usuario=user.suscripcion_usuario)
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    
# METODO DE PRUEBA

@app.get("/mostrar_usuarios")
async def recetas_mostrar(db:db_con):
    try:
        usuarios = db.query(Usuario).all()
        #Asi seria la consulta con "where" siempre al final hay que añadir "first" si solo quieres una fila si no "all"
        # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).first()
        # recetas = db.query(receta.Receta).where(receta.Receta.dificultad_receta == 1).all()
        return usuarios
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")


# Obtener usuario con el Token de Sesión

@app.get("/mi_cuenta")
async def mi_cuenta(current_user: InfoUsuario = Depends(get_current_user)):
    return current_user
    

@app.get("/recetas_guardadas_usuario/{usuario_nombre}")
async def recetas_mostrar(usuario_nombre:str, db:db_con):
    try:
        recetas_id = db.query(Usuario.recetas_guardadas_usuario).filter(Usuario.nombre_usuario == usuario_nombre).first()
        print(recetas_id)
        if recetas_id is None:
            raise HTTPException(status_code=404, detail="El usuario no tiene recetas guardadas")
        
        # Divide los ids de las recetas en una lista
        ids_recetas = recetas_id[0].split(';')

        # Comprueba la existencia de cada receta
        recetas_existentes = []
        for id_receta in ids_recetas:
            receta = db.query(Receta).filter(Receta.id_receta == id_receta).first()
            if receta is not None:
                recetas_existentes.append(id_receta)

        # Devuelve todos los datos de esa columna(ids de las recetas)
        return [';'.join(recetas_existentes)]  # Devuelve los ids de las recetas como una cadena separada por ;
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")


# Obtener recetas CREADAS por el usuario

@app.get("/usuario/{id_usuario}/recetas")
async def obtener_recetas_usuario(id_usuario: int, db: Session = Depends(get_db)):
    try:
        # Obtener las recetas del usuario
        recetas = db.query(Receta).filter(Receta.usuario_receta == id_usuario).all()
        return recetas
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")



@app.get("/nombre_suscripcion/{id_suscripcion}")
async def obtener_nombre_suscripcion(id_suscripcion: int, db: db_con):
    try:
        suscripcion_nombre_tuple = db.query(Suscripcion.nombre_suscripcion).filter(Suscripcion.id_suscripcion == id_suscripcion).first()

        if suscripcion_nombre_tuple is None:
            raise HTTPException(status_code=404, detail="No se encontró ninguna suscripción con el ID dado")

        suscripcion_nombre = suscripcion_nombre_tuple[0]

        return {"nombre_suscripcion": suscripcion_nombre}
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")



# INSERTAR USUARIO

@app.post("/registrar_usuario")
async def recetas_mostrar(insertar: RegistrarUsuario,db:db_con):
    try:
        informacion_usuario = insertar.dict()
        #Encriptacion de pass a sha_256
        informacion_usuario['pass_usuario'] =  hashlib.sha256(informacion_usuario['pass_usuario'].encode()).hexdigest()
        informacion_usuario['suscripcion_usuario'] = 1 #Crearle de base la suscripcion gratuita
        # Se podria usar **insertar.dict si no queremos modificar o añadir ningun campo a lo que hemos pedido al usuario para que inserte
        usuario_insertar = Usuario(**informacion_usuario)
        db.add(usuario_insertar)
        db.commit()
        return "Usuario registrado correctamente"
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=f"Validación fallida: {ve}")
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")


# INICIO SESION

@app.post("/login")
async def login(request: Request, db: Session = Depends(get_db)):
    # Obtener los datos de la solicitud en el cuerpo
    login_data = await request.json()
    nombre_usuario = login_data.get("nombre_usuario")
    pass_usuario = login_data.get("pass_usuario")

    # Obtener el usuario de la base de datos por nombre de usuario
    user = db.query(Usuario).filter(Usuario.nombre_usuario == nombre_usuario).first()
    
    # Si el usuario no existe, lanzar una excepción
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar la contraseña
    hashed_password = hashlib.sha256(pass_usuario.encode()).hexdigest()
    if user.pass_usuario != hashed_password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # Crear el token JWT sin fecha de expiración
    token_data = {"sub": str(user.id_usuario)}
    access_token = create_access_token(token_data)
    
    # Si la contraseña es correcta, devolver el token JWT
    return {"access_token": access_token, "token_type": "bearer"}


# CIERRE SESION

@app.post("/logout")
async def logout(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Verificar y decodificar el token JWT
    payload = decode_token(token)

    # Aquí puedes realizar cualquier limpieza necesaria para cerrar la sesión
    # Por ejemplo, podrías invalidar el token de autenticación actual si estás utilizando tokens JWT
    # También podrías eliminar cualquier cookie de sesión establecida en el navegador del usuario

    # Por ahora, simplemente devolvemos un mensaje indicando que la sesión se ha cerrado correctamente
    return {"message": "Sesión cerrada correctamente"}


# Comprobar si las recetas están guardadas o no por el usuario

@app.post("/comprobar_receta")
async def comprobar_receta(request: Request, db: Session = Depends(get_db), current_user: InfoUsuario = Depends(get_current_user)):
    # Obtener los datos de la solicitud en el cuerpo
    comprobar_data = await request.json()
    receta_id = comprobar_data.get("receta_id")
    
    # Obtener el usuario de la base de datos por id
    usuario = db.query(Usuario).filter(Usuario.id_usuario == current_user.id_usuario).first()
    
    # Si el usuario no existe
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Comprobar si la receta está guardada
    recetas_guardadas = str(receta_id) in (usuario.recetas_guardadas_usuario or "").split(";")

    return {"estaGuardada": recetas_guardadas}


# El usuario Guarda la receta

@app.post("/guardar_receta")
async def guardar_receta(request: Request, db: Session = Depends(get_db), current_user: InfoUsuario = Depends(get_current_user)):
    # Obtener los datos de la solicitud en el cuerpo
    guardar_data = await request.json()
    receta_id = guardar_data.get("receta_id")

    # Obtener el usuario de la base de datos por id
    usuario = db.query(Usuario).filter(Usuario.id_usuario == current_user.id_usuario).first()
    
    # Si el usuario no existe
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Añadir id_receta a recetas_guardadas_usuario
    if usuario.recetas_guardadas_usuario:
        usuario.recetas_guardadas_usuario += f";{receta_id}"
    else:
        # Si no hay recetas guardadas añadir el id_receta
        usuario.recetas_guardadas_usuario = str(receta_id)

    # Guardar los cambios en la base de datos
    db.commit()

    return {"message": "Receta guardada con éxito"}


# El usuario quita la receta de Guardados

@app.post("/desguardar_receta")
async def desguardar_receta(request: Request, db: Session = Depends(get_db), current_user: InfoUsuario = Depends(get_current_user)):
    # Obtener los datos de la solicitud en el cuerpo
    desguardar_data = await request.json()
    id_receta = desguardar_data.get("receta_id")
    
    # Obtener el usuario de la base de datos por id
    user = db.query(Usuario).filter(Usuario.id_usuario == current_user.id_usuario).first()
    
    # Si el usuario no existe
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Comprobar si la receta está guardada
    if user.recetas_guardadas_usuario:
        recetas_guardadas = user.recetas_guardadas_usuario.split(";")
        if str(id_receta) in recetas_guardadas:
            # Si la receta está guardada, eliminarla
            recetas_guardadas.remove(str(id_receta))
            user.recetas_guardadas_usuario = ";".join(recetas_guardadas)
        else:
            raise HTTPException(status_code=400, detail="La receta no está guardada")

    # Guardar los cambios en la base de datos
    db.commit()

    return {"message": "Receta desguardada con éxito"}


# MODIFICAR USUARIO

@app.put("/modificar_suscripcion_usuario/{usuario_nombre}")
async def recetas_mostrar(usuario_nombre:str, suscripcion: int, db:db_con):
    try:
        usuario = db.query(Usuario).filter(Usuario.nombre_usuario == usuario_nombre).first()
        if usuario is None:
            raise HTTPException(status_code=404, detail=f"Usuario con nombre {usuario_nombre} no encontrado")
        usuario.suscripcion_usuario = suscripcion
        db.commit()
        return "Suscripcion modificada"
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")

# Endpoint para hacer pruebas con recetas_guardadas_usuario
@app.put("/usuario/{id_usuario}/eliminar_receta_guardada")
async def eliminar_receta_guardada(id_usuario: int, db: db_con):
    try:
        # Buscar el usuario
        usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
        if usuario is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # Eliminar el id de la receta de la lista de recetas guardadas
        # usuario.recetas_guardadas_usuario = usuario.recetas_guardadas_usuario.replace(f"{id_receta};", "").replace(f";{id_receta}", "")

        # Vaciar la lista de recetas guardadas
        usuario.recetas_guardadas_usuario = ""
        
        db.commit()
        return {"mensaje": "Receta eliminada correctamente de las recetas guardadas"}
    except SQLAlchemyError as se:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {se}")
    finally:
        db.close()


# ELIMINAR USUARIO

@app.delete("/eliminar_usuario/{usuario_id}")
async def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    # Obtener el usuario de la base de datos por su ID
    usuario_db = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()

    # Si el usuario no existe, lanzar una excepción
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Eliminar el usuario de la base de datos
    db.delete(usuario_db)
    db.commit()

    return {"mensaje": "Usuario eliminado exitosamente"}
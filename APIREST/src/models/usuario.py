from sqlalchemy import String, Integer, Column
from pydantic import BaseModel
from database.database import Base

# Crear clase con la tabla que hay en la base de datos para luego hacer querys
class Usuario(Base):
    __tablename__="usuario"
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre_usuario = Column(String (45))
    pass_usuario = Column(String(64))
    correo_usuario = Column(String(55))
    recetas_guardadas_usuario = Column(String(255))
    suscripcion_usuario = Column(Integer)

# Crear el modelo de lo que se va a pedir al usuario para registrarse en este caso
class RegistrarUsuario(BaseModel):
    nombre_usuario: str
    pass_usuario: str
    correo_usuario: str

class ModificarSuscripcion(BaseModel):
    suscripcion_usuario: int
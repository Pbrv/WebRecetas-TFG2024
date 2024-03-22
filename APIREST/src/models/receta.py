from sqlalchemy import String, Integer, Column, Text
from pydantic import BaseModel
from database.database import Base

# Crear clase con la tabla que hay en la base de datos para luego hacer querys
class Receta(Base):
    __tablename__="receta"
    id_receta = Column(Integer, primary_key=True, index=True)
    nombre_receta = Column(String (255))
    ingredientes_receta = Column(Text)
    elaboracion_receta = Column(Text)
    dificultad_receta = Column(Integer)
    valoracion_receta = Column(Integer)
    usuario_receta = Column(Integer)
    pais_receta = Column(Integer)
    tipo_receta = Column(String(30))

# Crear el modelo de lo que se va a pedir al usuario para insertar una nueva receta en este caso
class InsertarReceta(BaseModel):
    nombre_receta: str
    ingredientes_receta: str
    elaboracion_receta: str
    dificultad_receta: int
    pais_receta: int
    tipo_receta: str
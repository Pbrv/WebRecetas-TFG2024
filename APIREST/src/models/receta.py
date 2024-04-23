from sqlalchemy import String, Integer, Column, Text, LargeBinary
from pydantic import BaseModel
from typing import Optional
from database.database import Base

# Clase con la tabla que hay en la base de datos para luego hacer querys
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
    imagen_receta = Column(LargeBinary)
    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

# Modelo de lo que se va a pedir al usuario para insertar una nueva receta en este caso
class InsertarReceta(BaseModel):
    nombre_receta: str
    ingredientes_receta: str
    elaboracion_receta: str
    dificultad_receta: int
    pais_receta: int
    tipo_receta: str
    imagen_receta: bytes
        
# Optional y None para poder modificar sólo ciertos campos
class ActualizarReceta(BaseModel):
    nombre_receta: Optional[str] = None
    ingredientes_receta: Optional[str] = None
    elaboracion_receta: Optional[str] = None
    dificultad_receta: Optional[int] = None
    pais_receta: Optional[int] = None
    tipo_receta: Optional[str] = None
    imagen_receta: Optional[bytes] = None
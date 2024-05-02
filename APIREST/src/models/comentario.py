from sqlalchemy import String, Integer, Column
from pydantic import BaseModel
from database.database import Base

# Clase con la tabla que hay en la base de datos para luego hacer querys
class Comentario(Base):
    __tablename__="comentario"
    id_comentario = Column(Integer, primary_key=True, index=True)
    id_usuario_comentario = Column(Integer)
    id_receta_comentario = Column(Integer)
    descripcion_comentario = Column(String (255))
    valoracion_comentario = Column(Integer)

class InsertarComentario(BaseModel):
    id_usuario_comentario: int
    id_receta_comentario: int
    descripcion_comentario: str
    valoracion_comentario: int

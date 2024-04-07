from sqlalchemy import String, Integer, Column, Text
from pydantic import BaseModel
from database.database import Base

# Clase con la tabla que hay en la base de datos para luego hacer querys
class Pais(Base):
    __tablename__="pais"
    id_pais = Column(Integer, primary_key=True, index=True)
    nombre_pais = Column(String (70))
    continente_pais = Column(Integer)

# Modelo de lo que se va a pedir al usuario para insertar un nuevo pais
class InsertarPais(BaseModel):
    nombre_pais: str
    #Coger continente de una consulta a una api o algo asi
    continente_pais: int
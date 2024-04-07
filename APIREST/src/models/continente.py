from sqlalchemy import String, Integer, Column
from database.database import Base

# Clase con la tabla que hay en la base de datos para luego hacer querys
class Continente(Base):
    __tablename__="continente"
    id_continente = Column(Integer, primary_key=True, index=True)
    nombre_continente = Column(String (30))

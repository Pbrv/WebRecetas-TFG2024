from sqlalchemy import Column, Integer, String
from database.database import Base

class Suscripcion(Base):
    __tablename__ = "suscripcion"
    id_suscripcion = Column(Integer, primary_key=True, index=True)
    nombre_suscripcion = Column(String)

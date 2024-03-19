from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class User(BaseModel):
    nombreusuario: str
    nombre: str
    email: str
    disabled: bool

class UserDB(User):
    contraseña: str


users_db = {
    "pilar": {
        "nombreusuario": "pbrv",
        "nombre": "Pilar Bravo",
        "email": "pilarbravo.17@gmail.com",
        "disabled": False,
        "contraseña": "123456"
    },
    "imanol": {
        "nombreusuario": "ima",
        "nombre": "Imanol Alonso",
        "email": "imalonso@gmail.com",
        "disabled": True,
        "contraseña": "654321"
    }
}

def search_user(nombreusuario: str):
    if nombreusuario in users_db:
        return UserDB(users_db[nombreusuario])
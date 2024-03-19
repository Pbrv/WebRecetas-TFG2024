from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["Usuarios"])

#Levantar el servidor uvicorn users:app --reload

#Entidad user
class User(BaseModel):
    id: int
    nombre: str
    apellido: str
    edad: int
    
#Lista de usuarios
users_list = [User(id=1, nombre="Pilar", apellido="Bravo", edad=27),
            User(id=2, nombre="Imanol", apellido="Alonso", edad=27)]
    
@router.get("/users")
async def users():
    return users_list


#Parámetros de PATH --> Parámetros fijos

# GET
@router.get("/user/{id}")
async def user(id: int):
    return search_user(id)


#Parámetros de QUERY --> Parámetros dinámicos
#En la URL de la petición ponemos /userquery/?id=1


@router.get("/user/")
async def user(id: int):
    return search_user(id)


# POST
@router.post("/user/", response_model=User, status_code=201) # 201 -> created
async def user(user: User):
    if type(search_user(user.id)) == User:
        raise HTTPException(status_code=404, detail="El usuario ya existe") # 404 -> Not Found
    
    users_list.append(user)
    return user


# PUT
@router.put("/user/{id}")
async def user(user: User):
    
    found = False
    
    for index, saved_user in enumerate(users_list):
        if saved_user.id == user.id:
            users_list[index] = user
            found = True
            
    if not found:
        return {"error":"No se ha encontrado el usuario"}
    else:
        return user


# DELETE
@router.delete("/user/{id}")
async def user(id: int):
    found = False
    
    for index, saved_user in enumerate(users_list):
        if saved_user.id == id:
            del users_list[index] # lo elimina
            found = True
        
    if not found:
        return {"error":"No se ha encontrado el usuario"}
    else:
        return "Se ha eliminado el usuario"

def search_user(id: int):
    users = filter(lambda user: user.id == id, users_list)
    try:
        return list(users)[0]
    except:
        return {"error":"No se ha encontrado el usuario"}
    

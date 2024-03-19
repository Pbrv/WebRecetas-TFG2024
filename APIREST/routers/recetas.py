from fastapi import APIRouter

router = APIRouter(prefix="/recetas",
                tags=["Recetas"], # Para Swagger
                responses={404: {"message": "No encontrado"}})

recetas_list = ["Receta 1", "Receta 2", "Receta 3"]


@router.get("/")
async def recetas():
    return ["Receta 1", "Receta 2", "Receta 3"]


@router.get("/({id})")
async def recetas(id: int):
    return recetas_list[id]
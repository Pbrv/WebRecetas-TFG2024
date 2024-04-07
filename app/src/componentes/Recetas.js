import {React, useEffect,useState} from "react";
import "../stylesheets/Home.css";
import Receta from "./Receta";

function Recetas (){
    const [recetas, setRecetas] = useState([]);
    const [filtros, setFiltros] = useState('prueba1;patata');
    // Hacer que se muestren todas las recetas si no hay filtros
    useEffect(() => {
        fetch(`http://localhost:8000/recetas_filtros/${filtros}`)
            .then(response => response.json())
            .then((recetas) => setRecetas(recetas));
    }, [filtros]);

    // Funcion para cuando se añada un ingrediente a filtrar o se elimine
    function cambiar_filtros(){
        var ingrdientes_filtro = filtros.split(";")
        console.log(ingrdientes_filtro)
        ingrdientes_filtro.splice(ingrdientes_filtro.indexOf("patata"),1)
        console.log(ingrdientes_filtro)
        //Usar el setFiltros
    }
    cambiar_filtros()
    return(
        <div>
            {/* ID puesto para saber que contiene */}
            <div id="filtros">

            </div>
            <div className="recetas-destacadas">
                    {recetas.map((receta) => (
                        <Receta key={receta.id} {...receta} />
                    ))}
            </div>
        </div>
        
    );
}

export default Recetas

import {React, useEffect,useState} from "react";
import "../stylesheets/Home.css";
import Receta from "./Receta";

function Recetas (){
    const [recetas, setRecetas] = useState([]);
    const [filtros, setFiltros] = useState('');
    // Hacer que se muestren todas las recetas si no hay filtros
    useEffect(() => {
        fetch(`http://localhost:8000/recetas_filtros/?filtro=${filtros}`)
            .then(response => response.json())
            .then((recetas) => setRecetas(recetas));
    }, [filtros]);

    // Funcion para cuando se añada un ingrediente a filtrar o se elimine
    const cambiar_filtros = (value) => {
        //Mejorarlo con alguna funcion que diga si esta activo o no para no tener que comprobar si lo incluye
        if (filtros.includes(';'+value)){
            setFiltros(filtros.replace(';'+ value,''))
        } else if (filtros.includes(value + ';')) {
            setFiltros(filtros.replace(value + ';',''))
        } else if(filtros.includes(value)){
            setFiltros(filtros.replace(value,''))
        } else {
            filtros == '' ? setFiltros(value) : setFiltros(filtros.concat(';' + value));
        }
    }

    return(
        <div>
            {/* ID puesto para saber que contiene */}
            <div id="filtros">
                {/* Poner tantos filtros como queramos */}
                <button onClick={(e)=> cambiar_filtros(e.target.innerText)}>Patata</button>
                <button onClick={(e)=> cambiar_filtros(e.target.innerText)}>Prueba1</button>
                <button onClick={(e)=> cambiar_filtros(e.target.innerText)}>Salsa</button>
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

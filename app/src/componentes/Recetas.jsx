import {React, useEffect,useState} from "react";
import "../stylesheets/Home.css";
import "../stylesheets/Recetas.css";
import Receta from "./Receta";
import Boton from "./Boton";

function Recetas (){
    const [recetas, setRecetas] = useState([]);
    const [filtros, setFiltros] = useState('');
    const filtrosDisponibles = ['Salsa','Patata','Queso','Lechuga','Arroz'];

    // Hacer que se muestren todas las recetas si no hay filtros
    useEffect(() => {
        fetch(`http://localhost:8000/recetas_filtros/?filtro=${filtros}`)
            .then(response => response.json())
            .then((recetas) => setRecetas(recetas));
    }, [filtros]);

    // Funcion para cuando se añada un ingrediente a filtrar o se elimine
    const cambiar_filtros = (value, e) => {
        //Mejorarlo con alguna funcion que diga si esta activo o no para no tener que comprobar si lo incluye
        if (filtros.includes(';'+value)){
            setFiltros(filtros.replace(';'+ value,''))
        } else if (filtros.includes(value + ';')) {
            setFiltros(filtros.replace(value + ';',''))
        } else if(filtros.includes(value)){
            setFiltros(filtros.replace(value,''))
        } else {
            filtros === '' ? setFiltros(value) : setFiltros(filtros.concat(';' + value));
        }
        e.classList.toggle("boton-selected");
    }

    return(
        <div className="contenedor-recetas">
            {/* ID puesto para saber que contiene */}
            <div id="filtros">
                {filtrosDisponibles.map((filtro, index) => (
                    <Boton key={index} onClick={(e) => cambiar_filtros(e.target.innerText, e.target)} value={filtro} />
                ))}
            </div>
            <div className="recetas-destacadas">
                    {recetas.map((receta) => (
                        <Receta key={receta.id_receta} {...receta} />
                    ))}
            </div>
        </div>
    );
}

export default Recetas

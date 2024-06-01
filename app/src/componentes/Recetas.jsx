import {React, useEffect,useState} from "react";
import "../stylesheets/Home.css";
import "../stylesheets/Recetas.css";
import Receta from "./Receta";
import Boton from "./Boton";

function Recetas (){
    const [recetas, setRecetas] = useState([]);
    const [filtros, setFiltros] = useState('');
    const [pagina, setPagina] = useState(1); //Paginacion de las recetas
    const filtrosDisponibles = ['Salsa','Patata','Queso','Lechuga','Arroz'];

    // Hacer que se muestren todas las recetas si no hay filtros
    useEffect(() => {
        fetch(`http://localhost:8000/recetas_filtros/?filtro=${filtros}&pagina=${pagina}`)
            .then(response => response.json())
            .then((recetas) => {
                if(recetas.length === 0) {
                    setPagina(pagina - 1);
                } else {
                    setRecetas(recetas)
                }
            });
    }, [filtros, pagina]);

    // Funcion para cuando se añada un ingrediente a filtrar o se elimine
    const cambiar_filtros = (value, e) => {
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
            <Boton key={2} onClick={() => setPagina(pagina > 1 ? pagina - 1 : 1)} value={'Página anterior'} />
            <Boton key={1} onClick={() => setPagina(pagina + 1)} value={'Siguiente página'} />
            <span className="mensaje-error" style={{display:'none'}}>Máximo de recetas</span>
        </div>
    );
}

export default Recetas

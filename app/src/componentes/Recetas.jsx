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
    const [mostrarDificultad, setMostrarDificultad] = useState(false); // Filtro de dificultad
    let valorFiltro;

    // Hacer que se muestren todas las recetas si no hay filtros
    useEffect(() => {
        fetch(`http://localhost:8000/recetas_filtros/?filtro=${filtros}&dificultad=${valorFiltro}&pagina=${pagina}`)
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
        let valorFiltro;
        switch(value) {
            case 'Muy facil':
                valorFiltro = 1;
                break;
            case 'Facil':
                valorFiltro = 2;
                break;
            case 'Medio':
                valorFiltro = 3;
                break;
            case 'Dificil':
                valorFiltro = 4;
                break;
            case 'Muy dificil':
                valorFiltro = 5;
                break;
            default:
                valorFiltro = value;
        }
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
        <main className="main-recetas">
            <div className="div-recetas-filtros">
                {/* ID puesto para saber que contiene */}
                <div id="filtros_recetas">
                    <h4>Filtra aquí tus resultados</h4>
                    <div className="div-botones-filtros">
                    <Boton onClick={() => setMostrarDificultad(!mostrarDificultad)} value="Dificultad" />
                        {mostrarDificultad && (
                            <div className="div-botones-dificultad">
                                {['Muy facil', 'Facil', 'Medio', 'Dificil', 'Muy dificil'].map((dificultad, index) => (
                                    <Boton key={index} onClick={(e) => cambiar_filtros(e.target.innerText, e.target)} value={dificultad} />
                                ))}
                            </div>
                        )}
                        {filtrosDisponibles.map((filtro, index) => (
                            <Boton key={index} onClick={(e) => cambiar_filtros(e.target.innerText, e.target)} value={filtro} />
                        ))}
                        
                    </div>
                </div>
                <div className="recetas-destacadas">
                    {recetas.map((receta) => (
                        <Receta key={receta.id_receta} {...receta} />
                    ))}
                </div>
            </div>
                
            <div className="div-paginacion">
                <Boton key={2} onClick={() => setPagina(pagina > 1 ? pagina - 1 : 1)} value={'Página anterior'} />
                <Boton key={1} onClick={() => setPagina(pagina + 1)} value={'Siguiente página'} />
                <span className="mensaje-error" style={{display:'none'}}>Máximo de recetas</span>
            </div>
        </main>
    );
}

export default Recetas

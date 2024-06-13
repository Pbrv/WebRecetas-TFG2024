import {React, useEffect,useState} from "react";
import "../stylesheets/Home.css";
import "../stylesheets/Recetas.css";
import Receta from "./Receta";
import Boton from "./Boton";

function Recetas (){
    const [recetas, setRecetas] = useState([]);
    const [filtros, setFiltros] = useState('');
    const [dificultadSeleccionada, setdificultadSeleccionada] = useState('');
    const [tipoSeleccionado, setTipoSeleccionado] = useState('');
    const [pagina, setPagina] = useState(1); //Paginacion de las recetas
    const [mostrarDificultad, setMostrarDificultad] = useState(false); // Filtro de dificultad
    const [mostrarTipo, setMostrarTipo] = useState(false); 
    const [mostrarFiltro, setMostrarFiltro] = useState(false); 
    const [cargando, setCargando] = useState(false);
    const filtrosDisponibles = ['Salsa','Patata','Queso','Lechuga','Arroz', 'Huevo', 'Café'];
    const dificultad = ['Facil', 'Medio', 'Dificil', 'Muy dificil']
    const tipo = ['Comida', 'Cena', 'Postre', 'Bebida', 'Desayuno', 'Salsa']
    
    let valorFiltro;

    // Hacer que se muestren todas las recetas si no hay filtros
    useEffect(() => {
        setCargando(true);
        fetch(`http://localhost:8000/recetas_filtros/?filtro=${filtros}&dificultad=${dificultadSeleccionada}&tipo=${tipoSeleccionado}&pagina=${pagina}`)
            .then(response => response.json())
            .then((recetas) => {
                if(recetas.length === 0 && pagina !== 1) {
                    setPagina(pagina - 1);
                } else {
                    setRecetas(recetas)
                }
                setCargando(false);
            });
    }, [filtros, dificultadSeleccionada, tipoSeleccionado, pagina]);

    // Funcion para cuando se añada un ingrediente a filtrar o se elimine
    const cambiar_filtros = (value, e) => {

        if(dificultadSeleccionada - 1 == dificultad.indexOf(value)) {
            setdificultadSeleccionada('');
        } else {
            if(dificultadSeleccionada && dificultad.includes(value)){
                document.getElementById(dificultadSeleccionada - 1).classList.toggle('boton-selected');
            }
            switch(value) {
                case 'Facil':
                    setdificultadSeleccionada(1);
                    break;
                case 'Medio':
                    setdificultadSeleccionada(2);
                    break;
                case 'Dificil':
                    setdificultadSeleccionada(3);
                    break;
                case 'Muy dificil':
                    setdificultadSeleccionada(4);
                    break;
                default:
                    valorFiltro = valorFiltro;
            }
        }
        
        if(!dificultad.includes(value) && !tipo.includes(value)) {
            if (filtros.includes(';'+ value)){
                setFiltros(filtros.replace(';'+ value,''))
            } else if (filtros.includes(value + ';')) {
                setFiltros(filtros.replace(value + ';',''))
            } else if(filtros.includes(value)){
                setFiltros(filtros.replace(value,''))
            } else {
                filtros === '' ? setFiltros(value) : setFiltros(filtros.concat(';' + value));
            }
        }

        if(tipo.includes(value)) {
            if(tipoSeleccionado && tipoSeleccionado !== value){
                document.getElementById(tipoSeleccionado).classList.toggle('boton-selected')
            }
            if(tipoSeleccionado !== value) {
                setTipoSeleccionado(value)
            } else {
                setTipoSeleccionado('')
            }
        }

        e.classList.toggle("boton-selected");
    }

    return(
        <main className="main-recetas">
            <div className="div-recetas-filtros">
                <div className="prueba">
                    {/* ID puesto para saber que contiene */}
                    <div id="filtros_recetas">
                        <h4>Filtra aquí tus resultados</h4>
                        <div className="div-botones-filtros">
                        <Boton onClick={() => setMostrarDificultad(!mostrarDificultad)} value="Dificultad" />
                            {mostrarDificultad && (
                                <div className="div-botones-dificultad">
                                    {dificultad.map((dificultad, index) => (
                                        <Boton id={index} key={index} onClick={(e) => cambiar_filtros(e.target.innerText, e.target)} value={dificultad} />
                                    ))}
                                </div>
                            )}
                        <Boton onClick={() => setMostrarTipo(!mostrarTipo)} value="Tipo" />
                        {mostrarTipo && (
                            <div className="div-botones-dificultad">
                                {tipo.map((tipo, index) => (
                                    <Boton id={tipo} key={index} onClick={(e) => cambiar_filtros(e.target.innerText, e.target)} value={tipo} />
                                ))}
                            </div>
                        )}
                        <Boton onClick={() => setMostrarFiltro(!mostrarFiltro)} value="Ingredientes" />
                        {mostrarFiltro && (
                            <div className="div-botones-dificultad">
                                {filtrosDisponibles.map((filtro, index) => (
                                    <Boton id={filtro} key={index} onClick={(e) => cambiar_filtros(e.target.innerText, e.target)} value={filtro} />
                                ))}
                            </div>
                        )}
                            
                        </div>
                    </div>
                </div>
                <div className="recetas-destacadas">
                    {cargando ? (
                        <span className="mensaje-cargando">Cargando recetas...</span>
                    ) : recetas.length > 0 ? (
                        recetas.map((receta) => (
                            <Receta key={receta.id_receta} {...receta} />
                        ))
                    ) : (
                        <span className="mensaje-error">No hay recetas con esos filtros</span>
                    )}
                </div>
            </div>
                
            <div className="div-paginacion">
                <Boton key={2} onClick={() => setPagina(pagina > 1 ? pagina - 1 : 1)} value={'Página anterior'} />
                <Boton key={1} onClick={() => recetas.length > 0 ? setPagina(pagina + 1) : setPagina(pagina)} value={'Siguiente página'} />
                <span className="mensaje-error" style={{display:'none'}}>Máximo de recetas</span>
            </div>
        </main>
    );
}

export default Recetas

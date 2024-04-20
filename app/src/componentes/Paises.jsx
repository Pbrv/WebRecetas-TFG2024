import {React, useEffect,useState} from "react";
import "../stylesheets/Home.css";
import Receta from "./Receta";
import Boton from './Boton';

function Paises (){
    const [recetas, setRecetas] = useState([]);
    const [paises, setPaises] = useState(['España']);
    const [botones, setBotones] = useState([]);
    const [continente, setContinentes] = useState(['Europa']);
    var value;
    // Hacer que se muestren todas las recetas si no hay paises

    // useEffect(() => {
    //     fetch(`http://localhost:8000/mostrar_continentes`)
    //         .then(response => response.json())
    //         .then((cont) => {
    //             // console.log(continente)
    //             // setContinentes(continente)
    //             for(value in cont){
    //                 setContinentes(cont[value]['nombre_continente'])
    //             }
    //         });
    // }, []);

    useEffect(() => {
        fetch(`http://localhost:8000/mostrar_paises/${continente}`)
            .then(response => response.json())
            .then((paises) => setBotones(paises));
    }, [continente]);

    useEffect(() => {
        fetch(`http://localhost:8000/recetas_pais/${paises}`)
            .then(response => response.json())
            .then((receta) => setRecetas(receta));
    },[paises]);


    //Filtrar por un unico pais/continente o permitir mas de uno?
    function cambiar_paises (value) {
        setPaises(value);
    }

    return(
        <div>
            {/* ID puesto para saber que contiene */}
            <div id="filtros">
                {botones.map((boton) => {
                    return <Boton onClick={(e) => cambiar_paises(e.target.innerText)} key={boton.id} {...boton} />
                })}
            </div>
            <div className="recetas-destacadas">
                {recetas.map((receta) => {
                    return <Receta key={receta.id} {...receta} />
                })}
            </div>
        </div>
        
    );
}

export default Paises;
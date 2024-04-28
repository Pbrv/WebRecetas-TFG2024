import React, { useEffect, useState } from "react";
import "../stylesheets/Home.css";
import Receta from "./Receta";
import Boton from "./Boton";

function Paises() {
    const [recetas, setRecetas] = useState([]);
    const [paises, setPaises] = useState(null);
    const [botones, setBotones] = useState([]);
    const continentes = ["Europa","Asia","Africa","America","Oceania"];

    useEffect(() => {
        // Obtener datos de los países
        const obtenerDatosPaises = async () => {
            const datosPaises = await Promise.all(
                continentes.map(async (continente) => {
                    const response = await fetch(
                    `http://localhost:8000/mostrar_paises/${continente}`
                    );
                    const pais = await response.json();
                    return pais;
                })
            );
            // Actualizar el estado con los datos de los países
            const paisesData = datosPaises.flat(); // Aplanar el array de datos
            setBotones(paisesData); //Actualizar los botones
        };
        obtenerDatosPaises();
    }, []);

  //Mostrar solo recetas de un unico pais
    useEffect(() => {
        const obtenerRecetas = async () => {
            if(paises === null){
                console.log("Entra por null")
                    const response = await fetch(
                        `http://localhost:8000/mostrar_recetas`
                    );
                    const receta = await response.json();
                    setRecetas(receta);
            } else {
                console.log("Entra por valor")
                const response = await fetch(
                    `http://localhost:8000/recetas_pais/${paises}`
                );
                const receta = await response.json();
                setRecetas(receta);
            }
        };
        obtenerRecetas();
    }, [paises]);

    function cambiarPaises(value) {
        setPaises(value);
    }


    //Poner boton para borrar filtro o si se vuelve a hacer clic en el ultimo pais se elimina el filtro
    return (
        <div>
            <div id="filtros">
                {botones.map((boton, index) => (
                    <Boton key={index} onClick={(e) => cambiarPaises(e.target.innerText)} {...boton} />
                ))}
            </div>
            <div className="recetas-destacadas">
                {recetas.map((receta, index) => (
                    <Receta key={index} {...receta} />
                ))}
            </div>
        </div>
    );
}

export default Paises;
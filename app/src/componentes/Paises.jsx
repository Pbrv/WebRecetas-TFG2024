import React, { useEffect, useState } from "react";
import "../stylesheets/Home.css";
import Receta from "./Receta";
import Boton from "./Boton";

function Paises() {
    const [recetas, setRecetas] = useState([]);
    const [paises, setPaises] = useState(null);
    const [botones, setBotones] = useState([]);
    const CONTINENTES = ["Europa","Asia","Africa","America","Oceania"];

    useEffect(() => {
        // Obtener datos de los países
        const obtenerDatosPaises = async () => {
            const datosPaises = await Promise.all(
                CONTINENTES.map(async (continente) => {
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

    // async function obtenerRecetas() {
    //     if(paises === null){
    //             const response = await fetch(
    //                 `http://localhost:8000/mostrar_recetas`
    //             );
    //             const receta = await response.json();
    //             setRecetas(receta);
    //     } else {
    //         const response = await fetch(
    //             `http://localhost:8000/recetas_pais/${paises}`
    //         );
    //         const receta = await response.json();
    //         setRecetas(receta);
    //     }
    // };

  //Mostrar solo recetas de un unico pais
    useEffect(() => {
        const obtenerRecetas = async () => {
            if(paises === null){
                const response = await fetch(
                    `http://localhost:8000/mostrar_recetas`
                );
                const receta = await response.json();
                setRecetas(receta);
            } else {
                const response = await fetch(
                    `http://localhost:8000/recetas_pais/${paises}`
                );
                const receta = await response.json();
                setRecetas(receta);
            }
        };
        obtenerRecetas();
    }, [paises]);

    function cambiarPaises(value, e) {
        comprobarBotonSeleccionado(e);
        paises === value ? setPaises(null) : setPaises(value);
    }

    function comprobarBotonSeleccionado(e) {
        var divBotones = document.querySelector("#filtros");
        divBotones.childNodes.forEach((boton) => {
            if(boton.classList.contains("boton-selected") && boton.textContent !== e.textContent){
                boton.classList.remove("boton-selected");
            }
        })
        e.classList.toggle("boton-selected");
    }

    return (
        <div>
            <div id="filtros">
                {/* Se pasa index porque al ser un array tienen un index y es unico */}
                {botones.map((boton, index) => (
                    <Boton key={index} onClick={(e) => cambiarPaises(e.target.innerText, e.target)} value={boton.nombre_pais} />
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
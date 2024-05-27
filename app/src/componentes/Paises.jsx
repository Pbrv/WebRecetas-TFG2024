import React, { useEffect, useState } from "react";
import "../stylesheets/Home.css";
import "../stylesheets/Paises.css";
import Receta from "./Receta";
import Boton from "./Boton";

function Paises() {
    const [recetas, setRecetas] = useState([]);
    const [paises, setPaises] = useState({});
    const [continentes, setContinentes] = useState([]);
    const [continenteActivo, setContinenteActivo] = useState(null);
    const [paisActivo, setPaisActivo] = useState(null);

    useEffect(() => {
        // Obtener continentes
        const obtenerContinentes = async () => {
            try {
                const response = await fetch('http://localhost:8000/mostrar_continentes');
                const data = await response.json();
                setContinentes(data);
            } catch (error) {
                console.error("Error al obtener los continentes:", error);
            }
        };
        obtenerContinentes();
    }, []);

    const fetchPaises = async (nombreContinente) => {
        try {
            const response = await fetch(`http://localhost:8000/mostrar_paises/${nombreContinente}`);
            const data = await response.json();
            setPaises((prevState) => ({
                ...prevState,
                [nombreContinente]: data,
            }));
            setContinenteActivo(nombreContinente);
        } catch (error) {
            console.error("Error al obtener los países:", error);
        }
    };

    const handleContinentClick = (nombreContinente) => {  // Limpia los países actuales antes de cargar los nuevos
        if (continenteActivo !== nombreContinente) {
            setPaises({});
            setPaisActivo(null);
            fetchPaises(nombreContinente);
        } else {
            setContinenteActivo(null);
        }
    };

    useEffect(() => {
        const obtenerRecetas = async () => {
            let url;
            if (paisActivo === null) {
                url = `http://localhost:8000/mostrar_recetas`;
            } else {
                url = `http://localhost:8000/recetas_pais/${paisActivo}`;
            }
            const response = await fetch(url);
            const receta = await response.json();
            setRecetas(receta);
        };
        obtenerRecetas();
    }, [paisActivo]);

    const cambiarPaises = (pais, e) => {
        comprobarBotonSeleccionado(e);
        setPaisActivo(pais === paisActivo ? null : pais);
    };

    const comprobarBotonSeleccionado = (e) => {
        const divBotones = document.querySelector("#filtros");
        divBotones.childNodes.forEach((boton) => {
            if (boton.classList.contains("boton-selected") && boton.textContent !== e.textContent) {
                boton.classList.remove("boton-selected");
            }
        });
        e.classList.toggle("boton-selected");
    };

    return (
        <div className="contenedor-paises">
            <h2>{continenteActivo ? "Selecciona un país" : "Selecciona un continente"}</h2>
            <div className="contenedor-continentes">
                {continentes.map((continente) => (
                    <div 
                        key={continente.id_continente} 
                        className={`continente ${continenteActivo === continente.nombre_continente ? "continente-activo" : ""}`}  
                        onClick={() => 
                        handleContinentClick(continente.nombre_continente)}>
                            <img src={`./continentes/${continente.nombre_continente}.png`} alt={continente.nombre_continente} className="imagen-continente" />
                            <div className="nombre-continente">{continente.nombre_continente}</div>
                            {continenteActivo === continente.nombre_continente && (
                                <div id="filtros">
                                    {paises[continenteActivo]?.map((pais) => (
                                        <Boton 
                                            id="boton-pais"
                                            key={pais.id_pais}
                                            onClick={(e) => 
                                                cambiarPaises(pais.nombre_pais, e.target)} value={pais.nombre_pais} />
                                    ))}
                                </div>
                                
                            )}
                    </div>
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
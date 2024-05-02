import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../stylesheets/RecetaUnica.css";
import Comentario from "./Comentario";

function RecetaUnica() {

    //Acceder al parametro que viene por url
    const {id} = useParams();
    
    const [comentarios, setComentarios] = useState([]);
    const [recetas, setRecetas] = useState([]);

    useEffect(() => {
        const obtenerDatos = async () => {
            const response = await fetch(
                `http://localhost:8000/mostrar_comentarios/${id}`
            );
            const comentario = await response.json();
            setComentarios(comentario);
            
            const responseReceta = await fetch (
                `http://localhost:8000/mostrar_receta/${id}`
            );
            const receta = await responseReceta.json();
            setRecetas(receta);
        };
        obtenerDatos();
    }, []);

    return (
        <> 
            <div className="contenedor-home"></div>
            <div className="contenedor-recetaUnica">
                <section className="ingredientes">
                    <p>Ingredientes</p>
                    {/* Si estan cargados los valores se muestran */}
                    {recetas && recetas.ingredientes_receta && recetas.ingredientes_receta.split(';').map((ingrediente, index) => (
                        <li key={index}>{ingrediente}</li>
                    ))}
                </section>
                <aside className="elaboracion">
                    <p>Elaboracion</p>
                    {/* Si estan cargados los valores se muestran */}
                    {recetas && recetas.elaboracion_receta && recetas.elaboracion_receta.split(';').map((paso, index) => (
                        <li key={index}>{paso}</li>
                    ))}
                </aside>
            </div>
            <div className="comentarios">
                {comentarios.map((comentario) => (
                    <Comentario key={comentario.id_comentario} {...comentario} />
                ))}
            </div>
        </>
    );
}
export default RecetaUnica;
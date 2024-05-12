import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../stylesheets/RecetaUnica.css";
import Comentario from "./Comentario";

function RecetaUnica() {

    //Acceder al parametro que viene por url
    const {id} = useParams();
    
    const [comentarios, setComentarios] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [comentario, setComentario] = useState({
        id_receta_comentario: id,
        id_usuario_comentario: localStorage.getItem('token'),
        descripcion_comentario: "",
        valoracion_comentario: null
    })

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

    async function enviarComentario() {
        let coment = document.getElementById("comentario");
        try {
            setComentario({...comentario, "descripcion_comentario": coment.value})
            const response = await fetch("/insertar_comentario", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comentario)
            });
            const data = await response.json();
            coment.value = '';
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main>
            {recetas && recetas.imagen_receta &&(
                <div style={{backgroundImage: `url(${recetas.imagen_receta})`}} className="imagen-receta"></div>
            )}    
            <div className="nombre-receta">
                <h1>{recetas.nombre_receta}</h1>
            </div>
            <div className="contenedor-recetaUnica">
                <section className="section-ingredientes">
                    <p className="titulo-recetaUnica">Ingredientes</p>
                    {/* Si estan cargados los valores se muestran */}
                    <div className="ingredientes">
                        {recetas.ingredientes_receta && recetas.ingredientes_receta.split(';').map((ingrediente, index) => (
                            <li key={index}>{ingrediente.charAt(0).toUpperCase() + ingrediente.slice(1)}</li>
                        ))}
                    </div>
                </section>
                <section className="section-elaboracion">
                    <p className="titulo-recetaUnica">Elaboración</p>
                    {/* Si estan cargados los valores se muestran */}
                    <div className="elaboracion">
                        {recetas.elaboracion_receta && recetas.elaboracion_receta.split(';').map((paso, index) => (
                            <li key={index}>{paso}</li>
                        ))}
                    </div>
                </section>
            </div>
            <div className="comentarios">
                {comentarios.map((comentario) => (
                    <Comentario key={comentario.id_comentario} {...comentario} />
                ))}
            </div>
            <div className="nuevoComentario">
                <section>
                    <label>
                        <textarea name="descripcion" id="comentario" placeholder="Introduce tu comentario..." rows={12} cols={52} />
                    </label>
                    <br />
                    <button onClick={enviarComentario}>Enviar comentario</button>
                </section>
            </div>
        </main>
    );
}
export default RecetaUnica;
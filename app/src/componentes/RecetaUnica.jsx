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
                <section className="elaboracion">
                    <p>Elaboracion</p>
                    {/* Si estan cargados los valores se muestran */}
                    {recetas && recetas.elaboracion_receta && recetas.elaboracion_receta.split(';').map((paso, index) => (
                        <li key={index}>{paso}</li>
                    ))}
                </section>
            </div>
            <div className="comentarios">
                {comentarios.map((comentario) => (
                    <Comentario key={comentario.id_comentario} {...comentario} />
                ))}
            </div>
            <div>
                <section>
                    <label>
                        <textarea name="descripcion" id="comentario" placeholder="Introduce tu comentario..." rows={10} cols={80} />
                    </label>
                    <br />
                    <button onClick={enviarComentario}>Enviar comentario</button>
                </section>
            </div>
        </>
    );
}
export default RecetaUnica;
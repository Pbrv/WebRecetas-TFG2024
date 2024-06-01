import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../stylesheets/RecetaUnica.css";
import Comentario from "./Comentario";
import { useNavigate } from 'react-router-dom';

function RecetaUnica() {
    const navigate = useNavigate();
    const {id} = useParams();
    
    const [comentarios, setComentarios] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [comentario, setComentario] = useState({
        id_receta_comentario: id,
        id_usuario_comentario: localStorage.getItem('token'),
        descripcion_comentario: "",
        valoracion_comentario: 0
    })

    useEffect(() => {
        const obtenerDatos = async () => {
            const response = await fetch(
                `http://localhost:8000/mostrar_comentarios/${id}`
            );
            const comentarios = await response.json();
            setComentarios(comentarios);
            
            const responseReceta = await fetch (
                `http://localhost:8000/mostrar_receta/${id}`
            );
            const receta = await responseReceta.json();
            setRecetas(receta);
        };
        obtenerDatos();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setComentario({ ...comentario, [name]: value });
    };

    async function enviarComentario() {
        const token = localStorage.getItem("token");
        // let coment = document.getElementById("comentario").value;
        if (!token) {  // Si no hay un usuario logueado, redirige a la página de inicio de sesión
            navigate('/login');
            return;
        }
        if (comentario.descripcion_comentario.trim() === "") {
            alert("Por favor, introduce un comentario válido.");
            return;
        }
        // setComentario({...comentario, 'descripcion_comentario': coment})
        // console.log('descripcion_comentario')
        try {
            const response = await fetch("/insertar_comentario", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comentario)
            });
            if (!response.ok) {
                const data = await response.json();
                if (data.detail === "Ya has comentado esta receta") { // Controla si el usuario ya ha comentado esa receta
                    // Muestra un mensaje al usuario -- CAMBIAR ESTO
                    alert("Ya has comentado esta receta");
                } else {
                    console.error(data.detail);
                }
            } else {
                const nuevoComentario = await response.json();
                // Se actualiza el comentario pero no aparece el nombre de usuario
                setComentarios([...comentarios, nuevoComentario]);
                setComentario({ ...comentario, descripcion_comentario: "", valoracion_comentario: 0 });
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main>
            <div className="imagen-background">
                <img 
                    src={"/imgs/" + recetas.imagen_receta } 
                    alt="" 
                />
                {/* {recetas && recetas.imagen_receta &&(
                    <div style={{backgroundImage: `url(/imgs/${recetas.imagen_receta})`}} className="imagen-receta"></div>
                )}     */}
            </div>
            <div className="nombre-recetaUnica">
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
            <div className="nuevoComentario">
                <section className="section-nuevoComentario">
                    <label>
                        <textarea 
                            name="descripcion" 
                            id="comentario" 
                            placeholder="Introduce tu comentario..." 
                            rows={8} cols={70} 
                            value={comentario.descripcion_comentario} 
                            onChange={handleInputChange} />
                    </label>
                    <button onClick={enviarComentario}>Enviar comentario</button>
                </section>
            </div>
            {/* VALORACIONES OTROS USUARIOS */}
                <div className="div-comentarios">
                    <div className="comentarios">
                        <h2>Valoraciones</h2>
                        <div className="">
                        {comentarios.length > 0 ? (
                            comentarios.map((comentario) => (
                                <Comentario key={comentario.id_comentario} {...comentario} />
                            ))
                        ) : (
                            <p>Esta receta no tiene valoraciones</p>
                            
                        )}
                        </div>
                    </div>
                </div>
            <br />

        </main>
    );
}
export default RecetaUnica;
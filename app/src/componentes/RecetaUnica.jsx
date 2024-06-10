import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../stylesheets/RecetaUnica.css";
import Comentario from "./Comentario";
import { useNavigate } from 'react-router-dom';

function RecetaUnica() {
    const estrellas = new Array(5).fill(null);
    const gorritos = new Array(4).fill(null);
    const [isSaved, setIsSaved] = useState(false); // estado para saber si el usuario ya se ha guardado esa receta
    const navigate = useNavigate();
    const {id} = useParams();
    
    const [comentarios, setComentarios] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [valoracion, setValoracion] = useState(0);
    const [valoraciones, setValoraciones] = useState(0);
    const [valoracionMedia, setValoracionMedia] = useState(0);
    const [comentario, setComentario] = useState({
        id_receta_comentario: id,
        id_usuario_comentario: localStorage.getItem('token'),
        descripcion_comentario: "",
        // valoracion_comentario: 0
    })
    // const [existeReceta, setExisteReceta] = useState(false);

    // useEffect(() => {
    //     const checkIdReceta = async () => {
    //             const response = await fetch(
    //                 `http://localhost:8000/obtener_id_recetas`
    //             );
    //             const ids = await response.json();

    //             for(let i = 0; i<ids.length;i++){
    //                 if(ids[i] == id){
    //                     setExisteReceta(true);
    //                     console.log('existe')
    //                     return;
    //                 }
    //             }

    //             if (!existeReceta) {
    //                 return navigate('/');
    //             }
    //     };
    //     checkIdReceta();
    // },[])

    // Cuando se carga la receta comprueba si están GUARDADAS por el usuario o no
    useEffect(() => {
        const checkIfRecipeIsSaved = async () => {
            const token = localStorage.getItem("token");

            // Si no hay usuario logueado no hay recetas guardadas
            if (!token) {
                setIsSaved(false);
                return;
            }
            try {
                    const response = await fetch('http://localhost:8000/comprobar_receta', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            receta_id: recetas.id_receta // Asegúrate de tener el ID de la receta
                        })
                    });
    
                    if (!response.ok) {
                        throw new Error('No se pudo comprobar si la receta está guardada');
                    }
    
                    const data = await response.json();
                    
                    setIsSaved(data.isSaved); // Establece el estado en función de la respuesta
                } catch (error) {
                    console.error('Error al comprobar si la receta está guardada', error);
                }
            };
            checkIfRecipeIsSaved();
    }, [recetas.id_receta]);

    // Si el usuario pulsa el "Me Gusta"
    const handleHeartClick = async () => {
        const token = localStorage.getItem("token");
        
        if (!token) {  // Si no hay un usuario logueado, redirige a la página de inicio de sesión
            navigate('/login');
            return;
        }
        try {
            let response;
            if (isSaved) {
                // Si la receta ya está guardada, la elimina
                response = await fetch('http://localhost:8000/desguardar_receta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        // userId: userData.id_usuario, // Asegúrate de tener el ID del usuario
                        receta_id: recetas.id_receta // Asegúrate de tener el ID de la receta
                    })
                });
            } else {
                // Si la receta no está guardada, la guarda
                response = await fetch('http://localhost:8000/guardar_receta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        receta_id: recetas.id_receta // Asegúrate de tener el ID de la receta
                    })
                });
            }
            if (!response.ok) {
                throw new Error('No se pudo guardar la receta');
            }
            const data = await response.json();
            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Error al guardar la receta', error);
        }
    };

    // VALORACION - ESTRELLAS
    const handleStarClick = async (index) => {
        const token = localStorage.getItem("token");
        
        if (!token) {  // Si no hay un usuario logueado, redirige a la página de inicio de sesión
            navigate('/login');
            return;
        }
        const nuevaValoracion = index + 1;
        setValoracion(nuevaValoracion);
        let idReceta = recetas.id_receta;
    
        try {
            const respuesta = await fetch(`http://localhost:8000/valorar_receta/${idReceta}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ valoracion_receta: nuevaValoracion }),
            });
    
            if (!respuesta.ok) {
                throw new Error('Error al valorar la receta');
            }
            const datosRespuesta = await respuesta.json();
            
            setValoraciones(valoraciones + 1);  // Actualizar el número de valoraciones
            setValoracionMedia((valoracionMedia * valoraciones + nuevaValoracion) / (valoraciones + 1));
            // console.log(valoracionMedia)
        } catch (error) {
            console.error('Error al valorar la receta:', error);
        }
    };

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

            const responseValoraciones = await fetch(
                `http://localhost:8000/numero_valoraciones/${id}`
            );
            const valoraciones = await responseValoraciones.json();
            setValoraciones(valoraciones.numero_valoraciones);

            const responseValoracionMedia = await fetch(
                `http://localhost:8000/valoracion_media/${id}`
            );
            const dataValoracionMedia = await responseValoracionMedia.json();
            setValoracionMedia(dataValoracionMedia.valoracion_media);
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
        <main className="main-recetaUnica">
            <div className="header-recetaUnica">
                <div className="img-recetaUnica">
                    <img 
                        src={"/imgs/" + recetas.imagen_receta } 
                        alt="" 
                        className="imagen-prueba"
                    />
                    <img src={isSaved ? "/corazon-lleno.png" : "/corazon-vacio.png"} onClick={handleHeartClick} className="meGusta-recetaUnica"/>
                </div>
                <div className="nombre-recetaUnica">
                    <h2>{recetas.nombre_receta}</h2>
                    <div className="div-estrellas-recetaUnica">
                        {estrellas.map((_, index) => (
                            <img 
                                key={index}
                                src={valoracionMedia > index ? "/estrella-llena.png" : "/estrella-vacia.png"} 
                                alt="Estrella de valoración" 
                                className="estrella"
                                onClick={() => handleStarClick(index)}
                            />
                        ))}
                        <p>{valoraciones} {valoraciones === 1 ? 'voto' : 'votos'}</p>

                    </div>
                    <div className="div-dificultad-recetaUnica">
                        <p className="">Dificultad</p>
                        {gorritos.map((_, index) => (
                            <img 
                                key={index}
                                src={recetas.dificultad_receta > index ? "/gorrito-lleno.png" : "/gorrito-vacio.png"} 
                                alt="Dificultad" 
                                className="gorrito"
                            />
                        ))}
                    </div>
                </div>
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
                            name="descripcion_comentario" 
                            id="comentario" 
                            placeholder="Introduce tu comentario..." 
                            rows={8} cols={70} 
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

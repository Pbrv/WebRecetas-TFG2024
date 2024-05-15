import "../stylesheets/Receta.css"
import { Link } from 'react-router-dom';
import { useState } from "react";

function Receta(props) {
    const estrellas = new Array(5).fill(null);
    const gorritos = new Array(4).fill(null);
    const [isSaved, setIsSaved] = useState(false); // estado para saber si el usuario ya se ha guardado esa receta

    const handleHeartClick = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log(token)
            let response;
            if (isSaved) {
                // Si la receta ya está guardada, haz una solicitud para eliminarla
                response = await fetch('http://localhost:8000/eliminar_receta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        // userId: userData.id_usuario, // Asegúrate de tener el ID del usuario
                        recipeId: props.id_receta // Asegúrate de tener el ID de la receta
                    })
                });
            } else {
                // Si la receta no está guardada, haz una solicitud para guardarla
                response = await fetch('http://localhost:8000/guardar_receta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        // userId: userData.id_usuario, // Asegúrate de tener el ID del usuario
                        recipeId: props.id_receta // Asegúrate de tener el ID de la receta
                    })
                });
            }
    
            if (!response.ok) {
                throw new Error('No se pudo guardar la receta');
            }
    
            const data = await response.json();
            console.log(data.message); // Muestra el mensaje de éxito
    
            setIsSaved(!isSaved); // Invierte el estado para reflejar el cambio en las recetas guardadas
        } catch (error) {
            console.error('Error al guardar la receta', error);
        }
    };

    return (
        <div className="contenedor-receta">
            <Link to={`/receta/${props.id_receta}`}>
                <img 
                className="img-receta" 
                src={require("../imgs/receta1.jpg")}
                alt="Imagen receta" /> {/* Meto a pelo una imagen en la carpeta 'imgs' para hacer pruebas */}
                
            </Link>
            <img src={isSaved ? "corazon-lleno.png" : "corazon-vacio.png"} onClick={handleHeartClick} className="me-gusta"/>
            <div className="contenedor-info-receta">
                {/* VALORACION */}
                <div className="div-info">
                    <div className="div-estrellas">
                        {estrellas.map((_, index) => (
                            <img 
                                key={index}
                                src={props.valoracion_receta > index ? "estrella-llena.png" : "estrella-vacia.png"} 
                                alt="Estrella de valoración" 
                                className="estrella"
                            />
                        ))}
                    </div>
                    <p className="info">X votos</p>
                </div>
                <h3 className="nombre-receta">{props.nombre_receta}</h3>
                {/* DIFICULTAD */}
                <div className="div-info">
                    <p className="info">Dificultad</p>
                    {gorritos.map((_, index) => (
                        <img 
                            key={index}
                            src={props.dificultad_receta > index ? "gorrito-lleno.png" : "gorrito-vacio.png"} 
                            alt="Dificultad" 
                            className="gorrito"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Receta;
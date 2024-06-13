import "../stylesheets/Receta.css"
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Receta(receta) {
    const estrellas = new Array(5).fill(null);
    const gorritos = new Array(4).fill(null);
    // const [valoracion, setValoracion] = useState(0);
    const [valoraciones, setValoraciones] = useState(0);
    const [valoracionMedia, setValoracionMedia] = useState(0);
    const [estaGuardada, setEstaGuardada] = useState(false); // estado para saber si el usuario ya se ha guardado esa receta
    const navigate = useNavigate();

    // Cuando se cargan todas las recetas comprueba si están GUARDADAS por el usuario o no
    useEffect(() => {
        const compruebaRecetaGuardada = async () => {
            const token = localStorage.getItem("token");
            
            const responseValoraciones = await fetch( // Obtiene valoraciones de las recetas
                `http://localhost:8000/numero_valoraciones/${receta.id_receta}`
            );
            const valoraciones = await responseValoraciones.json();
            setValoraciones(valoraciones.numero_valoraciones);
            
            const responseValoracionMedia = await fetch(
                `http://localhost:8000/valoracion_media/${receta.id_receta}`
            );
            const dataValoracionMedia = await responseValoracionMedia.json();
            setValoracionMedia(dataValoracionMedia.valoracion_media);

            if (!token) { // Si no hay usuario logueado no hay recetas guardadas
                setEstaGuardada(false);
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
                        receta_id: receta.id_receta // Asegúrate de tener el ID de la receta
                    })
                });
                if (!response.ok) {
                    throw new Error('No se pudo comprobar si la receta está guardada');
                }
                const data = await response.json();
                setEstaGuardada(data.estaGuardada);
            } catch (error) {
                console.error('Error al comprobar si la receta está guardada', error);
            }
        };
        compruebaRecetaGuardada();
    }, [receta.id_receta]); // Se ejecuta al inicio y cuando cambia receta.id_receta

    const handleMeGusta = async () => { // Si el usuario pulsa el "Me Gusta"
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            let response;
            if (estaGuardada) { // Si la receta ya está guardada, la elimina
                response = await fetch('http://localhost:8000/desguardar_receta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        receta_id: receta.id_receta
                    })
                });
            } else { // Si la receta no está guardada, la guarda
                response = await fetch('http://localhost:8000/guardar_receta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        receta_id: receta.id_receta
                    })
                });
            }
            if (!response.ok) {
                throw new Error('No se pudo guardar la receta');
            }
            const data = await response.json();
            setEstaGuardada(!estaGuardada);
        } catch (error) {
            console.error('Error al guardar la receta', error);
        }
    };

    // VALORACION - ESTRELLAS
    const handleStarClick = async (index) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }
        const nuevaValoracion = index + 1;
        try {
            const respuesta = await fetch(`http://localhost:8000/valorar_receta/${receta.id_receta}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                },
                body: JSON.stringify({ valoracion_receta: nuevaValoracion }),
            });
            if (!respuesta.ok) {
                throw new Error('Error al valorar la receta');
            }
            setValoracionMedia(valoracionMedia);
            setValoracionMedia((valoracionMedia * valoraciones + nuevaValoracion) / (valoraciones + 1));
        } catch (error) {
            console.error('Error al valorar la receta:', error);
        }
    };

    return (
        <div className="contenedor-receta">
            <Link to={`/receta/${receta.id_receta}`}>
                <img 
                className="img-receta"
                src={"/imgs/" + receta.imagen_receta }
                alt="Imagen receta" />
                
            </Link>
            <img src={estaGuardada ? "corazon-lleno.png" : "corazon-vacio.png"} alt="imagen me gusta receta" onClick={handleMeGusta} className="me-gusta"/>
            <div className="contenedor-info-receta">
                {/* VALORACION */}
                <div className="div-info">
                    <div className="div-estrellas">
                        {estrellas.map((_, index) => (
                            <img 
                                key={index}
                                src={valoracionMedia > index ? "estrella-llena.png" : "estrella-vacia.png"} 
                                alt="Estrella de valoración" 
                                className="estrella"
                                onClick={() => handleStarClick(index)}
                            />
                        ))}
                    </div>
                    <p>{valoraciones} {valoraciones === 1 ? 'voto' : 'votos'}</p>
                </div>
                <Link to={`/receta/${receta.id_receta}`}>
                    <h3 className="nombre-receta">{receta.nombre_receta}</h3>
                </Link>
                {/* DIFICULTAD */}
                <div className="div-info">
                    <p className="info">Dificultad</p>
                    {gorritos.map((_, index) => (
                        <img 
                            key={index}
                            src={receta.dificultad_receta > index ? "gorrito-lleno.png" : "gorrito-vacio.png"} 
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
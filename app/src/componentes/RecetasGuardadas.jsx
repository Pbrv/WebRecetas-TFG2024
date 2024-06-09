import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Receta from "./Receta";
function RecetasGuardadas (){

    const [recetasGuardadas, setRecetasGuardadas] = useState([]);
    const [recetas, setRecetas] = useState([]);
    const [datos, setDatos] = useState();

    useEffect(() => {
        const fetchDatosUsuario = async () => {
            try {
                const datosUsuario = await fetch("http://localhost:8000/mi_cuenta", {
                method: 'GET',    
                headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    }
                });
                if (!datosUsuario.ok) {
                    throw new Error("No se obtuvieron los datos del usuario");
                }
                let DatosUsuario = await datosUsuario.json();
                setDatos(DatosUsuario);

            } catch (error) {
                console.error("Error al hacer fetch", error);
            }
        };
        fetchDatosUsuario();
    }, []);

    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                const recetasGuardadas = await fetch(`http://localhost:8000/recetas_guardadas_usuario/${datos.nombre_usuario}`, {
                    method: 'GET',    
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    }
                });
                if (!recetasGuardadas.ok) {
                    throw new Error("No se obtuvieron los datos del usuario");
                }
                const DatosRecetasGuardadas = await recetasGuardadas.json();

                setRecetasGuardadas(DatosRecetasGuardadas);
            } catch (error) {
                console.error("Error al hacer fetch", error);
            }
        }
        fetchRecetas();

    }, [datos])

    useEffect(() => {
        const fetchDatosRecetas = async (id_receta) => {
            try {
                const recetasData = await fetch(`http://localhost:8000/mostrar_receta/${id_receta}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    }
                });
                if (!recetasData.ok) {
                    throw new Error("No se obtuvieron los datos de la receta");
                }
                const DatosRecetasGuardadas = await recetasData.json();

                setRecetas(prevRecetas => [...prevRecetas, DatosRecetasGuardadas]);
            } catch (error) {
                console.error("Error al hacer fetch", error);
            }
        };

        if (recetasGuardadas.length > 0) {
            recetasGuardadas[0].split(';').forEach(id_receta => {
                fetchDatosRecetas(id_receta);
            });
        }
    }, [recetasGuardadas]);
    
    return(
        <div>
            <h1>Recetas Guardadas</h1>
            <div className="recetas-destacadas">
                {recetas.map((receta) => (
                    <Receta key={receta.id_receta} {...receta} />
                ))}
            </div>
        </div>
    );
}

export default RecetasGuardadas;
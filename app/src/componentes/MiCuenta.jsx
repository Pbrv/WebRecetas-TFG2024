import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../stylesheets/MiCuenta.css";

function MiCuenta() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
    const fetchDatosUsuario = async () => {
        try {
            const response = await fetch("http://localhost:8000/mi_cuenta", {
            method: 'GET',    
            headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            });
            if (!response.ok) {
                throw new Error("No se obtuvieron los datos del usuario");
            }
            let DatosUsuario = await response.json();
            
            // Obtiene el nombre de la suscripción
            const responseSuscripcion = await fetch(`http://localhost:8000/nombre_suscripcion/${DatosUsuario.suscripcion_usuario}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            });
            if (!responseSuscripcion.ok) {
                throw new Error("No se obtuvo el nombre de la suscripción");
            }
            const DatosSuscripcion = await responseSuscripcion.json();
            
            // Reemplaza el ID de la suscripción con el nombre de la suscripción
            DatosUsuario.suscripcion_usuario = DatosSuscripcion.nombre_suscripcion;

            // Obtiene las recetas CREADAS por el usuario
            const responseRecetas = await fetch(`http://localhost:8000/usuario/${DatosUsuario.id_usuario}/recetas`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            });
            if (!responseRecetas.ok) {
                throw new Error("No se obtuvieron las recetas del usuario");
            }
            const DatosRecetas = await responseRecetas.json();

            // Añade las recetas a los datos del usuario
            DatosUsuario.recetas = DatosRecetas;

            setUserData(DatosUsuario);
        } catch (error) {
            console.error("Error al hacer fetch", error);
        }
    };
    fetchDatosUsuario();
    }, []);

    return (
        <div className="contenedor-micuenta">
            

            {/* Controla si los datos de usuario son nulos */}
            {userData ? (
            <>
                <div className="div-titulo-micuenta">
                    <h1 className="titulo-micuenta">Mi Cuenta</h1>
                    <div className="div-nombre-boton">
                        <p className="nombre-usuario-micuenta">Hola {userData.nombre_usuario}</p>
                        <a href="/nueva-receta" className="nueva-receta-micuenta">Subir Receta</a>
                    </div>
                </div>

                <div className="contenedor_datos_usuario">

                    {/* DATOS */}
                    <div className="datos_usuario">
                        <div className="encabezado_datos">
                            <h2 className="titulo-h2">Mis Datos</h2>
                            <a href="#" className="enlace_mod">Editar mis datos</a>
                        </div>
                        <div className="cuerpo_datos_usuario">
                            <p className="titulos">Nombre</p>
                            <p className="datos">{userData.nombre_usuario}</p>
                            <p className="titulos">Email</p>
                            <p className="datos">{userData.correo_usuario}</p>
                            <p className="titulos">Suscripción</p>
                            <p className="datos">{userData.suscripcion_usuario}</p>
                        </div>
                    </div>

                    {/* RECETAS */}
                    <div className="datos_usuario">
                        <div className="encabezado_datos">
                            <h2 className="titulo-h2">Mis Recetas</h2>
                            <a href="#" className="enlace_mod">Editar mis recetas</a>
                        </div>
                        <div className="cuerpo_datos_recetas">
                        {userData.recetas.map((receta, index) => (
                            <div key={index} className="resumen-recetas">
                                <Link to={`/receta/${receta.id_receta}`}>
                                    <p className="enlaces-resumen-recetas">{receta.nombre_receta}</p>
                                </Link>
                                <p>Valoración: {receta.valoracion_receta}</p>
                            </div>
                        ))}
                        </div>
                    </div>

                </div>
                </>
                ) : (
                <p>Cargando datos del usuario...</p>
            )}
        </div>
    );
}

export default MiCuenta;

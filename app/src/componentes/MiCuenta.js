import { useState, useEffect } from "react";
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
                const DatosUsuario = await response.json();
                
                setUserData(DatosUsuario);
            } catch (error) {
                console.error("Error al hacer fetch", error);
            }
        };
        fetchDatosUsuario();
    }, []);

    return (
        <div>
            <h1 className="titulo-h1">Mi Cuenta</h1>

            {/* Controla si los datos de usuario son nulos */}
            {userData ? (
            <>
                <p className="nombre_usuario">Hola {userData.nombre_usuario}</p>

                <div className="contenedor_datos_usuario">

                    {/* DATOS */}
                    <div className="datos_usuario">
                        <div className="encabezado_datos">
                            <h2 className="titulo-h2">Mis Datos</h2>
                            <a className="enlace_mod">Editar mis datos</a>
                        </div>
                        <div className="cuerpo_datos_usuario">
                            <p className="titulos">Nombre</p>
                            <p className="datos">{userData.nombre_usuario}</p>
                            <p className="titulos">Correo electrónico</p>
                            <p className="datos">{userData.correo_usuario}</p>
                            <p className="titulos">Suscripción</p>
                            <p className="datos">{userData.suscripcion_usuario}</p>
                        </div>
                    </div>

                    {/* RECETAS */}
                    <div className="datos_usuario">
                        <div className="encabezado_datos">
                            <h2 className="titulo-h2">Mis Recetas</h2>
                            <a className="enlace_mod">Añadir más recetas</a>
                        </div>
                        <div className="cuerpo_datos_recetas">
                            
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

import "../stylesheets/MiCuenta.css";

function MiCuenta() {
    // Aquí va la lógica y la presentación de la página de la cuenta del usuario
    return (
        <div>
            <h1 className="titulo">Mi Cuenta</h1>
            <p className="nombre_usuario">Hola </p>
            <div className="contenedor_datos_usuario">

                {/* DATOS */}
                <div className="datos_usuario">
                    <h2 className="titulo">Mis Datos</h2>
                    <a>Editar</a>
                </div>

                {/* RECETAS */}
                <div className="datos_usuario">
                    <h2 className="titulo">Mis Recetas</h2>
                    <a>Añadir más recetas</a>
                </div>

            </div>
        </div>
    );
}

export default MiCuenta;

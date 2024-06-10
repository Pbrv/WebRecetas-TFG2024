import "../stylesheets/Comentario.css";

function Comentario(comentario) {
    return(
        <div className="div-valoraciones">
            <div className="cabecera-valoracion">
                <p className="nombre-usuario-valoracion">{comentario.nombre_usuario}</p>
                {/* <p className="estrellas-valoracion">{comentario.valoracion_comentario}Estrellas</p> */}
            </div>
            <div className="cuerpo-valoracion">
                <p className="p-comentario">{comentario.descripcion_comentario}</p>
            </div>
        </div>
    );
}

export default Comentario
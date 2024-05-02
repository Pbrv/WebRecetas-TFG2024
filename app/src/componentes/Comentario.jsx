import "../stylesheets/Comentario.css";

function Comentario(comentario) {
    return(
        <div className="div-comentario">
            <p className="valoracion">Valoracion: {comentario.valoracion_comentario}</p>
            <p className="comentario">{comentario.descripcion_comentario}</p>
            <p className="usuario-comentario">{comentario.id_usuario_comentario}</p>
        </div>
    );
}

export default Comentario
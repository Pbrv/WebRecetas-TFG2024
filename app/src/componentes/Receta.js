import "../stylesheets/Receta.css"
import { Link } from 'react-router-dom';

function Receta(props) {
    return (
        <div className="contenedor-receta">
            <Link to={`/receta/${props.id_receta}`}>
                <img 
                className="img-receta" 
                src={require("../imgs/receta1.jpg")}
                alt="Imagen receta" /> {/* Meto a pelo una imagen en la carpeta 'imgs' para hacer pruebas */}
            </Link>
            <div className="contenedor-info-receta">
                <h3 className="nombre-receta">{props.nombre_receta}</h3>
                <div className="descripcion-receta">
                    <p className="dificultad-receta">{props.dificultad_receta}</p>
                    <p className="valoracion-receta">{props.valoracion_receta}</p>
                </div>
            </div>
        </div>
    );
}

export default Receta;
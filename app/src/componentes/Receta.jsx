import "../stylesheets/Receta.css"
import { Link } from 'react-router-dom';

function Receta(props) {
    const estrellas = new Array(5).fill(null);
    const gorritos = new Array(4).fill(null);

    return (
        <div className="contenedor-receta">
            <Link to={`/receta/${props.id_receta}`}>
                <img 
                className="img-receta" 
                src={require("../imgs/receta1.jpg")}
                alt="Imagen receta" /> {/* Meto a pelo una imagen en la carpeta 'imgs' para hacer pruebas */}
            </Link>
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
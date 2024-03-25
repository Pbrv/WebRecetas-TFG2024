import React from "react";
import "../stylesheets/Receta.css"

function Receta(props) {
    return (
        <div className="contenedor-receta">
            <img 
            className="img-receta" 
            src={require("../imgs/receta1.jpg")}
            alt="Imagen receta" /> {/* Meto a pelo una imagen en la carpeta 'imgs' para hacer pruebas */}
            <div className="contenedor-info-receta">
                <h3 className="nombre-receta">{props.nombre}</h3>
                {/* <div className="descripcion-receta">
                    <p className="dificultad-receta">{props.dificultad}</p>
                    <p className="valoracion-receta">{props.valoracion}</p>
                </div> */}
            </div>
        </div>
    );
}

export default Receta;
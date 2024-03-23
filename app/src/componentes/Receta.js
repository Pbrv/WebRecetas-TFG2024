import React from "react";

function Receta() {
    return (
        <div className="contenedor-receta">
            <img 
            className="img-receta" 
            src={require("../imgs/receta1.jpg")}
            alt="Imagen receta"/> {/* Meto a pelo una imagen en la carpeta 'imgs' para hacer pruebas */}
            <div className="contenedor-info-receta">
                <p className="nombre-receta">Tortilla</p>
                <p className="dificultad-receta">Fácil</p>
                <p className="tiempo-receta">20 minutos</p>
                <p className="valoracion-receta">* * * * *</p>
            </div>
        </div>
    );
}

export default Receta;
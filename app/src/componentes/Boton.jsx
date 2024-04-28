import {React, useEffect,useState} from "react";
import "../stylesheets/Boton.css";

function Boton ({onClick, nombre_pais}) {
    return(
        <button className="boton" onClick={onClick}>{nombre_pais}</button>
    );
};

export default Boton;
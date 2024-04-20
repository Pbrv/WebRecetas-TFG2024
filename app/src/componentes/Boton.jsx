import {React, useEffect,useState} from "react";
import "../stylesheets/Home.css";

function Boton ({onClick,nombre_pais}) {
    return(
        <button onClick={onClick}>{nombre_pais}</button>
    );
};

export default Boton;
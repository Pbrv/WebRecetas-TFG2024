import {React, useEffect,useState} from "react";
import "../stylesheets/Boton.css";

function Boton ({onClick, value}) {
    return(
        <button className="boton" onClick={onClick}>{value}</button>
    );
};

export default Boton;
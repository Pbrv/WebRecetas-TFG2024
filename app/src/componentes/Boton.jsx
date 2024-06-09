import {React} from "react";
import "../stylesheets/Boton.css";

function Boton ({onClick, value, id}) {
    return(
        <button id={id} className="boton" onClick={onClick}>{value}</button>
    );
};

export default Boton;
import {React} from "react";
import "../stylesheets/Boton.css";

function Boton ({onClick, value, id}) {
    return(
        <button 
            onClick={onClick}
            id={id}
            className="boton">{value}
        </button>
    );
};

export default Boton;
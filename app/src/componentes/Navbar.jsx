import { useEffect, useState } from "react";
import "../stylesheets/Navbar.css"
import LogoutButton from "./Logout";
import jwtDecode from "jwt-decode";

function Navbar({ isLogged, setIsLogged }) {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    // const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLogged(!!token);
    }, []);

    const handleMouseEnter = () => {
        if (isLogged) {
            setDropdownVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    return (
        <nav>
            <ul>
                <li><a href="/"><img src="logo1.jpeg" alt="Logo" id="logo" /></a></li>
                <li><a href="/recetas" className="enlace-nav">Recetas</a></li>
                <li><a href="/paises" className="enlace-nav">Países</a></li>
            </ul>
            <div className="div-iconos" onMouseLeave={handleMouseLeave}>
                <a href="/buscar"><img src="lupa.png" alt="Buscar" className="icono" /></a>
                <div className="icono-usuario">
                    <a href="/login" onMouseEnter={handleMouseEnter} ><img src="usuario.png" alt="Login" className="icono"/></a>
                    {isDropdownVisible && (
                        <div className="dropdown">
                            <a className="a-user" href="/mi-cuenta">Mi Cuenta</a>
                            <a className="a-user" href="/nueva-receta">Subir Receta</a>
                            <LogoutButton setIsLogged={setIsLogged} />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
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
                <li><a href="/"><img src="logo.png" alt="Logo"  id="logo" /></a></li>
                <li><a href="/recetas">Recetas</a></li>
                <li><a href="/paises">Países</a></li>
            </ul>
            <div className="iconos" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="/buscar"><img src="lupa.png" alt="Buscar" /></a>
                <div className="icono-usuario">
                    <a href="/login"><img src="usuario.png" alt="Login" /></a>
                    {isDropdownVisible && (
                        <div className="dropdown">
                            <a className="a-user" href="/mi-cuenta">Mi Cuenta</a>
                            <LogoutButton setIsLogged={setIsLogged} />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
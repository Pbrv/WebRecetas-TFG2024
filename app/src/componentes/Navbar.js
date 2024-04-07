import { useEffect, useState } from "react";
import React from "react";
import "../stylesheets/Navbar.css"
import jwtDecode from "jwt-decode";

function Navbar() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLogged(!!token);
    }, []);

    const handleMouseOver = () => {
        if (isLogged) {
            setDropdownVisible(true);
        }
    };

    const handleMouseOut = () => {
        setDropdownVisible(false);
    };

    return (
        <nav>
            <ul>
                <li><a href="/"><img src="logo.png" alt="Logo"  id="logo" /></a></li>
                <li><a href="/recetas">Recetas</a></li>
                <li><a href="/paises">Países</a></li>
            </ul>
            <div className="iconos">
                <a href="/buscar"><img src="lupa.png" alt="Buscar" /></a>
                <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                    <a href="/login"><img src="usuario.png" alt="Login" /></a>
                    {isDropdownVisible && (
                        <div className="dropdown">
                            <a href="/logout">Cerrar sesión</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
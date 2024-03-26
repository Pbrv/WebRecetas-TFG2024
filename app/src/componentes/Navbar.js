import React from "react";
import "../stylesheets/Navbar.css"

function Navbar() {
    return (
        <nav>
            <ul>
                <li><a href="/"><img src="logo.png" alt="Logo"  id="logo" /></a></li>
                <li><a href="/recetas">Recetas</a></li>
                <li><a href="/paises">Países</a></li>
            </ul>
            <div class="iconos">
                <a href="/buscar"><img src="lupa.png" alt="Buscar" /></a>
                <a href="/login"><img src="usuario.png" alt="Login" /></a>
            </div>
        </nav>
    );
}

export default Navbar;
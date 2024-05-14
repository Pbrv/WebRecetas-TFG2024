import { useEffect, useState } from "react";
import "../stylesheets/Navbar.css"
import LogoutButton from "./Logout";
import jwtDecode from "jwt-decode";

function Navbar({ isLogged, setIsLogged }) {
    const [isDropdownVisible, setDropdownVisible] = useState(false); // Estado para la el desplegable de usuario
    const [isSearchVisible, setSearchVisible] = useState(false); // Estado para la barra de búsqueda 
    // const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLogged(!!token);
    }, []);

    // DESPLEGABLE
    const handleMouseEnter = () => { // Abrir desplegable
        if (isLogged) {
            setDropdownVisible(true);
        }
    };
    const handleMouseLeave = () => { // Cerrar desplegable
        setDropdownVisible(false);
    };

    // LUPA
    const handleSearchMouseEnter = () => { // Abrir barra de búsqueda con hover
        setSearchVisible(true);
    };
    const handleSearchClose = () => { // Cerrar barra de búsqueda con click
        setSearchVisible(false);
    };

    return (
        <nav>
            <ul>
                <li><a href="/"><img src="logo1.jpeg" alt="Logo" id="logo" /></a></li>
                <li><a href="/recetas" className="enlace-nav">Recetas</a></li>
                <li><a href="/paises" className="enlace-nav">Países</a></li>
            </ul>
            <div className="div-iconos" onMouseLeave={handleMouseLeave}>
                {isSearchVisible && ( // Muestra la barra de búsqueda si isSearchVisible es true
                    <div className="div-barra-busqueda">
                        <input type="text" placeholder="Buscar..."  className="barra-busqueda" />
                        <button onClick={handleSearchClose}>X</button> {/* Botón para cerrar la barra de búsqueda */}
                    </div>
                )}
                <a href="/buscar" onMouseEnter = {handleSearchMouseEnter}><img src="lupa.png" alt="Buscar" className="icono" id="lupa" /></a>
                
                <div className="icono-usuario">
                    <a href="/login" onMouseEnter={handleMouseEnter} ><img src="usuario.png" alt="Login" className="icono"/></a>
                    {isDropdownVisible && (
                        <div className="dropdown">
                            <a className="a-user" href="/mi-cuenta">Mi Cuenta</a>
                            <a className="a-user" href="/nueva-receta">Subir Receta</a>
                            <a className="a-user" href="/recetas-guardadas">Recetas Guardadas</a>
                            <LogoutButton setIsLogged={setIsLogged} />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
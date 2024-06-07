import { useEffect, useState, useRef} from "react";
import { Link , Navigate } from 'react-router-dom';
import "../stylesheets/Navbar.css"
import LogoutButton from "./Logout";
import jwtDecode from "jwt-decode";

function Navbar({ isLogged, setIsLogged }) {
    const [isDropdownVisible, setDropdownVisible] = useState(false); // Estado para la el desplegable de usuario
    const [isSearchVisible, setSearchVisible] = useState(false); // Estado para la barra de búsqueda 
    const [menuAbierto, setMenuAbierto] = useState(false);
    // const [isLogged, setIsLogged] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLogged(!!token);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // DESPLEGABLE
    const handleMouseEnter = () => { // Abrir desplegable
        if (isLogged) {
            setDropdownVisible(true);
        }
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
            <div>
            <button className="hamburguesa" onClick={() => setMenuAbierto(!menuAbierto)}>
                        <img src="../hamburguesa.png">
                        </img>
                    </button>
            </div>
            <ul>
                <li><Link to={`/`}><img src="../logo1.jpeg" alt="Logo" id="logo" /></Link></li>
                <li><Link to={`/recetas`} className="enlace-nav">Recetas</Link></li>
                <li><Link to={`/paises`} className="enlace-nav">Paises</Link></li>
            </ul>
            <div className="div-iconos">
                {isSearchVisible && ( // Muestra la barra de búsqueda si isSearchVisible es true
                    <div className="div-barra-busqueda">
                        <input type="text" placeholder="Buscar..."  className="barra-busqueda" />
                        <button onClick={handleSearchClose}>X</button> {/* Botón para cerrar la barra de búsqueda */}
                    </div>
                )}
                <Link to={``} onClick={handleSearchMouseEnter}>
                    <img src="../lupa.png" alt="Buscar" className="icono" id="lupa" />
                </Link>
                
                <div className="icono-usuario">
                    <Link to={isLogged ? `/mi-cuenta` : `/login`} onMouseEnter={handleMouseEnter}>
                        <img src="../usuario.png" alt="Login" className="icono"/>
                    </Link>
                    {isDropdownVisible && (
                        <div className="dropdown" ref={dropdownRef}>
                            {/* <p className="nombre-usuario-nav">Hola</p> */}
                            <Link to={`/mi-cuenta`} className="a-user">Mi Cuenta</Link>
                            <Link to={`/nueva-receta`} className="a-user">Subir Receta</Link>
                            <Link to={`/recetas-guardadas`} className="a-user">Recetas Guardadas</Link>
                            <LogoutButton setIsLogged={setIsLogged}/>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
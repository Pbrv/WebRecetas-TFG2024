import { useEffect, useState, useRef} from "react";
import { Link , Navigate } from 'react-router-dom';
import "../stylesheets/Navbar.css"
import LogoutButton from "./Logout";
import jwtDecode from "jwt-decode";

function Navbar({ isLogged, setIsLogged }) {
    const [desplegableVisible, setDesplegableVisible] = useState(false); // Estado para la el desplegable de usuario
    const [searchVisible, setSearchVisible] = useState(false); // Estado para la barra de búsqueda 
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('');
    // const [isLogged, setIsLogged] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLogged(!!token);
    }, []);

    // para obtener el nombre del usuario
    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            const response = await fetch('/mi_cuenta', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                },
            });
            const usuario = await response.json();
            setNombreUsuario(usuario.nombre_usuario);
            console.log(usuario.nombre_usuario)
        };
        obtenerDatosUsuario();
    }, [isLogged]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDesplegableVisible(false);
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
            setDesplegableVisible(true);
        }
    };
    // LUPA
    const handleMouseLeave = () => { // Esconder desplegable
        if (isLogged && desplegableVisible) {
            setDesplegableVisible(false);
        }
    };
    const handleSearchToggle = () => {
        setSearchVisible(!searchVisible);
    };

    return (
        <nav>
            <div>
            <button className="hamburguesa" onClick={() => setMenuAbierto(!menuAbierto)}>
                        <img src="../hamburguesa.png" alt="imagen nav hamburguesa">
                        </img>
                    </button>
            </div>
            <ul>
                <li><Link to={`/`}><img src="../logo1.jpeg" alt="Logo" id="logo" /></Link></li>
                <li><Link to={`/recetas`} className="enlace-nav">Recetas</Link></li>
                <li><Link to={`/paises`} className="enlace-nav">Paises</Link></li>
            </ul>
            <div className="div-iconos">
                {searchVisible && ( // Muestra la barra de búsqueda si searchVisible es true
                    <div className="div-barra-busqueda">
                        <input type="text" placeholder="Buscar..."  className="barra-busqueda" />
                        {/* <button onClick={handleSearchClose}>X</button> */}
                    </div>
                )}
                <Link onClick={handleSearchToggle}>
                    <img src="../lupa.png" alt="Buscar" className="icono" id="lupa" />
                </Link>
                
                <div className="icono-usuario" onMouseEnter={handleMouseEnter}>
                    <Link to={isLogged ? `/mi-cuenta` : `/login`} >
                        <img src="../usuario.png" alt="Login" className="icono"/>
                    </Link>
                    {desplegableVisible && isLogged && (
                        <div className="dropdown" ref={dropdownRef} onMouseLeave={handleMouseLeave}>
                            <p className="nombre-usuario-nav">Hola {nombreUsuario}</p>
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
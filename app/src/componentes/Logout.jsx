import { useNavigate } from 'react-router-dom';
import "../stylesheets/Logout.css"

function LogoutButton({ setIsLogged }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // elimina el token de sesion

        setIsLogged(false); // actualiza su estado
        
        navigate('/'); // redirige a inicio
    };

    return (
        <a className='a-user' onClick={handleLogout}>Cerrar Sesión</a>
    );
}

export default LogoutButton;


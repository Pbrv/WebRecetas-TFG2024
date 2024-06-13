import '../stylesheets/Form.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateLoginForm } from './validacion';

function LoginForm({ setIsLogged }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarContraseña, setMostrarContraseña] = useState(false);
    const [mensajeError, setMensajeError] = useState(null);
    const navigate = useNavigate();
    const cambiarVisibilidad = () => {
        setMostrarContraseña(!mostrarContraseña);
    };

    // INICIO SESIÓN
    const handleSubmit = async event => {
        event.preventDefault();

        const formValido = validateLoginForm(username, password);
        
        if (!formValido) { // validar que todos los campos estén rellenos --> SOLO ALERT
            setMensajeError("Debes completar todos los campos");
        }

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre_usuario: username,
                    pass_usuario: password
                })
            });
            
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.access_token); // almacena el token en local
                setIsLogged(true);
                navigate('/'); // redirige al usuario a la página principal
            } else {
                if (response.status === 404) {
                    setMensajeError('Usuario no encontrado');
                } else if (response.status === 401) {
                    setMensajeError('Contraseña incorrecta');
                }
            }
        } catch (error) {
            console.error('Error al enviar la solicitud', error);
        }
    };

    return (
        <div className='contenedor'>
            <h2 className='titulo-form'>Inicia Sesión</h2>
            
            <form className="form" onSubmit={handleSubmit}>
                <div className="contenedor-form">
                    <div className="form-group">
                        
                        <input
                            className="form-input"
                            id="username"
                            type="text"
                            placeholder="  "
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <label htmlFor="username" className="form-label">Nombre de usuario:</label>
                        <span className="form-line"></span>
                    </div>
                    <div className="form-group">
                        <input
                            className="form-input"
                            id="password"
                            type={mostrarContraseña ? 'text' : 'password'}
                            placeholder="  "
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label htmlFor="password" className="form-label">Contraseña:</label>
                        <a className="enlace-mostrar-password" type={mostrarContraseña ? 'text' : 'password'}>
                            <img 
                            src={mostrarContraseña ? "esconder.png" : "ver.png"} alt="" 
                            className="mostrar-password" onClick={cambiarVisibilidad} />
                        </a>
                        <span className="form-line"></span>
                    </div>
                    {/* MENSAJE ERROR */}
                    {mensajeError && <div className="mensaje-error"><p>{mensajeError}</p></div>}

                    <input type="submit" className="form-submit" value="Entrar" />
                    <p>¿Aún no tienes una cuenta? 
                        <Link to="/registro" className='enlace-registro'>Regístrate aquí</Link></p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;

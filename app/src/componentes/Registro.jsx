// import "../stylesheets/Registro.css"
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail, validateUsername, validateRegistroForm } from './validacion';
import '../stylesheets/Registro.css';

function Registro() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, seterror] = useState({});
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async event => {
        event.preventDefault();

        let validationerror = {};

        if (!validateRegistroForm(username, password, email)) {
            validationerror.general = "Debes completar todos los campos";
        }

        if (!validateUsername(username)) {
            validationerror.username = "Usuario no válido";
        }

        if (!validateEmail(email)) {
            validationerror.email = "Correo electrónico no válido";
        }

        if (!validateEmail(password)) {
            validationerror.password = "Contraseña no válida";
        }

        if (Object.keys(validationerror).length > 0) {
            seterror(validationerror);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/registrar_usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo_usuario: email,
                    nombre_usuario: username,
                    pass_usuario: password
                })
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                console.log('No se ha podido registrar', data);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud', error);
        }
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        if (field === 'username') setUsername(value);
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);

        seterror(preverror => ({ ...preverror, [field]: '' }));
        seterror(preverror => ({ ...preverror, ['general']: '' }));
    };

    return (
        <div className='contenedor'>
            <h2 className='titulo-form'>Registrarse</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div className="contenedor-form">
                    <div className="form-group">
                        <input
                            className="form-input"
                            id="username"
                            type="text"
                            placeholder="  "
                            value={username}
                            onChange={e => handleInputChange(e, 'username')}
                        />
                        <label htmlFor="username" className="form-label">Nombre de usuario:</label>
                        {error.username && <span className='mensaje-error'>{error.username}</span>}
                    </div>
                    <div className="form-group">
                        <input
                            className="form-input"
                            id="email"
                            type="email"
                            placeholder="  "
                            value={email}
                            onChange={e => handleInputChange(e, 'email')}
                        />
                        <label htmlFor="email" className="form-label">Correo electrónico:</label>
                        {error.email && <span className='mensaje-error'>{error.email}</span>}
                    </div>
                    <div className="form-group">
                        <input
                            className="form-input"
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="  "
                            value={password}
                            onChange={e => handleInputChange(e, 'password')}
                        />
                        <label htmlFor="password" className="form-label">Contraseña:</label>
                        <a className="enlace-mostrar-password" onClick={togglePasswordVisibility}>
                            <img 
                                src={showPassword ? "esconder.png" : "ver.png"} 
                                alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} 
                                className="mostrar-password" 
                            />
                        </a>
                        {error.password && <span className='mensaje-error'>{error.password}</span>}
                    </div>
                    {error.general && <span className='mensaje-error'>{error.general}</span>}
                    <input type="submit" className="form-submit" value="Crear cuenta" />
                    <p>¿Ya tienes una cuenta? 
                        <Link to="/login" className='enlace-registro'> Inicia sesión aquí</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Registro;

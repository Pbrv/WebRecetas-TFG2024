// import "../stylesheets/Registro.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validateUsername, validateRegistroForm } from './validacion';

function Registro() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const formValido = validateRegistroForm(username, password, email);
        
        // validar que todos los campos estén rellenos
        if (!formValido) {
            alert("Debes completar todos los campos");
        }
        
        // Validar con expresiones regulares
        if (!validateUsername(username)) {
            alert("No se ha validado el nombre")
            return;
        }

        if (!validateEmail(email)) {
            // Mostrar un mensaje de error o tomar alguna acción si el correo electrónico no es válido
            alert("No se ha validado el email")
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
                // Redirige al usuario a la página de inicio de sesión
                navigate('/login');
            } else {
                console.log('No se ha podido registrar', data);
            }
        } catch (error) {
            console.log('Error al enviar la solicitud', error);
        }
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
                            onChange={e => setUsername(e.target.value)}
                        />
                        <label htmlFor="username" className="form-label">Nombre de usuario:</label>
                        <span className="form-line"></span>
                    </div>
                    <div className="form-group">
                        <input
                            className="form-input"
                            id="email"
                            type="email"
                            placeholder="  "
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label htmlFor="name" className="form-label">Correo electrónico:</label>
                        <span className="form-line"></span>
                    </div>
                    <div className="form-group">
                        <input
                            className="form-input"
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="  "
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label htmlFor="password" className="form-label">Contraseña:</label>
                        <a className="enlace-mostrar-password" type={showPassword ? 'text' : 'password'}>
                            <img 
                            src={showPassword ? "esconder.png" : "ver.png"} alt="" 
                            className="mostrar-password" onClick={togglePasswordVisibility} />
                        </a>
                        <span className="form-line"></span>
                    </div>
                    <input type="submit" className="form-submit" value="Crear cuenta" />
                    <p>¿Ya tienes una cuenta? 
                        <a href="/login" className='enlace-registro'> Inicia sesión aquí</a></p>
                </div>
            </form>
        </div>
    );
}

export default Registro;

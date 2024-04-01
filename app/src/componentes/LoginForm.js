import '../stylesheets/LoginForm.css';
import React, { useState } from 'react';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // INICIO SESIÓN
    const handleSubmit = async event => {
        event.preventDefault();
        
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

            if (response.ok) {
                console.log("Inicio de sesión iniciado con éxito");
            } else {
                console.log('No se ha podido iniciar sesión');
            }
        } catch (error) {
            console.log('Error al enviar la solicitud', error);
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
                            type="password"
                            placeholder="  "
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label htmlFor="password" className="form-label">Contraseña:</label>
                        <span className="form-line"></span>
                    </div>
                    <input type="submit" className="form-submit" value="Entrar" />
                    <p>¿Aún no tienes una cuenta? 
                        <a href="#" className='enlace-registro'> Regístrate aquí</a></p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;

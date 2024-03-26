import React, { useState } from 'react';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        // Aquí puedes manejar el envío del formulario, por ejemplo, llamando a una API
    };

    return (
        <form onSubmit={handleSubmit}>
        <label>
            Nombre de usuario:
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
            Contraseña:
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">Iniciar sesión</button>
        </form>
    );
}

export default LoginForm;

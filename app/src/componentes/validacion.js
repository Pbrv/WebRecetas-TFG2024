// EXPRESIONES REGULARES

export const validateUsername = (username) => {
    const regex = /^[a-zA-Z]+$/; // Solo permite letras (mayúsculas y minúsculas)
    return regex.test(username);
}

// Función para validar el correo electrónico
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Verifica que haya un "@" en el medio y al menos un punto después del "@".
    return regex.test(email);
}

// controla que se rellenen todos los campos

export function validateRegistroForm(username, password, email) {
    if (!username || !password || !email) {
        return false; // si algún campo está vacío
    }
    return true;
}

export function validateLoginForm(username, password) {
    if (!username || !password) {
        return false; // si algún campo está vacío
    }
    return true;
}

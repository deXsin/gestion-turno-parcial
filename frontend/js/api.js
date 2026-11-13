const API_URL = 'http://localhost:3000/api';

async function iniciarSesion(email, password) {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo iniciar sesión');
    }

    return datos;
}

async function obtenerTurnos() {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudieron obtener los turnos');
    }

    return datos;
}
 
 

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

async function obtenerTurnos(filtros = {}) {
    const token = sessionStorage.getItem('token');
    const params = new URLSearchParams();
    if (filtros.fecha) params.append('fecha', filtros.fecha);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.dni_paciente) params.append('dni_paciente', filtros.dni_paciente);

    const query = params.toString() ? `?${params.toString()}` : '';
    const respuesta = await fetch(`${API_URL}/turnos${query}`, {
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

async function obtenerTurnosPorPaciente(dni) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos/paciente/${encodeURIComponent(dni)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudieron obtener tus turnos');
    }

    return datos;
}

async function crearTurnoApi(datosTurno) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosTurno)
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo crear el turno');
    }

    return datos;
}

async function confirmarTurnoApi(idTurno, medico_confirmacion) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos/confirmar/${idTurno}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ medico_confirmacion })
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo confirmar el turno');
    }

    return datos;
}

async function cancelarTurnoApi(idTurno) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos/cancelar/${idTurno}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo cancelar el turno');
    }

    return datos;
}

async function reprogramarTurnoApi(idTurno, fecha_turno, hora_turno) {
    const token = sessionStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/turnos/reprogramar/${idTurno}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fecha_turno, hora_turno })
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo reprogramar el turno');
    }

    return datos;
}

async function registrarPaciente(datosPaciente) {
    const respuesta = await fetch(`${API_URL}/auth/registro/paciente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPaciente)
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo completar el registro de paciente');
    }
    return datos;
}

async function registrarMedico(datosMedico) {
    const respuesta = await fetch(`${API_URL}/auth/registro/medico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosMedico)
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo completar el registro de médico');
    }
    return datos;
}

async function verificarCorreo(token) {
    const respuesta = await fetch(`${API_URL}/auth/verificar-email?token=${encodeURIComponent(token)}`);
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo verificar el correo');
    }
    return datos;
}

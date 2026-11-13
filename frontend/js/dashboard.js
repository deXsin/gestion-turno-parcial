const token = sessionStorage.getItem('token');


if (!token) {
    window.location.href = '../index.html';
}


const datosUsuario = document.getElementById('datosUsuario');
const usuarioGuardado = sessionStorage.getItem('usuario');

if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    datosUsuario.textContent = `Bienvenido/a: ${usuario.email} (Rol ID: ${usuario.id_rol})`;
} else {
    datosUsuario.textContent = 'Sesión iniciada correctamente';
}

const botonCerrarSesion = document.getElementById('cerrarSesion');

botonCerrarSesion.addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = '../index.html';
});

// Cargar y mostrar la lista de turnos desde el backend
async function cargarTurnos() {
    const tablaBody = document.getElementById('tablaTurnosBody');
    if (!tablaBody) return;

    try {
        const turnos = await obtenerTurnos();

        if (turnos.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="7">No hay turnos registrados.</td></tr>';
            return;
        }

        let filasHtml = '';
        turnos.forEach(turno => {
            const fecha = turno.fecha_turno ? turno.fecha_turno.split('T')[0] : '-';
            filasHtml += `
                <tr>
                    <td>${turno.id_turno}</td>
                    <td>${fecha}</td>
                    <td>${turno.hora_turno}</td>
                    <td>${turno.dni_paciente}</td>
                    <td>${turno.id_practica}</td>
                    <td>${turno.medio_solicitado || '-'}</td>
                    <td><span class="estado estado-${(turno.estado_turno || '').toLowerCase()}">${turno.estado_turno || '-'}</span></td>
                </tr>
            `;
        });

        tablaBody.innerHTML = filasHtml;

    } catch (error) {
        console.error(error);
        tablaBody.innerHTML = `<tr><td colspan="7" style="color: red;">Error al cargar turnos: ${error.message}</td></tr>`;
    }
}

cargarTurnos();

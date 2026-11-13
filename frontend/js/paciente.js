const token = sessionStorage.getItem('token');
const usuarioGuardado = sessionStorage.getItem('usuario');

if (!token || !usuarioGuardado) {
    window.location.href = '../index.html';
}

const usuario = JSON.parse(usuarioGuardado);

// Protección de perfil: esta pantalla es exclusiva para PACIENTE (Rol 3)
if (Number(usuario.id_rol) === 1) {
    window.location.href = 'dashboard.html';
} else if (Number(usuario.id_rol) === 2) {
    window.location.href = 'medico.html';
}

const datosUsuario = document.getElementById('datosUsuario');
datosUsuario.textContent = `Paciente: ${usuario.email} | DNI: ${usuario.dni_paciente || '-'} | Perfil: Paciente (Rol 3)`;

const mensajeAccion = document.getElementById('mensajeAccion');
let turnoSeleccionadoReprog = null;

function mostrarMensaje(texto, esError = false) {
    mensajeAccion.textContent = texto;
    mensajeAccion.style.color = esError ? '#c62828' : '#155724';
    mensajeAccion.style.background = esError ? '#f8d7da' : '#d4edda';
    mensajeAccion.style.padding = '10px 14px';
    mensajeAccion.style.borderRadius = '6px';
}

document.getElementById('cerrarSesion').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = '../index.html';
});

async function cargarMisTurnos() {
    const tablaBody = document.getElementById('tablaMisTurnosBody');
    if (!usuario.dni_paciente) {
        tablaBody.innerHTML = '<tr><td colspan="7" style="color: red;">Volvé a iniciar sesión para actualizar los datos de tu DNI.</td></tr>';
        return;
    }

    try {
        const turnos = await obtenerTurnosPorPaciente(usuario.dni_paciente);
        if (turnos.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="7">Todavía no tenés turnos registrados.</td></tr>';
            return;
        }

        let filasHtml = '';
        turnos.forEach(turno => {
            const fecha = turno.fecha_turno ? turno.fecha_turno.split('T')[0] : '-';
            const cancelado = turno.estado_turno === 'Cancelado';

            filasHtml += `
                <tr>
                    <td>${turno.id_turno}</td>
                    <td>${fecha}</td>
                    <td>${turno.hora_turno}</td>
                    <td>#${turno.id_practica} ${turno.nombre_practica ? '- ' + turno.nombre_practica : ''}</td>
                    <td>${turno.medio_solicitado || 'Web'}</td>
                    <td><span class="estado estado-${(turno.estado_turno || '').toLowerCase()}">${turno.estado_turno || '-'}</span></td>
                    <td class="celda-acciones">
                        <button type="button" class="btn-tabla btn-reprogramar" onclick="abrirReprogramar(${turno.id_turno}, '${fecha}', '${turno.hora_turno}')" ${cancelado ? 'disabled' : ''}>Reprogramar</button>
                        <button type="button" class="btn-tabla btn-cancelar" onclick="cancelarMiTurno(${turno.id_turno})" ${cancelado ? 'disabled' : ''}>Cancelar</button>
                    </td>
                </tr>
            `;
        });

        tablaBody.innerHTML = filasHtml;
    } catch (error) {
        tablaBody.innerHTML = `<tr><td colspan="7" style="color: red;">Error: ${error.message}</td></tr>`;
    }
}

document.getElementById('formSolicitarTurno').addEventListener('submit', async function (e) {
    e.preventDefault();
    const [id_practica, id_equipo] = document.getElementById('practica_equipo').value.split('|').map(Number);

    try {
        const res = await crearTurnoApi({
            dni_paciente: Number(usuario.dni_paciente),
            fecha_turno: document.getElementById('fecha_turno').value,
            hora_turno: document.getElementById('hora_turno').value,
            id_practica,
            id_equipo,
            id_disponibilidad: 1,
            medio_solicitado: 'Web'
        });
        mostrarMensaje(res.mensaje || 'Turno reservado exitosamente');
        e.target.reset();
        cargarMisTurnos();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
});

async function cancelarMiTurno(idTurno) {
    if (!confirm(`¿Seguro que querés cancelar tu turno #${idTurno}?`)) return;
    try {
        const res = await cancelarTurnoApi(idTurno);
        mostrarMensaje(res.mensaje);
        cargarMisTurnos();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
}

function abrirReprogramar(idTurno, fechaActual, horaActual) {
    turnoSeleccionadoReprog = idTurno;
    document.getElementById('idTurnoReprogramar').textContent = idTurno;
    document.getElementById('nueva_fecha').value = fechaActual;
    document.getElementById('nueva_hora').value = horaActual.slice(0, 5);
    document.getElementById('boxReprogramar').style.display = 'block';
    document.getElementById('boxReprogramar').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('btnCancelarReprog').addEventListener('click', function () {
    turnoSeleccionadoReprog = null;
    document.getElementById('boxReprogramar').style.display = 'none';
});

document.getElementById('formReprogramar').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!turnoSeleccionadoReprog) return;

    try {
        const res = await reprogramarTurnoApi(
            turnoSeleccionadoReprog,
            document.getElementById('nueva_fecha').value,
            document.getElementById('nueva_hora').value
        );
        mostrarMensaje(res.mensaje);
        document.getElementById('boxReprogramar').style.display = 'none';
        turnoSeleccionadoReprog = null;
        cargarMisTurnos();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
});

cargarMisTurnos();

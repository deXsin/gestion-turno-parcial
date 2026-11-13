const token = sessionStorage.getItem('token');
const usuarioGuardado = sessionStorage.getItem('usuario');

if (!token || !usuarioGuardado) {
    window.location.href = '../index.html';
}

const usuario = JSON.parse(usuarioGuardado);

// Protección de perfil: esta pantalla es exclusiva para MEDICO (Rol 2)
if (Number(usuario.id_rol) === 1) {
    window.location.href = 'dashboard.html';
} else if (Number(usuario.id_rol) === 3) {
    window.location.href = 'paciente.html';
}

const datosUsuario = document.getElementById('datosUsuario');
datosUsuario.textContent = `Médico: ${usuario.email} | Matrícula: ${usuario.matricula_medico || '-'} | Perfil: Médico (Rol 2)`;

const mensajeAccion = document.getElementById('mensajeAccion');

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

async function cargarTurnosMedico(filtros = {}) {
    const tablaBody = document.getElementById('tablaTurnosBody');
    try {
        const turnos = await obtenerTurnos(filtros);
        if (turnos.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="7">No hay turnos para mostrar.</td></tr>';
            return;
        }

        let filasHtml = '';
        turnos.forEach(turno => {
            const fechaIso = turno.fecha_turno ? turno.fecha_turno.split('T')[0] : '';
            const fechaMostrar = formatearFechaArgentina(fechaIso);
            const estado = turno.estado_turno || '-';

            let botonesHtml = '<span class="sin-acciones">Sin acciones</span>';
            if (estado === 'Reservado') {
                botonesHtml = `
                    <button type="button" class="btn-tabla btn-confirmar" onclick="confirmarComoMedico(${turno.id_turno})">Confirmar</button>
                    <button type="button" class="btn-tabla btn-cancelar" onclick="cancelarComoMedico(${turno.id_turno})">Cancelar</button>
                `;
            } else if (estado === 'Confirmado') {
                botonesHtml = `
                    <button type="button" class="btn-tabla btn-cancelar" onclick="cancelarComoMedico(${turno.id_turno})">Cancelar</button>
                `;
            }

            filasHtml += `
                <tr>
                    <td>${fechaMostrar}</td>
                    <td>${turno.hora_turno}</td>
                    <td>${turno.dni_paciente}</td>
                    <td>#${turno.id_practica} ${turno.nombre_practica ? '- ' + turno.nombre_practica : ''}</td>
                    <td><span class="estado estado-${estado.toLowerCase()}">${estado}</span></td>
                    <td>${turno.medico_confirmacion || '-'}</td>
                    <td class="celda-acciones">${botonesHtml}</td>
                </tr>
            `;
        });

        tablaBody.innerHTML = filasHtml;
    } catch (error) {
        tablaBody.innerHTML = `<tr><td colspan="7" style="color: red;">Error: ${error.message}</td></tr>`;
    }
}

async function confirmarComoMedico(idTurno) {
    try {
        const res = await confirmarTurnoApi(idTurno, usuario.matricula_medico);
        mostrarMensaje(res.mensaje);
        cargarTurnosMedico();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
}

async function cancelarComoMedico(idTurno) {
    if (!confirm(`¿Confirmás la cancelación del turno #${idTurno}?`)) return;
    try {
        const res = await cancelarTurnoApi(idTurno);
        mostrarMensaje(res.mensaje);
        cargarTurnosMedico();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
}

document.getElementById('formFiltros').addEventListener('submit', function (e) {
    e.preventDefault();
    cargarTurnosMedico({
        fecha: document.getElementById('filtroFecha').value,
        estado: document.getElementById('filtroEstado').value,
        dni_paciente: document.getElementById('filtroDni').value
    });
});

document.getElementById('btnLimpiarFiltros').addEventListener('click', function () {
    document.getElementById('formFiltros').reset();
    cargarTurnosMedico();
});

cargarTurnosMedico();

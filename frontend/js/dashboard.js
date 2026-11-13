const token = sessionStorage.getItem('token');
const usuarioGuardado = sessionStorage.getItem('usuario');

if (!token || !usuarioGuardado) {
    window.location.href = '../index.html';
}

const usuario = JSON.parse(usuarioGuardado);

// Protección de perfil: esta pantalla es exclusiva para ADMIN (Rol 1)
if (Number(usuario.id_rol) === 2) {
    window.location.href = 'medico.html';
} else if (Number(usuario.id_rol) === 3) {
    window.location.href = 'paciente.html';
}

const datosUsuario = document.getElementById('datosUsuario');
datosUsuario.textContent = `Usuario: ${usuario.email} | Perfil: Administrador (Rol 1)`;

const mensajeAccion = document.getElementById('mensajeAccion');
let turnoSeleccionadoReprog = null;

const hoyMin = obtenerHoyInput();
document.getElementById('fecha_turno').setAttribute('min', hoyMin);
document.getElementById('nueva_fecha').setAttribute('min', hoyMin);

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

async function cargarTurnos(filtros = {}) {
    const tablaBody = document.getElementById('tablaTurnosBody');
    if (!tablaBody) return;

    try {
        const turnos = await obtenerTurnos(filtros);

        if (turnos.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="9">No se encontraron turnos con esos criterios.</td></tr>';
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
                    <button type="button" class="btn-tabla btn-confirmar" onclick="accionConfirmar(${turno.id_turno})">Confirmar</button>
                    <button type="button" class="btn-tabla btn-reprogramar" onclick="abrirReprogramar(${turno.id_turno}, '${fechaIso}', '${turno.hora_turno}')">Reprogramar</button>
                    <button type="button" class="btn-tabla btn-cancelar" onclick="accionCancelar(${turno.id_turno})">Cancelar</button>
                `;
            } else if (estado === 'Confirmado') {
                botonesHtml = `
                    <button type="button" class="btn-tabla btn-cancelar" onclick="accionCancelar(${turno.id_turno})">Cancelar</button>
                `;
            }

            filasHtml += `
                <tr>
                    <td>${turno.id_turno}</td>
                    <td>${fechaMostrar}</td>
                    <td>${turno.hora_turno}</td>
                    <td>${turno.dni_paciente}</td>
                    <td>#${turno.id_practica} ${turno.nombre_practica ? '- ' + turno.nombre_practica : ''}</td>
                    <td>#${turno.id_equipo || '-'}</td>
                    <td>${turno.medio_solicitado || '-'}</td>
                    <td><span class="estado estado-${estado.toLowerCase()}">${estado}</span></td>
                    <td class="celda-acciones">${botonesHtml}</td>
                </tr>
            `;
        });

        tablaBody.innerHTML = filasHtml;

    } catch (error) {
        console.error(error);
        tablaBody.innerHTML = `<tr><td colspan="9" style="color: red;">Error al cargar turnos: ${error.message}</td></tr>`;
    }
}

document.getElementById('formNuevoTurno').addEventListener('submit', async function (e) {
    e.preventDefault();
    const [id_practica, id_equipo] = document.getElementById('practica_equipo').value.split('|').map(Number);

    try {
        const res = await crearTurnoApi({
            dni_paciente: Number(document.getElementById('dni_paciente').value),
            fecha_turno: document.getElementById('fecha_turno').value,
            hora_turno: document.getElementById('hora_turno').value,
            id_practica,
            id_equipo,
            id_disponibilidad: 1,
            medio_solicitado: document.getElementById('medio_solicitado').value
        });
        mostrarMensaje(res.mensaje || 'Turno creado correctamente');
        e.target.reset();
        cargarTurnos();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
});

document.getElementById('formFiltros').addEventListener('submit', function (e) {
    e.preventDefault();
    cargarTurnos({
        fecha: document.getElementById('filtroFecha').value,
        estado: document.getElementById('filtroEstado').value,
        dni_paciente: document.getElementById('filtroDni').value
    });
});

document.getElementById('btnLimpiarFiltros').addEventListener('click', function () {
    document.getElementById('formFiltros').reset();
    cargarTurnos();
});

async function accionConfirmar(idTurno) {
    const matricula = prompt('Ingresá la matrícula del médico que confirma el turno (ej: 1001):', '1001');
    if (!matricula) return;

    try {
        const res = await confirmarTurnoApi(idTurno, Number(matricula));
        mostrarMensaje(res.mensaje);
        cargarTurnos();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
}

async function accionCancelar(idTurno) {
    if (!confirm(`¿Seguro que querés cancelar el turno #${idTurno}?`)) return;
    try {
        const res = await cancelarTurnoApi(idTurno);
        mostrarMensaje(res.mensaje);
        cargarTurnos();
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
        cargarTurnos();
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
});

cargarTurnos();

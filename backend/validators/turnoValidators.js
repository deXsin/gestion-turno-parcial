const db = require('../config/database');

/**
 * Obtiene la fecha y hora actual en zona horaria local de Argentina.
 * Utilizado para evitar que se reserven o reprogramen turnos en momentos ya pasados.
 */
function obtenerFechaHoraActual() {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    return {
        hoy: `${anio}-${mes}-${dia}`,
        horaActual: `${horas}:${minutos}`
    };
}

/**
 * Validador principal para la creación de un nuevo turno médico.
 * Aplica las reglas de negocio de la clínica y las validaciones solicitadas para el parcial.
 */
async function validarNuevoTurno(datos) {
    const {
        fecha_turno, hora_turno, medio_solicitado, dni_paciente, 
        id_practica, id_equipo, id_disponibilidad
    } = datos;

    // Regla 1: Campos obligatorios presentes
    if (!fecha_turno || !hora_turno || !medio_solicitado || !dni_paciente || !id_practica || !id_equipo || !id_disponibilidad) {
        return { valido: false, status: 400, error: 'Todos los campos obligatorios deben estar presentes' };
    }

    // Regla 2: Formato de DNI argentino (numérico de 7 u 8 dígitos)
    if (!/^\d{7,8}$/.test(String(dni_paciente).trim())) {
        return { valido: false, status: 400, error: 'El DNI del paciente debe tener entre 7 y 8 dígitos numéricos' };
    }

    // Regla 3: No permitir fechas pasadas ni horarios anteriores al actual en el mismo día
    const { hoy, horaActual } = obtenerFechaHoraActual();
    if (fecha_turno < hoy) {
        return { valido: false, status: 400, error: 'La fecha del turno no puede ser anterior al día de hoy' };
    }
    if (fecha_turno === hoy && hora_turno.slice(0, 5) <= horaActual) {
        return { valido: false, status: 400, error: 'Para el día de hoy debés elegir un horario posterior a la hora actual' };
    }

    // Regla 4: Control de franjas horarias y días de atención de la clínica
    const diaSemana = new Date(`${fecha_turno}T00:00:00`).getDay();
    if (diaSemana === 0) {
        return { valido: false, status: 400, error: 'El centro médico permanece cerrado los domingos' };
    }
    if (diaSemana >= 1 && diaSemana <= 5) {
        if (hora_turno < '08:00' || hora_turno > '20:00') {
            return { valido: false, status: 400, error: 'El horario de atención de L a V es de 08:00 a 20:00' };
        }
    } else if (diaSemana === 6) {
        if (hora_turno < '08:00' || hora_turno > '14:00') {
            return { valido: false, status: 400, error: 'El horario de atención los sábados es de 08:00 a 14:00' };
        }
    }

    // Regla 5: Verificar que el paciente exista en el padrón de la base de datos
    const [paciente] = await db.execute('SELECT dni_paciente FROM paciente WHERE dni_paciente = ?', [dni_paciente]);
    if (paciente.length === 0) {
        return { valido: false, status: 404, error: 'El DNI no corresponde a un paciente registrado' };
    }

    // VALIDACIÓN NUEVA A: Evitar que un paciente tenga dos turnos superpuestos (misma fecha y hora activos)
    const [turnosPaciente] = await db.execute(
        `SELECT id_turno FROM turno 
         WHERE dni_paciente = ? AND fecha_turno = ? AND hora_turno = ? AND estado_turno != 'Cancelado'`,
        [dni_paciente, fecha_turno, hora_turno]
    );
    if (turnosPaciente.length > 0) {
        return { valido: false, status: 409, error: 'El paciente ya tiene un turno asignado en esa misma fecha y horario' };
    }

    // VALIDACIÓN NUEVA B: Controlar que el equipo seleccionado realice la práctica solicitada
    const [relacionEquipo] = await db.execute(
        'SELECT id_practica FROM practica_equipo WHERE id_practica = ? AND id_equipo = ?',
        [id_practica, id_equipo]
    );
    if (relacionEquipo.length === 0) {
        return { valido: false, status: 400, error: 'El equipo seleccionado no corresponde a la práctica médica solicitada' };
    }

    // VALIDACIÓN NUEVA C: Evitar superposición de uso del mismo equipo o consultorio a la misma hora
    const [turnosEquipo] = await db.execute(
        `SELECT id_turno FROM turno 
         WHERE id_equipo = ? AND fecha_turno = ? AND hora_turno = ? AND estado_turno != 'Cancelado'`,
        [id_equipo, fecha_turno, hora_turno]
    );
    if (turnosEquipo.length > 0) {
        return { valido: false, status: 409, error: 'Ya existe otro turno reservado para esa práctica/equipo en el mismo horario' };
    }

    return { valido: true };
}

/**
 * Validador para la reprogramación de turnos (Mejora funcional).
 * Aplica las mismas restricciones evitando que coincida con otros turnos del paciente o del equipo.
 */
async function validarReprogramacionTurno(turnoActual, nuevaFecha, nuevaHora) {
    if (!nuevaFecha || !nuevaHora) {
        return { valido: false, status: 400, error: 'Debés indicar la nueva fecha y el nuevo horario' };
    }

    // Control de fecha no pasada
    const { hoy, horaActual } = obtenerFechaHoraActual();
    if (nuevaFecha < hoy) {
        return { valido: false, status: 400, error: 'La fecha del turno no puede ser anterior al día de hoy' };
    }
    if (nuevaFecha === hoy && nuevaHora.slice(0, 5) <= horaActual) {
        return { valido: false, status: 400, error: 'Para el día de hoy debés elegir un horario posterior a la hora actual' };
    }

    // Control de atención según día de semana
    const diaSemana = new Date(`${nuevaFecha}T00:00:00`).getDay();
    if (diaSemana === 0) {
        return { valido: false, status: 400, error: 'El centro médico permanece cerrado los domingos' };
    }
    if (diaSemana >= 1 && diaSemana <= 5 && (nuevaHora < '08:00' || nuevaHora > '20:00')) {
        return { valido: false, status: 400, error: 'El horario de atención de L a V es de 08:00 a 20:00' };
    }
    if (diaSemana === 6 && (nuevaHora < '08:00' || nuevaHora > '14:00')) {
        return { valido: false, status: 400, error: 'El horario de atención los sábados es de 08:00 a 14:00' };
    }

    // Verificar que el paciente no tenga otro turno activo a esa misma hora
    const [superpuestoPaciente] = await db.execute(
        `SELECT id_turno FROM turno 
         WHERE dni_paciente = ? AND fecha_turno = ? AND hora_turno = ? 
           AND estado_turno != 'Cancelado' AND id_turno != ?`,
        [turnoActual.dni_paciente, nuevaFecha, nuevaHora, turnoActual.id_turno]
    );
    if (superpuestoPaciente.length > 0) {
        return { valido: false, status: 409, error: 'El paciente ya tiene otro turno en esa fecha y horario' };
    }

    // Verificar que el equipo no esté ocupado por otro turno
    const [superpuestoEquipo] = await db.execute(
        `SELECT id_turno FROM turno 
         WHERE id_equipo = ? AND fecha_turno = ? AND hora_turno = ? 
           AND estado_turno != 'Cancelado' AND id_turno != ?`,
        [turnoActual.id_equipo, nuevaFecha, nuevaHora, turnoActual.id_turno]
    );
    if (superpuestoEquipo.length > 0) {
        return { valido: false, status: 409, error: 'Ese horario ya está ocupado para el equipo/práctica del turno' };
    }

    return { valido: true };
}

module.exports = {
    validarNuevoTurno,
    validarReprogramacionTurno
};
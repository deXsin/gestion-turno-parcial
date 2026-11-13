const db = require('../config/database');

// Recibe los datos del body
async function validarNuevoTurno(datos) {
    const {
        fecha_turno, hora_turno, medio_solicitado, dni_paciente, 
        id_practica, id_equipo, id_disponibilidad
    } = datos;

    // 1. Campos obligatorios
    if (!fecha_turno || !hora_turno || !medio_solicitado || !dni_paciente || !id_practica || !id_equipo || !id_disponibilidad) {
        return { valido: false, status: 400, error: 'Todos los campos obligatorios deben estar presentes' };
    }

    // 2. Fecha no anterior al día actual
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha_turno < hoy) {
        return { valido: false, status: 400, error: 'La fecha del turno no puede ser anterior al día de hoy' };
    }

    // 3. Franja horaria de atención
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

    // 4. Verificar paciente en la BD
    const [paciente] = await db.execute('SELECT dni_paciente FROM paciente WHERE dni_paciente = ?', [dni_paciente]);
    if (paciente.length === 0) {
        return { valido: false, status: 404, error: 'El DNI no corresponde a un paciente registrado' };
    }

    // 5. Evitar que un paciente tenga dos turnos superpuestos (misma fecha y hora no cancelado)
    const [turnosPaciente] = await db.execute(
        `SELECT id_turno FROM turno 
         WHERE dni_paciente = ? AND fecha_turno = ? AND hora_turno = ? AND estado_turno != 'Cancelado'`,
        [dni_paciente, fecha_turno, hora_turno]
    );
    if (turnosPaciente.length > 0) {
        return { valido: false, status: 409, error: 'El paciente ya tiene un turno asignado en esa misma fecha y horario' };
    }

    // 6. Controlar que el equipo corresponda a la práctica solicitada
    const [relacionEquipo] = await db.execute(
        'SELECT id_practica FROM practica_equipo WHERE id_practica = ? AND id_equipo = ?',
        [id_practica, id_equipo]
    );
    if (relacionEquipo.length === 0) {
        return { valido: false, status: 400, error: 'El equipo seleccionado no corresponde a la práctica médica solicitada' };
    }

    // 7. Evitar dos turnos en el mismo horario para el mismo equipo/consultorio
    const [turnosEquipo] = await db.execute(
        `SELECT id_turno FROM turno 
         WHERE id_equipo = ? AND fecha_turno = ? AND hora_turno = ? AND estado_turno != 'Cancelado'`,
        [id_equipo, fecha_turno, hora_turno]
    );
    if (turnosEquipo.length > 0) {
        return { valido: false, status: 409, error: 'Ya existe otro turno reservado para esa práctica/equipo en el mismo horario' };
    }

    // Si pasó todas las validaciones, devolvemos true
    return { valido: true };
}

async function validarReprogramacionTurno(turnoActual, nuevaFecha, nuevaHora) {
    if (!nuevaFecha || !nuevaHora) {
        return { valido: false, status: 400, error: 'Debés indicar la nueva fecha y el nuevo horario' };
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (nuevaFecha < hoy) {
        return { valido: false, status: 400, error: 'La fecha del turno no puede ser anterior al día de hoy' };
    }

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

    const [superpuestoPaciente] = await db.execute(
        `SELECT id_turno FROM turno 
         WHERE dni_paciente = ? AND fecha_turno = ? AND hora_turno = ? 
           AND estado_turno != 'Cancelado' AND id_turno != ?`,
        [turnoActual.dni_paciente, nuevaFecha, nuevaHora, turnoActual.id_turno]
    );
    if (superpuestoPaciente.length > 0) {
        return { valido: false, status: 409, error: 'El paciente ya tiene otro turno en esa fecha y horario' };
    }

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
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


    // Si pasó todas las validaciones, devolvemos true
    return { valido: true };
}

module.exports = {
    validarNuevoTurno
};
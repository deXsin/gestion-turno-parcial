const db = require('../config/database');

// 1. OBTENER TODOS (con filtros opcionales y filtro por especialidad del médico)
async function obtenerTodos(filtros = {}) {
    let sql = `
        SELECT t.*, p.nombre_practica
        FROM turno t
        LEFT JOIN practica p ON t.id_practica = p.id_practica
        WHERE 1=1
    `;
    const params = [];

    if (filtros.matricula_medico) {
        sql += ` AND t.id_practica IN (
            SELECT pm.id_practica FROM practica_medico pm WHERE pm.matricula_medico = ?
        )`;
        params.push(filtros.matricula_medico);
    }
    if (filtros.fecha) {
        sql += ' AND t.fecha_turno = ?';
        params.push(filtros.fecha);
    }
    if (filtros.estado) {
        sql += ' AND t.estado_turno = ?';
        params.push(filtros.estado);
    }
    if (filtros.dni_paciente) {
        sql += ' AND t.dni_paciente = ?';
        params.push(filtros.dni_paciente);
    }

    sql += ' ORDER BY t.fecha_turno, t.hora_turno';
    const [turnos] = await db.execute(sql, params);
    return turnos;
}


// 2. OBTENER POR ID
async function obtenerPorId(id) {
    const [turnos] = await db.execute(
        'SELECT * FROM turno WHERE id_turno = ?',
        [id]
    );
    return turnos;
}

// 3. CREAR TURNO
async function crear(datosTurno) {
    // Extraemos los datos del objeto que nos pasará el controlador
    const {
        fecha_turno, hora_turno, medio_solicitado, estado_turno, 
        fecha_confirmacion, medico_confirmacion, dni_paciente, 
        id_practica, id_equipo, id_disponibilidad
    } = datosTurno;

    const [resultado] = await db.execute(
        `INSERT INTO turno
        (fecha_turno, hora_turno, medio_solicitado, estado_turno, fecha_confirmacion, medico_confirmacion, dni_paciente, id_practica, id_equipo, id_disponibilidad)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fecha_turno, hora_turno, medio_solicitado, estado_turno, fecha_confirmacion, medico_confirmacion, dni_paciente, id_practica, id_equipo, id_disponibilidad]
    );
    
    return resultado;
}

//4. CANCELAR TURNO
async function cancelar(id_turno) {
    // Solo actualizamos el estado, no borramos el registro de la BD
    const [resultado] = await db.execute(
        "UPDATE turno SET estado_turno = 'Cancelado' WHERE id_turno = ?",
        [id_turno]
    );
    return resultado;
}

//5. OBTENER TURNOS POR PACIENTE
async function obtenerPorPaciente(dni_paciente) {
    const [turnos] = await db.execute(
        `SELECT t.*, p.nombre_practica
         FROM turno t
         LEFT JOIN practica p ON t.id_practica = p.id_practica
         WHERE t.dni_paciente = ?
         ORDER BY t.fecha_turno DESC, t.hora_turno DESC`,
        [dni_paciente]
    );
    return turnos;
}
    
//6. CONFIRMAR TURNO
async function confirmar(id_turno, medico_confirmacion) {
    // Cambiamos el estado, guardamos la fecha actual y la matrícula del médico
    const [resultado] = await db.execute(
        "UPDATE turno SET estado_turno = 'Confirmado', fecha_confirmacion = NOW(), medico_confirmacion = ? WHERE id_turno = ?",
        [medico_confirmacion, id_turno]
    );
    return resultado;
}

//7. REPROGRAMAR TURNO
async function reprogramar(id_turno, fecha_turno, hora_turno) {
    const [resultado] = await db.execute(
        "UPDATE turno SET fecha_turno = ?, hora_turno = ?, estado_turno = 'Reservado', fecha_confirmacion = NULL, medico_confirmacion = NULL WHERE id_turno = ?",
        [fecha_turno, hora_turno, id_turno]
    );
    return resultado;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    cancelar,
    obtenerPorPaciente,
    confirmar,
    reprogramar
};

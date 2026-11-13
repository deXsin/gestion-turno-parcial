const db = require('../config/database');

// 2. OBTENER POR TODOS
async function obtenerTodos() {
    const [turnos] = await db.query(`
        SELECT *
        FROM turno
        ORDER BY fecha_turno, hora_turno
    `);
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
        'SELECT * FROM turno WHERE dni_paciente = ? ORDER BY fecha_turno DESC, hora_turno DESC',
        [dni_paciente]
    );
    return turnos;
}
    
//6. CONFIRMAR TURNO
async function confirmar(id_turno, medico_confirmacion) {
    // Cambiamos el estado, guardamos la fecha actual y la matrícula del médico
    const [resultado] = await db.execute(
        "UPDATE turno SET estado_turno = 'Confirmado', fecha_confirmacion = NOW(), medico_confirmacion = ? WHERE id_turno = ?",
        [id_turno, medico_confirmacion]
    );
    return resultado;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    cancelar,
    obtenerPorPaciente,
    confirmar
};

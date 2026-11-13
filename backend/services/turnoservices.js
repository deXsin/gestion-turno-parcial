const db = require('../config/database');

let acentosCorregidos = false;

// Actualiza automáticamente a 'Expirado' los turnos cuya fecha/hora ya pasó y corrige tildes si se importaron con '??'
async function actualizarTurnosExpirados() {
    if (!acentosCorregidos) {
        const practicasLimpias = [
            [1, 'Consulta clínica'], [5, 'Control pediátrico'], [6, 'Consulta traumatológica'],
            [7, 'Radiografía'], [8, 'Control ginecológico'], [10, 'Consulta dermatológica'],
            [11, 'Dermatoscopía'], [12, 'Control oftalmológico'], [14, 'Ecografía abdominal'],
            [15, 'Ecografía obstétrica'], [16, 'Tomografía computada'], [17, 'Resonancia magnética'],
            [18, 'Consulta cardiológica'], [19, 'Control de niño sano'], [20, 'Ecografía musculoesquelética']
        ];
        for (const [id, nombre] of practicasLimpias) {
            await db.execute('UPDATE practica SET nombre_practica = ? WHERE id_practica = ? AND nombre_practica LIKE "%?%"', [nombre, id]);
        }
        await db.execute("UPDATE turno SET medio_solicitado = 'Teléfono' WHERE medio_solicitado LIKE 'Tel%fono'");
        acentosCorregidos = true;
    }

    await db.execute(`
        UPDATE turno
        SET estado_turno = 'Expirado'
        WHERE (fecha_turno < CURDATE() OR (fecha_turno = CURDATE() AND hora_turno < CURTIME()))
          AND estado_turno NOT IN ('Cancelado', 'Expirado')
    `);
}

// 1. OBTENER TODOS (con filtros opcionales y filtro por especialidad del médico)
async function obtenerTodos(filtros = {}) {
    // Primero actualiza turnos pasados al estado 'Expirado'
    await actualizarTurnosExpirados();
    let sql = `
        SELECT t.*, p.nombre_practica
        FROM turno t
        LEFT JOIN practica p ON t.id_practica = p.id_practica
        WHERE 1=1
    `;
    const params = [];

    // Filtro automático: si consulta un médico, solo ve turnos de las prácticas que él atiende
    if (filtros.matricula_medico) {
        sql += ` AND t.id_practica IN (
            SELECT pm.id_practica FROM practica_medico pm WHERE pm.matricula_medico = ?
        )`;
        params.push(filtros.matricula_medico);
    }
    // Filtros opcionales enviados desde la barra de búsqueda del frontend
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
    await actualizarTurnosExpirados();
    const [turnos] = await db.execute(
        'SELECT * FROM turno WHERE id_turno = ?',
        [id]
    );
    return turnos;
}

// 3. CREAR TURNO
async function crear(datosTurno) {
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

// 4. CANCELAR TURNO (Baja lógica: no se borra la fila, se cambia el estado a 'Cancelado')
async function cancelar(id_turno) {
    const [resultado] = await db.execute(
        "UPDATE turno SET estado_turno = 'Cancelado' WHERE id_turno = ?",
        [id_turno]
    );
    return resultado;
}

// 5. OBTENER TURNOS POR PACIENTE
async function obtenerPorPaciente(dni_paciente) {
    await actualizarTurnosExpirados();
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
    
// 6. CONFIRMAR TURNO (Guarda la matrícula médica y la fecha/hora actual de confirmación)
async function confirmar(id_turno, medico_confirmacion) {
    const [resultado] = await db.execute(
        "UPDATE turno SET estado_turno = 'Confirmado', fecha_confirmacion = NOW(), medico_confirmacion = ? WHERE id_turno = ?",
        [medico_confirmacion, id_turno]
    );
    return resultado;
}

// 7. REPROGRAMAR TURNO (Actualiza fecha/hora y restablece a 'Reservado')
async function reprogramar(id_turno, fecha_turno, hora_turno) {
    const [resultado] = await db.execute(
        "UPDATE turno SET fecha_turno = ?, hora_turno = ?, estado_turno = 'Reservado', fecha_confirmacion = NULL, medico_confirmacion = NULL WHERE id_turno = ?",
        [fecha_turno, hora_turno, id_turno]
    );
    return resultado;
}

// 8. VERIFICAR SI UN MÉDICO ESTÁ HABILITADO PARA UNA PRÁCTICA
async function verificarMedicoHabilitado(matricula, id_practica) {
    const [habilitado] = await db.execute(
        'SELECT 1 FROM practica_medico WHERE matricula_medico = ? AND id_practica = ?',
        [matricula, id_practica]
    );
    return habilitado.length > 0;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    cancelar,
    obtenerPorPaciente,
    confirmar,
    reprogramar,
    verificarMedicoHabilitado
};

const db = require('../config/database');

// Importas tu función validadora normal
const { validarNuevoTurno } = require('../validators/turnoValidators');
const turnoService = require('../services/turnoservices');

// 1. OBTENER TODOS LOS TURNOS
async function obtenerTurnos(req, res) {
    try {
        const turnos = await turnoService.obtenerTodos();
        res.json(turnos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al obtener los turnos'
        });
    }
}

// 2. OBTENER UN TURNO POR ID
async function obtenerTurnoPorId(req, res) {
    try {
        const id = req.params.id;
        
        // Llamamos al servicio pasándole el ID
        const turnos = await turnoService.obtenerPorId(id);
        
        if (turnos.length === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        res.json(turnos[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el turno' });
    }
}

// 3. CREAR TURNO
async function crearTurno(req, res) {
    try {
        // 1. Llamar al validador 
        const validacion = await validarNuevoTurno(req.body);
        if (validacion.valido === false) {
            return res.status(validacion.status).json({ error: validacion.error });
        }

        // 2. Preparar los datos juntando lo que vino del Thunder Client con los valores por defecto
        const datosTurno = {
            ...req.body, // Copia todos los datos del body (fecha, hora, dni, etc.)
            estado_turno: 'Reservado',
            fecha_confirmacion: null,
            medico_confirmacion: null
        };

        // 3. Llamar al servicio para que lo guarde en la BD
        const resultado = await turnoService.crear(datosTurno);

        // 4. Responder al cliente
        res.status(201).json({
            mensaje: 'Turno creado correctamente',
            id_turno: resultado.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el turno' });
    }
}

//4. CANCELAR TURNO
async function cancelarTurno(req, res) {
    try {
        const { id } = req.params;
        const resultado = await turnoService.cancelar(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        res.json({ mensaje: 'Turno cancelado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cancelar el turno' });
    }
}

// 5. OBTENER TURNOS POR PACIENTE
async function obtenerTurnosPorPaciente(req, res) {
    try {
        const { dni } = req.params;
        const turnos = await turnoService.obtenerPorPaciente(dni);

        if (turnos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron turnos para este paciente' });
        }

        res.json(turnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los turnos del paciente' });
    }
}

//6.CONFIRMAR TURNO
async function confirmarTurno(req, res) {
    try {
        const { id } = req.params;
        const { medico_confirmacion } = req.body; // El ID del médico viaja en el Body

        if (!medico_confirmacion) {
            return res.status(400).json({ error: 'Falta la matrícula del médico que confirma' });
        }

        const resultado = await turnoService.confirmar(id, medico_confirmacion);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        res.json({ mensaje: 'Turno confirmado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al confirmar el turno' });
    }
}

// EXPORTAR CONTROLADORES
module.exports = {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    cancelarTurno,
    obtenerTurnosPorPaciente,
    confirmarTurno
};

const db = require('../config/database');

// Importas tu función validadora normal
const { validarNuevoTurno, validarReprogramacionTurno } = require('../validators/turnoValidators');
const turnoService = require('../services/turnoservices');

// 1. OBTENER TODOS LOS TURNOS (soporta filtros por query y filtra por prácticas del médico si es Rol 2)
async function obtenerTurnos(req, res) {
    try {
        const filtros = { ...req.query };

        // Si el usuario logueado es Médico (Rol 2), solo ve los turnos de las prácticas que él realiza
        if (req.usuario && Number(req.usuario.id_rol) === 2) {
            filtros.matricula_medico = req.usuario.matricula_medico;
        }

        const turnos = await turnoService.obtenerTodos(filtros);
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
        // Si quien crea el turno es un Paciente (rol 3), solo puede crearlo para su propio DNI
        if (req.usuario && Number(req.usuario.id_rol) === 3) {
            if (Number(req.body.dni_paciente) !== Number(req.usuario.dni_paciente)) {
                return res.status(403).json({
                    error: 'Solo podés solicitar turnos para tu propio DNI'
                });
            }
        }

        // Preparar los datos con los valores por defecto
        const datosTurno = {
            ...req.body,
            estado_turno: 'Reservado',
            fecha_confirmacion: null,
            medico_confirmacion: null
        };

        // Llamar al servicio para que lo guarde en la BD
        const resultado = await turnoService.crear(datosTurno);

        res.status(201).json({
            mensaje: 'Turno creado correctamente',
            id_turno: resultado.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el turno' });
    }
}

// 4. CANCELAR TURNO
async function cancelarTurno(req, res) {
    try {
        const { id } = req.params;
        const turnos = await turnoService.obtenerPorId(id);

        if (turnos.length === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        const turnoActual = turnos[0];

        // Si es Paciente (rol 3), verificar que el turno sea suyo
        if (req.usuario && Number(req.usuario.id_rol) === 3) {
            if (Number(turnoActual.dni_paciente) !== Number(req.usuario.dni_paciente)) {
                return res.status(403).json({ error: 'No tenés permiso para cancelar el turno de otro paciente' });
            }
        }

        // Impedir que se modifique/cancele un turno que ya fue cancelado o expiró
        if (turnoActual.estado_turno === 'Cancelado' || turnoActual.estado_turno === 'Expirado') {
            return res.status(400).json({ error: `No se puede cancelar un turno en estado ${turnoActual.estado_turno}` });
        }

        await turnoService.cancelar(id);
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

        // Si es Paciente (rol 3), solo puede consultar sus propios turnos
        if (req.usuario && Number(req.usuario.id_rol) === 3) {
            if (Number(dni) !== Number(req.usuario.dni_paciente)) {
                return res.status(403).json({ error: 'No tenés permiso para ver los turnos de otro paciente' });
            }
        }

        const turnos = await turnoService.obtenerPorPaciente(dni);
        res.json(turnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los turnos del paciente' });
    }
}

// 6. CONFIRMAR TURNO
async function confirmarTurno(req, res) {
    try {
        const { id } = req.params;
        const matricula = req.body.medico_confirmacion || (req.usuario && req.usuario.matricula_medico);

        if (!matricula) {
            return res.status(400).json({ error: 'Falta la matrícula del médico que confirma' });
        }

        const turnos = await turnoService.obtenerPorId(id);
        if (turnos.length === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        const turnoActual = turnos[0];

        // Impedir que se modifique un turno que ya fue cancelado o expiró
        if (turnoActual.estado_turno === 'Cancelado' || turnoActual.estado_turno === 'Expirado') {
            return res.status(400).json({ error: `No se puede confirmar un turno en estado ${turnoActual.estado_turno}` });
        }

        if (turnoActual.estado_turno === 'Confirmado') {
            return res.status(400).json({ error: 'El turno ya se encuentra confirmado' });
        }

        // Controlar que el médico pueda realizar la práctica solicitada en ese turno
        const [habilitado] = await db.execute(
            'SELECT 1 FROM practica_medico WHERE matricula_medico = ? AND id_practica = ?',
            [matricula, turnoActual.id_practica]
        );
        if (habilitado.length === 0) {
            return res.status(400).json({
                error: `El médico con matrícula ${matricula} no realiza la práctica #${turnoActual.id_practica} solicitada en este turno`
            });
        }

        await turnoService.confirmar(id, matricula);
        res.json({ mensaje: 'Turno confirmado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al confirmar el turno' });
    }
}

// 7. REPROGRAMAR TURNO
async function reprogramarTurno(req, res) {
    try {
        const { id } = req.params;
        const { fecha_turno, hora_turno } = req.body;

        const turnos = await turnoService.obtenerPorId(id);
        if (turnos.length === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        const turnoActual = turnos[0];

        // Si es Paciente (rol 3), solo puede reprogramar sus propios turnos
        if (req.usuario && Number(req.usuario.id_rol) === 3) {
            if (Number(turnoActual.dni_paciente) !== Number(req.usuario.dni_paciente)) {
                return res.status(403).json({ error: 'No tenés permiso para reprogramar el turno de otro paciente' });
            }
        }

        // Impedir que se modifique un turno que ya fue cancelado o expiró
        if (turnoActual.estado_turno === 'Cancelado' || turnoActual.estado_turno === 'Expirado') {
            return res.status(400).json({ error: `No se puede reprogramar un turno en estado ${turnoActual.estado_turno}` });
        }

        const validacion = await validarReprogramacionTurno(turnoActual, fecha_turno, hora_turno);
        if (validacion.valido === false) {
            return res.status(validacion.status).json({ error: validacion.error });
        }

        await turnoService.reprogramar(id, fecha_turno, hora_turno);
        res.json({ mensaje: 'Turno reprogramado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al reprogramar el turno' });
    }
}

// EXPORTAR CONTROLADORES
module.exports = {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    cancelarTurno,
    obtenerTurnosPorPaciente,
    confirmarTurno,
    reprogramarTurno
};

const { validarNuevoTurno } = require('../validators/turnoValidators');

async function validarTurno(req, res, next) {
    try {
        const validacion = await validarNuevoTurno(req.body);
        if (validacion && validacion.valido === false) {
            return res.status(validacion.status).json({ error: validacion.error });
        }
        next();
    } catch (error) {
        console.error('Error en middleware validarTurno:', error);
        return res.status(500).json({ error: 'Error al validar los datos del turno' });
    }
}

module.exports = validarTurno;

const express = require('express');
const router = express.Router();
const turnocontroller = require('../controllers/turnocontroller');
const validarTurno = require('../middlewares/turnoValidator');
const verificarToken = require('../middlewares/authMiddlewares');
const autorizarRol = require('../middlewares/autorizarRol');

// 1. Verificar que el usuario tenga un token válido en todas las rutas
router.use(verificarToken);

// 2. Rutas GET protegidas según rol (1 = ADMIN, 2 = MEDICO, 3 = PACIENTE)
router.get('/paciente/:dni', autorizarRol(1, 3), turnocontroller.obtenerTurnosPorPaciente);
router.get('/', autorizarRol(1, 2), turnocontroller.obtenerTurnos);
router.get('/:id', autorizarRol(1, 2, 3), turnocontroller.obtenerTurnoPorId);

// 3. Ruta POST (Admin y Paciente pueden crear turnos)
router.post('/', autorizarRol(1, 3), validarTurno, turnocontroller.crearTurno);

// 4. Rutas PUT según permisos de cada rol
router.put('/cancelar/:id', autorizarRol(1, 2, 3), turnocontroller.cancelarTurno);
router.put('/confirmar/:id', autorizarRol(1, 2), turnocontroller.confirmarTurno);
router.put('/reprogramar/:id', autorizarRol(1, 3), turnocontroller.reprogramarTurno);

module.exports = router;
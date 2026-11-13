const express = require('express');
const router = express.Router();
const turnocontroller = require('../controllers/turnocontroller');
const validarTurno = require('../middlewares/turnoValidator');
const verificarToken = require('../middlewares/authMiddlewares');
const autorizarRol = require('../middlewares/autorizarRol');

// 1. Verificar que el usuario tenga un token JWT válido antes de acceder a cualquier ruta
router.use(verificarToken);

// 2. Rutas GET protegidas según perfil:
// - Paciente consulta su propio historial (verificado además en controlador por su DNI)
router.get('/paciente/:dni', autorizarRol(1, 3), turnocontroller.obtenerTurnosPorPaciente);
// - Admin y Médico obtienen la agenda general (Médico filtrado por sus prácticas)
router.get('/', autorizarRol(1, 2), turnocontroller.obtenerTurnos);
// - Consulta puntual de turno por ID
router.get('/:id', autorizarRol(1, 2, 3), turnocontroller.obtenerTurnoPorId);

// 3. Ruta POST para solicitar o registrar turnos (Admin y Paciente)
router.post('/', autorizarRol(1, 3), validarTurno, turnocontroller.crearTurno);

// 4. Rutas PUT para cambios de estado:
// - Cancelación permitida para todos los roles (Paciente solo turnos propios)
router.put('/cancelar/:id', autorizarRol(1, 2, 3), turnocontroller.cancelarTurno);
// - Confirmación exclusiva de Admin y Médicos autorizados
router.put('/confirmar/:id', autorizarRol(1, 2), turnocontroller.confirmarTurno);
// - Reprogramación de turnos (Mejora funcional)
router.put('/reprogramar/:id', autorizarRol(1, 3), turnocontroller.reprogramarTurno);

module.exports = router;
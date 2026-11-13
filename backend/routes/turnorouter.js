const express = require('express');
const router = express.Router();
const turnocontroller = require('../controllers/turnocontroller');
const validarTurno = require('../middlewares/turnoValidator');
const verificarToken = require('../middlewares/authMiddlewares');
const autorizarRol = require('../middlewares/autorizarRol');

// 1. Verificar que el usuario tenga un token válido
router.use(verificarToken);

// 2. Permitir solamente al ADMIN (Rol 1)
router.use(autorizarRol(1));

// Rutas GET 
router.get('/', turnocontroller.obtenerTurnos);
router.get('/:id', turnocontroller.obtenerTurnoPorId);
router.get('/paciente/:dni', turnocontroller.obtenerTurnosPorPaciente);

// Rutas POST 
router.post('/', validarTurno, turnocontroller.crearTurno);

// Rutas PUT 
router.put('/cancelar/:id', turnocontroller.cancelarTurno);
router.put('/confirmar/:id', turnocontroller.confirmarTurno);

module.exports = router;
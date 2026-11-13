const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const registroController = require('../controllers/registrocontroller');
const verificacionController = require('../controllers/verificacioncontroller');

router.post('/login', authController.login);
router.post('/registro/paciente', registroController.registrarPaciente);
router.post('/registro/medico', registroController.registrarMedico);
router.get(
    '/verificar-email',
    verificacionController.verificarEmail
);

module.exports = router;


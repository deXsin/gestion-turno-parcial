const selectTipo = document.getElementById('tipoUsuario');
const camposPaciente = document.getElementById('camposPaciente');
const camposMedico = document.getElementById('camposMedico');
const formRegistro = document.getElementById('formRegistro');
const mensaje = document.getElementById('mensaje');
const btnRegistro = document.getElementById('btnRegistro');

selectTipo.addEventListener('change', function () {
    const esMedico = selectTipo.value === 'medico';
    camposPaciente.style.display = esMedico ? 'none' : 'block';
    camposMedico.style.display = esMedico ? 'block' : 'none';
    mensaje.textContent = '';
});

formRegistro.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const tipo = selectTipo.value;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    mensaje.textContent = '';
    btnRegistro.disabled = true;
    btnRegistro.textContent = 'Registrando...';

    try {
        let respuesta;
        if (tipo === 'paciente') {
            respuesta = await registrarPaciente({
                dni_paciente: document.getElementById('dni_paciente').value,
                nombre_paciente: document.getElementById('nombre_paciente').value.trim(),
                apellido_paciente: document.getElementById('apellido_paciente').value.trim(),
                fec_nac_paciente: document.getElementById('fec_nac_paciente').value,
                email,
                password
            });
        } else {
            respuesta = await registrarMedico({
                matricula_medico: document.getElementById('matricula_medico').value,
                email,
                password
            });
        }

        mensaje.textContent = respuesta.mensaje || 'Registro exitoso. Revisá tu correo para verificar la cuenta.';
        mensaje.style.color = 'green';
        formRegistro.reset();
        camposPaciente.style.display = 'block';
        camposMedico.style.display = 'none';
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = 'red';
    } finally {
        btnRegistro.disabled = false;
        btnRegistro.textContent = 'Registrarme';
    }
});

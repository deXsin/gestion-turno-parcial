const formulario = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');
const boton = formulario.querySelector('button');


formulario.addEventListener('submit', async function (evento) {
    evento.preventDefault();


    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;


    mensaje.textContent = '';
    boton.disabled = true;
    boton.textContent = 'Ingresando...';


    try {
        const datos = await iniciarSesion(email, password);


        // Guardar el token y datos del usuario
        sessionStorage.setItem('token', datos.token);
        sessionStorage.setItem('usuario', JSON.stringify(datos.usuario));


        mensaje.textContent =
            `Bienvenida/o, ${datos.usuario.email}. Rol: ${datos.usuario.id_rol}`;


        mensaje.style.color = 'green';


        console.log('Login exitoso');
        console.log('Usuario:', datos.usuario);

        const rol = Number(datos.usuario.id_rol);
        if (rol === 1) {
            window.location.href = 'pages/dashboard.html';
        } else if (rol === 2) {
            window.location.href = 'pages/medico.html';
        } else {
            window.location.href = 'pages/paciente.html';
        }


    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = 'red';


    } finally {
        boton.disabled = false;
        boton.textContent = 'Iniciar sesión';
    }
});

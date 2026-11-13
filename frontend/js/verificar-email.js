const mensajeVerificacion = document.getElementById('mensajeVerificacion');

async function procesarVerificacion() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        mensajeVerificacion.textContent = 'No se encontró un token de verificación en el enlace.';
        mensajeVerificacion.style.color = 'red';
        return;
    }

    try {
        const datos = await verificarCorreo(token);
        mensajeVerificacion.textContent = datos.mensaje || 'Correo verificado correctamente. Ya podés iniciar sesión.';
        mensajeVerificacion.style.color = 'green';
    } catch (error) {
        mensajeVerificacion.textContent = error.message;
        mensajeVerificacion.style.color = 'red';
    }
}

procesarVerificacion();

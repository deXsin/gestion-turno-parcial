const nodemailer = require('nodemailer');


let transporter;


async function obtenerTransporter() {
    if (transporter) {
        return transporter;
    }

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        return transporter;
    }

    const cuenta = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: cuenta.user,
            pass: cuenta.pass
        }
    });

    return transporter;
}


async function enviarCorreo({ to, subject, text, html }) {
    const conexion = await obtenerTransporter();


    const info = await conexion.sendMail({
        from: '"Gestión de Turnos Médicos" <pruebas@gestion-turnos.test>',
        to,
        subject,
        text,
        html
    });


    const previewUrl = nodemailer.getTestMessageUrl(info);


    console.log('Correo enviado al servicio de pruebas.');
    console.log('Vista previa:', previewUrl);


    return {
        messageId: info.messageId,
        previewUrl
    };
}


module.exports = { enviarCorreo };

require('dotenv').config();
const http = require('http');
const bcrypt = require('bcryptjs');
const db = require('./config/database');
const app = require('./server');

async function prepararUsuariosPrueba() {
    // 1. Admin activo (Rol 1, activo = 1)
    const passAdmin = await bcrypt.hash('AdminTurnos2026!', 10);
    await db.execute(
        `INSERT INTO usuario (email, password_hash, id_rol, activo)
         VALUES (?, ?, 1, 1)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), id_rol = 1, activo = 1`,
        ['admin@turnos.com', passAdmin]
    );

    // 2. Médico activo (Rol 2, activo = 1)
    const passMedico = await bcrypt.hash('MedicoTurnos2026!', 10);
    await db.execute(
        `INSERT INTO usuario (email, password_hash, id_rol, activo)
         VALUES (?, ?, 2, 1)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), id_rol = 2, activo = 1`,
        ['medico@turnos.com', passMedico]
    );

    // 3. Usuario inactivo (Rol 1, activo = 0)
    const passInactivo = await bcrypt.hash('Inactivo2026!', 10);
    await db.execute(
        `INSERT INTO usuario (email, password_hash, id_rol, activo)
         VALUES (?, ?, 1, 0)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), id_rol = 1, activo = 0`,
        ['inactivo@turnos.com', passInactivo]
    );
}

async function ejecutarPruebas() {
    console.log('====================================');
    console.log(' INICIANDO BATERIA DE TEST 3');
    console.log('====================================\n');

    await prepararUsuariosPrueba();

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;

    let tokenAdmin = '';
    let tokenMedico = '';

    // Test 1: Login correcto
    try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@turnos.com', password: 'AdminTurnos2026!' })
        });
        const data = await res.json();
        tokenAdmin = data.token;
        console.log(`[TEST 1] Login correcto: ${res.status === 200 && tokenAdmin ? 'PASO (200 OK, token recibido)' : 'FALLO'}`);
    } catch (err) {
        console.error('[TEST 1] Error:', err.message);
    }

    // Obtener token médico para probar autorización de rol
    try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'medico@turnos.com', password: 'MedicoTurnos2026!' })
        });
        const data = await res.json();
        tokenMedico = data.token;
    } catch (err) {
        console.error('Error login médico:', err.message);
    }

    // Test 2: Contraseña incorrecta
    try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@turnos.com', password: 'ClaveEquivocada!' })
        });
        const data = await res.json();
        console.log(`[TEST 2] Contraseña incorrecta: ${res.status === 401 ? 'PASO (401 Credenciales incorrectas)' : 'FALLO'}`);
    } catch (err) {
        console.error('[TEST 2] Error:', err.message);
    }

    // Test 3: Usuario inactivo
    try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'inactivo@turnos.com', password: 'Inactivo2026!' })
        });
        const data = await res.json();
        console.log(`[TEST 3] Usuario inactivo: ${res.status === 401 ? 'PASO (401 Acceso denegado a usuario inactivo)' : 'FALLO'}`);
    } catch (err) {
        console.error('[TEST 3] Error:', err.message);
    }

    // Test 4: Petición sin token
    try {
        const res = await fetch(`${baseUrl}/api/turnos`);
        const data = await res.json();
        console.log(`[TEST 4] Petición sin token: ${res.status === 401 ? 'PASO (401 Se requiere token)' : 'FALLO'}`);
    } catch (err) {
        console.error('[TEST 4] Error:', err.message);
    }

    // Test 5: Token inválido o vencido
    try {
        const res = await fetch(`${baseUrl}/api/turnos`, {
            headers: { 'Authorization': 'Bearer tokenInvalido12345' }
        });
        const data = await res.json();
        console.log(`[TEST 5] Token inválido o vencido: ${res.status === 401 ? 'PASO (401 Token inválido o vencido)' : 'FALLO'}`);
    } catch (err) {
        console.error('[TEST 5] Error:', err.message);
    }

    // Test 6: Rol no autorizado (Médico Rol 2 intentando acceder a ruta solo ADMIN Rol 1)
    try {
        const res = await fetch(`${baseUrl}/api/turnos`, {
            headers: { 'Authorization': `Bearer ${tokenMedico}` }
        });
        const data = await res.json();
        console.log(`[TEST 6] Autorización por rol (Rol no autorizado): ${res.status === 403 ? 'PASO (403 No tenés permisos)' : 'FALLO'}`);
    } catch (err) {
        console.error('[TEST 6] Error:', err.message);
    }

    // Test 7: POST de turnos autenticado y con rol autorizado (ADMIN)
    try {
        const nuevoTurno = {
            fecha_turno: '2026-11-20',
            hora_turno: '10:00',
            medio_solicitado: 'telefono',
            dni_paciente: 30102929,
            id_practica: 1,
            id_equipo: 1,
            id_disponibilidad: 1
        };

        const res = await fetch(`${baseUrl}/api/turnos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify(nuevoTurno)
        });
        const data = await res.json();
        console.log(`[TEST 7] POST de turno autenticado (ADMIN): ${res.status === 201 ? `PASO (201 Creado, ID: ${data.id_turno})` : 'FALLO: ' + JSON.stringify(data)}`);
    } catch (err) {
        console.error('[TEST 7] Error:', err.message);
    }

    console.log('\n====================================');
    console.log(' PRUEBAS FINALIZADAS');
    console.log('====================================');

    server.close();
    await db.end();
}

ejecutarPruebas();

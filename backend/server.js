require('dotenv').config();
const express = require('express');
const turnoroutes = require('./routes/turnorouter');
const authRoutes = require('./routes/authrouter');
const app = express();
const cors = require('cors');

app.use(cors()); 
app.use(express.json());
app.use('/api/turnos', turnoroutes);
console.log('Rutas de turnos cargadas correctamente');


app.use('/api/auth', authRoutes);
console.log('Rutas de autenticación cargadas correctamente');
const PORT = 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
}

module.exports = app;

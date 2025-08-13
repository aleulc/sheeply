require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:3001',
  'http://localhost:3000',
  'http://sheeply.online',
  'http://www.sheeply.online'
];

// 1. Middlewares básicos
/*app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());*/

app.use(cors({
  origin: function(origin, callback) {
    // allow requests like curl/postman with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS: Origin not allowed'), false);
    }
  },
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// 2. Importar rutas
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const prestamoRoutes = require('./routes/prestamo');
const clienteRoutes = require('./routes/cliente');

// 4. Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/clientes', clienteRoutes);

// 5. Ruta raíz
app.get('/', (req, res) => {
  res.send('API de Préstamos Personales');
});

// 8. Manejo de rutas no encontradas (DEBE IR AL FINAL)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// 9. Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
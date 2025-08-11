require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares básicos
app.use(cors({
  origin: 'http://localhost:3000', // Asegurar que coincide con tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

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
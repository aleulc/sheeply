const mysql = require('mysql2/promise'); 
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a MySQL');
    connection.release();
  } catch (err) {
    console.error('Error de conexión a MySQL:', err);
  }
};

testConnection();  // Llama a la función de prueba

module.exports = pool;  // Exporta directamente el pool 

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Obtener todos los clientes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [clientes] = await db.query(`
      SELECT id, nombre, apellidos, telefono 
      FROM clientes
      ORDER BY nombre, apellidos
    `);
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
});

// Crear nuevo cliente
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, apellidos, telefono, direccion } = req.body;
    
    // Validación básica
    if (!nombre || !apellidos) {
      return res.status(400).json({ message: 'Nombre y apellidos son obligatorios' });
    }
    
    const [result] = await db.query(
      `INSERT INTO clientes 
        (nombre, apellidos, telefono, direccion) 
        VALUES (?, ?, ?, ?)`,
      [nombre, apellidos || null, telefono || null, direccion || null]
    );
    
    res.status(201).json({
      id: result.insertId,
      nombre,
      apellidos,
      telefono
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
});

module.exports = router;
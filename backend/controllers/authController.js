const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validar datos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario existe
    const [existingUser] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }


    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Generar JWT
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const [users] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [users] = await db.query(
      'SELECT id, nombre, email FROM usuarios WHERE id = ?', 
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = { register, login, verifyToken };
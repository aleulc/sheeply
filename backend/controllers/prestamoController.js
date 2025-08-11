const db = require('../config/db');

// Obtener todos los préstamos con paginación y filtros
const getPrestamos = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        p.id, 
        p.monto, 
        p.monto_pendiente,
        p.recargo, 
        p.plazo, 
        p.fecha_inicio, 
        p.proximo_vencimiento,
        p.estado,
        p.activo,
        c.id AS cliente_id,
        c.nombre,
        c.apellidos
      FROM prestamos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.activo = 1
    `;
    
    const params = [];
    
    // Filtro por estado
    if (estado) {
      query += ' AND p.estado = ?';
      params.push(estado);
    }
    
    // Búsqueda por nombre o ID
    if (search) {
      query += ' AND (c.nombre LIKE ? OR c.apellidos LIKE ? OR p.id = ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, parseInt(search) || 0);
    }
    
    // Conteo total para paginación
    const [countResults] = await db.query(
      `SELECT COUNT(*) AS total ${query.substring(query.indexOf('FROM'))}`,
      params
    );
    
    const totalItems = countResults[0].total;
    const totalPages = Math.ceil(totalItems / limit);
    
    // Agregar paginación
    query += ' ORDER BY p.fecha_inicio DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [results] = await db.query(query, params);
    
    res.json({
      prestamos: results,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener préstamos' });
  }
};

// Obtener un préstamo por ID
const getPrestamoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT 
        p.*,
        c.nombre,
        c.apellidos,
        c.telefono,
        c.direccion,
        a.nombre    AS aval_nombre,
        a.apellidos AS aval_apellidos,
        a.telefono  AS aval_telefono,
        a.direccion AS aval_direccion
      FROM prestamos p
      JOIN clientes c ON p.cliente_id = c.id
      LEFT JOIN aval a ON p.id = a.prestamo_id
      WHERE p.id = ?
       AND p.activo = 1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    const p = rows[0];

    // Reconstruimos el objeto con anidación para el aval
    const prestamo = {
      id:               p.id,
      cliente_id:       p.cliente_id,
      monto:            p.monto,
      monto_pendiente:  p.monto_pendiente,
      recargo:          p.recargo,  // CAMBIO: interes -> recargo
      plazo:            p.plazo,
      fecha_inicio:     p.fecha_inicio,
      proximo_vencimiento: p.proximo_vencimiento,
      estado:           p.estado,
      
      // Datos del cliente
      nombre:           p.nombre,
      apellidos:        p.apellidos,
      telefono:         p.telefono,
      direccion:        p.direccion,

      // Booleano para frontend
      requiere_aval:    Boolean(p.aval_nombre),

      // Anidamos aquí el aval
      aval: p.aval_nombre
        ? {
            nombre_a:     p.aval_nombre,
            apellidos_a:  p.aval_apellidos,
            telefono_a:   p.aval_telefono,
            direccion_a:  p.aval_direccion
          }
        : null
    };

    res.json(prestamo);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el préstamo' });
  }
};

// Obtener plan de pagos de un préstamo
const getPlanPagos = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [cuotas] = await db.query(`
      SELECT 
        id,
        numero_cuota,
        fecha_pago,
        monto_capital,
        monto_interes,  
        monto_total,
        estado,
        fecha_pago
      FROM pagos
      WHERE prestamo_id = ?
      ORDER BY numero_cuota ASC
    `, [id]);
    
    res.json(cuotas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el plan de pagos' });
  }
};

// Registrar un pago
const registrarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { cuota_id, monto, fecha_pago } = req.body;
    
    // Validar datos
    if (!cuota_id || !monto || !fecha_pago) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
    
    // Verificar cuota
    const [cuota] = await db.query(`
      SELECT * 
      FROM pagos 
      WHERE id = ? 
        AND prestamo_id = ?
    `, [cuota_id, id]);
    
    if (cuota.length === 0) {
      return res.status(404).json({ message: 'Cuota no encontrada' });
    }
    
    if (cuota[0].estado === 'Pagado') {
      return res.status(400).json({ message: 'La cuota ya está pagada' });
    }
    
    // Registrar pago
    await db.query(`
      UPDATE pagos
      SET 
        estado = 'Pagado',
        fecha_pago = ?,
        monto_pagado = ?
      WHERE id = ?
    `, [fecha_pago, monto, cuota_id]);
    
    // Actualizar monto pendiente en préstamo
    await db.query(`
      UPDATE prestamos
      SET monto_pendiente = monto_pendiente - ?
      WHERE id = ?
    `, [monto, id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el pago' });
  }
};

// Crear nuevo préstamo (NUEVA FUNCIÓN)
const createPrestamo = async (req, res) => {
  try {
    const { cliente_id, monto, recargo, plazo, fecha_inicio, aval } = req.body;
    
    // Validar datos
    if (!cliente_id || !monto || !recargo || !plazo || !fecha_inicio) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
    
    // Calcular valores
    const recargoDecimal = recargo / 100;
    const montoTotal = monto * (1 + recargoDecimal);
    const montoCuota = montoTotal / plazo;
    
    // Iniciar transacción
    await db.query('START TRANSACTION');
    
    // Insertar préstamo
 
    const [prestamoResult] = await db.query(
      `INSERT INTO prestamos 
      (cliente_id, monto, recargo, plazo, fecha_inicio, monto_pendiente, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_id, 
        monto, 
        recargo, 
        plazo, 
        fecha_inicio, 
        montoTotal, 
        'Pendiente'  // Estado como parámetro
      ]
    );
    
    const prestamoId = prestamoResult.insertId;
    
    // Insertar aval si existe
    if (aval && (aval.nombre_a || aval.apellidos_a)) {
      await db.query(
        `INSERT INTO aval 
        (prestamo_id, nombre, apellidos, telefono, direccion) 
        VALUES (?, ?, ?, ?, ?)`,
        [prestamoId, aval.nombre_a, aval.apellidos_a, aval.telefono_a, aval.direccion_a]
      );
    }
    
    // Generar plan de pagos (cuotas semanales)
    const pagos = [];
    const fechaPago = new Date(fecha_inicio);
    
    for (let i = 1; i <= plazo; i++) {
      fechaPago.setDate(fechaPago.getDate() + 7); // Sumar 7 días por semana
      
  pagos.push([
    prestamoId,            // prestamo_id
    i,                     // numero_cuota
    montoCuota,            // monto_total (valor correcto aquí)
    fechaPago.toISOString().split('T')[0], // fecha_pago
    'Pendiente'            // estado
  ]);
}
    
    // Insertar todas las cuotas
await db.query(
  `INSERT INTO pagos 
  (prestamo_id, numero_cuota, monto_total, fecha_pago, estado)
  VALUES ?`,  
  [pagos]
);
    
    await db.query('COMMIT');
    res.status(201).json({ id: prestamoId, message: 'Préstamo creado exitosamente' });
    
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al crear préstamo' });
  }
};

const deletePrestamo = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query(
      'UPDATE prestamos SET activo = 0 WHERE id = ?',
      [id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el préstamo' });
  }
};

module.exports = {
  getPrestamos,
  getPrestamoById,
  getPlanPagos,
  registrarPago,
  createPrestamo,
  deletePrestamo
};
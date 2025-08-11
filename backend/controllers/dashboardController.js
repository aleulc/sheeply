const db = require('../config/db');

// Obtener datos para el dashboard
const getDashboardData = async (req, res) => {
  try {

    // Obtener préstamos activos
    const [prestamosActivos] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM prestamos 
      WHERE estado = 'Pendiente'
        AND monto_pendiente > 0
         AND activo = 1
    `);

    // Obtener clientes sin pagar
    const [clientesNoPago] = await db.query(`
      SELECT COUNT(DISTINCT p.cliente_id) AS total
      FROM pagos pa
      JOIN prestamos p ON pa.prestamo_id = p.id
      WHERE pa.estado = 'Vencido'
        AND p.estado = 'Pendiente'
         AND activo = 1
    `);

    // Obtener monto total pendiente
    const [montoPendiente] = await db.query(`
      SELECT COALESCE(SUM(monto_pendiente), 0) AS total
      FROM prestamos
      WHERE estado = 'Pendiente'
       AND activo = 1
    `);

    // Obtener próximos vencimientos
    const [proximosVencimientos] = await db.query(`
  SELECT 
    p.id AS prestamo_id,
    c.nombre,
    c.apellidos,
    p.monto_pendiente,
    MIN(pg.fecha_pago) AS proximo_vencimiento,  
    DATEDIFF(MIN(pg.fecha_pago), CURDATE()) AS dias_restantes
  FROM prestamos p
  JOIN clientes c ON p.cliente_id = c.id
  JOIN pagos pg ON p.id = pg.prestamo_id
  WHERE p.estado = 'Pendiente'                   
    AND p.monto_pendiente > 0
    AND pg.estado = 'Pendiente'               
    AND pg.fecha_pago BETWEEN CURDATE() AND CURDATE() + INTERVAL 7 DAY
    AND activo = 1
  GROUP BY p.id, c.nombre, c.apellidos, p.monto_pendiente
  ORDER BY proximo_vencimiento ASC
  LIMIT 10
`);

    res.json({
      prestamosActivos: prestamosActivos[0].total,
      clientesNoPago: clientesNoPago[0].total,
      montoPendiente: montoPendiente[0].total,
      proximosVencimientos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener datos del dashboard' });
  }
};

module.exports = {
  getDashboardData
};
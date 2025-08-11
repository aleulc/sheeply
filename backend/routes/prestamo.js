const express = require('express');
const router = express.Router();
const db = require('../config/db');
const prestamoController = require('../controllers/prestamoController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, prestamoController.getPrestamos);
router.get('/:id', authMiddleware, prestamoController.getPrestamoById);
router.get('/:id/plan-pagos', authMiddleware, prestamoController.getPlanPagos);
router.post('/:id/pagar', authMiddleware, prestamoController.registrarPago);
router.post('/', authMiddleware, prestamoController.createPrestamo);
router.delete('/:id', authMiddleware, prestamoController.deletePrestamo);

module.exports = router;
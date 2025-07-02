const express = require('express');
const router = express.Router();

// Controlador de facturas
const invoiceController = require('../controllers/invoiceController');

// Middleware de autenticación
const { ensureAuthenticated } = require('../middleware/auth');

// Ruta para listar todas las facturas
router.get('/', ensureAuthenticated, invoiceController.list);

// Ruta para mostrar el formulario de agregar factura
router.get('/add', ensureAuthenticated, invoiceController.add);

// Ruta para crear una nueva factura
router.post('/add', ensureAuthenticated, invoiceController.create);

// Ruta para mostrar los detalles de una factura específica
router.get('/:id', ensureAuthenticated, invoiceController.show);

// Ruta para mostrar el formulario de pago de una factura
router.get('/:id/pay', ensureAuthenticated, invoiceController.showPayInvoice);

// Ruta para procesar el pago de una factura (método POST)
router.post('/:id/process-payment', ensureAuthenticated, invoiceController.processPayment);

// Exportamos el router
module.exports = router;
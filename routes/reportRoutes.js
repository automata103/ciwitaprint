// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/sales', reportController.sales);
router.get('/products', reportController.products);
router.get('/clients', reportController.clients);
router.get('/export-sales-pdf', reportController.exportSalesPDF);
router.get('/export-sales-excel', reportController.exportSalesExcel);

module.exports = router;

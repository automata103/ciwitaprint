const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/pagar', paymentController.createPayment);

module.exports = router;
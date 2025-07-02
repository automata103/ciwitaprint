// routes/cierres.js
const express = require('express');
const router = express.Router();
const cierreCajaController = require('../controllers/cierreCajaController');


router.post('/cierres', cierreCajaController.createCierre);
router.get('/cierres', cierreCajaController.listarCierres);
router.get('/cierres/nuevo', cierreCajaController.mostrarFormularioCrear);


// Puedes agregar rutas para listar, editar, eliminar según lo necesites

module.exports = router;

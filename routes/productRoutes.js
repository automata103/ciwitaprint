// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, productController.list);
router.get('/add', ensureAuthenticated, productController.add);
router.post('/add', ensureAuthenticated, productController.create);
router.get('/edit/:id', ensureAuthenticated, productController.edit);
router.post('/edit/:id', ensureAuthenticated, productController.update);
router.get('/delete/:id', ensureAuthenticated, productController.delete);

module.exports = router;

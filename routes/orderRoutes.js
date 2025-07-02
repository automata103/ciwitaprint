// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, orderController.list);
router.get('/add', ensureAuthenticated, orderController.add);
router.post('/add', ensureAuthenticated, orderController.create);
router.get('/:id', ensureAuthenticated, orderController.show);

module.exports = router;

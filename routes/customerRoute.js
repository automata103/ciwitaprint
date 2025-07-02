// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, customerController.list);
router.get('/add', ensureAuthenticated, customerController.add);
router.post('/add', ensureAuthenticated, customerController.create);
router.get('/edit/:id', ensureAuthenticated, customerController.edit);
router.post('/edit/:id', ensureAuthenticated, customerController.update);
router.get('/delete/:id', ensureAuthenticated, customerController.delete);

module.exports = router;

// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/dashboard', ensureAuthenticated, dashboardController.index);

module.exports = router;
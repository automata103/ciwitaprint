// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const configController = require('../controllers/configController');

router.get('/users', userController.list);
router.get('/users/add', userController.add);
router.post('/users/add', userController.create);
router.get('/users/edit/:id', userController.edit);
router.post('/users/edit/:id', userController.update);
router.get('/users/delete/:id', userController.delete);

router.get('/config/edit', configController.edit);
router.post('/config/edit', configController.update);

module.exports = router;

// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  showLoginForm: (req, res) => {
    try {
      const alerts = req.session.alerts || [];
      req.session.alerts = [];
      res.render('auth/login', { 
        layout: false,
        alerts
      });
    } catch (error) {
      console.error('Error showing login form:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        req.session.alerts = [{
          type: 'error',
          message: 'Usuario y contraseña son requeridos',
          title: 'Error de validación'
        }];
        return res.redirect('/login');
      }

      const user = await User.findOne({ where: { username } });
      
      if (!user) {
        console.log('Usuario no encontrado:', username);
        req.session.alerts = [{
          type: 'error',
          message: 'Credenciales incorrectas',
          title: 'Error de autenticación'
        }];
        return res.redirect('/login');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        console.log('Contraseña incorrecta para:', username);
        req.session.alerts = [{
          type: 'error',
          message: 'Credenciales incorrectas',
          title: 'Error de autenticación'
        }];
        return res.redirect('/login');
      }

      // Establecer sesión de usuario
      req.session.user = {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        role: user.role
      };

      // Redirigir al dashboard con mensaje de éxito
      req.session.alerts = [{
        type: 'success',
        message: `Bienvenido ${user.nombre_completo}`,
        title: 'Inicio exitoso'
      }];
      return res.redirect('/dashboard');

    } catch (error) {
      console.error('Error durante el login:', error);
      req.session.alerts = [{
        type: 'error',
        message: 'Ocurrió un error al iniciar sesión',
        title: 'Error del servidor'
      }];
      return res.redirect('/login');
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.redirect('/dashboard');
      }
      res.redirect('/login');
    });
  }
};
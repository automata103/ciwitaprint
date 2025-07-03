// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  showLoginForm: (req, res) => {
    // Pasar las alertas a la vista aunque no use layout
    const alerts = req.session.alerts || [];
    req.session.alerts = [];
    
    res.render('auth/login', { 
      layout: false,
      alerts
    });
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user) {
        console.log('Usuario no encontrado para el username:', username);
        req.session.alerts = [{
          type: 'error',
          message: 'Nombre de usuario o contraseña incorrectos',
          title: 'Error de autenticación',
          icon: 'person-x-fill'
        }];
        return res.redirect('/login');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log('Contraseña incorrecta para el usuario:', username);
        req.session.alerts = [{
          type: 'error',
          message: 'Nombre de usuario o contraseña incorrectos',
          title: 'Error de autenticación',
          icon: 'key-fill'
        }];
        return res.redirect('/login');
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        role: user.role
      };

      // Redirigir al dashboard con alerta de éxito
      req.session.alerts = [{
        type: 'success',
        message: `Bienvenido ${user.nombre_completo}`,
        title: 'Inicio de sesión exitoso',
        icon: 'person-check-fill',
        timeout: 3000
      }];
      return res.redirect('/dashboard');
    } catch (error) {
      console.error('Error en el controlador de login:', error);
      req.session.alerts = [{
        type: 'error',
        message: 'Error al iniciar sesión',
        title: 'Error del sistema',
        icon: 'bug-fill'
      }];
      return res.redirect('/login');
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        req.session.alerts = [{
          type: 'error',
          message: 'Error al cerrar sesión',
          title: 'Error del sistema'
        }];
        return res.redirect('/dashboard');
      }
      // Crear nueva sesión solo para la alerta
      req.session.alerts = [{
        type: 'info',
        message: 'Has cerrado sesión correctamente',
        title: 'Sesión finalizada'
      }];
      return res.redirect('/login');
    });
  }
};
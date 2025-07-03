const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  showLoginForm: (req, res) => {
    try {
      // Obtener alertas de la sesión
      const alerts = req.session.alerts || [];
      req.session.alerts = [];
      
      res.render('auth/login', { 
        layout: false,
        alerts,
        currentPath: '/login'
      });
    } catch (error) {
      console.error('Error al mostrar formulario de login:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validación básica
      if (!username || !password) {
        req.session.alerts = [{
          type: 'error',
          message: 'Usuario y contraseña son requeridos',
          title: 'Error de validación'
        }];
        return res.redirect('/login');
      }

      // Buscar usuario
      const user = await User.findOne({ where: { username } });
      
      if (!user) {
        req.session.alerts = [{
          type: 'error',
          message: 'Credenciales incorrectas',
          title: 'Error de autenticación'
        }];
        return res.redirect('/login');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        req.session.alerts = [{
          type: 'error',
          message: 'Credenciales incorrectas',
          title: 'Error de autenticación'
        }];
        return res.redirect('/login');
      }

      // Crear sesión
      req.session.user = {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        role: user.role
      };

      // Redirigir con mensaje de éxito
      req.session.alerts = [{
        type: 'success',
        message: `Bienvenido ${user.nombre_completo}`,
        title: 'Inicio de sesión exitoso'
      }];
      return res.redirect('/dashboard');

    } catch (error) {
      console.error('Error en el proceso de login:', error);
      req.session.alerts = [{
        type: 'error',
        message: 'Error interno al iniciar sesión',
        title: 'Error del servidor'
      }];
      return res.redirect('/login');
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.redirect('/dashboard');
      }
      res.redirect('/login');
    });
  }
};
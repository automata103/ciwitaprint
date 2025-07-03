// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  showLoginForm: (req, res) => {
    res.render('auth/login', { layout: false });
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user) {
        console.log('Usuario no encontrado para el username:', username);
        res.alertSwette('error', 'Nombre de usuario o contraseña incorrectos', 'Error de autenticación');
        return res.redirect('/login');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log('Contraseña incorrecta para el usuario:', username);
        res.alertSwette('error', 'Nombre de usuario o contraseña incorrectos', 'Error de autenticación');
        return res.redirect('/login');
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        role: user.role
      };

      res.alertSwette('success', `Bienvenido ${user.nombre_completo}`, 'Inicio de sesión exitoso');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error en el controlador de login:', error);
      res.alertSwette('error', 'Error al iniciar sesión', 'Error del sistema');
      res.redirect('/login');
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        res.alertSwette('error', 'Error al cerrar sesión', 'Error del sistema');
        return res.redirect('/dashboard');
      }
      res.alertSwette('info', 'Has cerrado sesión correctamente', 'Sesión finalizada');
      res.redirect('/login');
    });
  }
};
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
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log('Contraseña incorrecta para el usuario:', username);
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
      }

   // En tu controlador de login
      req.session.user = {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        role: user.role
      };

      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error en el controlador de login:', error);
      res.status(500).send('Error al iniciar sesión');
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect('/login');
    });
  }
};

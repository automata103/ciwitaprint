// createUser.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const User = require('./models/User');

async function crearUsuario({ username, nombre_completo, password, role }) {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa');

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const usuario = await User.create({
      username,
      nombre_completo,
      password: hashedPassword,
      role
    });

    console.log('Usuario creado:', usuario.toJSON());
  } catch (error) {
    console.error('Error al crear usuario:', error);
  } finally {
    await sequelize.close();
  }
}

// Cambia estos datos para crear tu usuario nuevo
crearUsuario({
  username: 'yrodriguez',
  nombre_completo: 'Soporte Tecnico',
  password: 'Stream2011@',
  role: 'administrador' // o el rol que quieras
});

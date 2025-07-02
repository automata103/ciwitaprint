const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,         // Nombre de la base de datos
  process.env.DB_USER,         // Usuario
  process.env.DB_PASSWORD,     // Contraseña
  {
    host: process.env.DB_HOST, // Host (localhost o URL de Render)
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false
  }
);

// Prueba la conexión
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos PostgreSQL establecida correctamente.');
  })
  .catch(err => {
    console.error('❌ No se puede conectar a la base de datos:', err);
  });

module.exports = sequelize;

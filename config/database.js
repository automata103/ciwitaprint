const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,          // Nombre de la base de datos
  process.env.DB_USER,          // Usuario
  process.env.DB_PASSWORD,      // Contraseña
  {
    host: process.env.DB_HOST,  // Host (Render URL o localhost)
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Necesario para Render si no tiene CA pública
      }
    }
  }
);

// Prueba la conexión al iniciar
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión establecida con PostgreSQL (Render).');
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });

module.exports = sequelize;
// Exporta la instancia de Sequelize para usarla en otros módulos
// Puedes importar este archivo en tus modelos y controladores para interactuar con la base de datos
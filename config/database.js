const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === 'true',
        rejectUnauthorized: false
      }
    }
  }
);

// Intento de conexión con reintentos (5 intentos)
const connectWithRetry = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión establecida con PostgreSQL.');
      break;
    } catch (err) {
      console.error(`❌ Error al conectar (intento ${i + 1}): ${err.message}`);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        process.exit(1);
      }
    }
  }
};

connectWithRetry();

module.exports = sequelize;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Campos de empresa
  empresa_nombre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rcn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  empresa_telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  empresa_correo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  empresa_direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Campos de contacto
  contacto_nombre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contacto_telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contacto_cargo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contacto_correo: {
    type: DataTypes.STRING,
    allowNull: true
  },

  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  tableName: 'customers',
  timestamps: true
});

module.exports = Customer;

// models/CierreCaja.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const CierreCaja = sequelize.define('CierreCaja', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total_ingresos: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_gastos: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  saldo_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'cierres_caja',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false
});

// Definir relación: cada CierreCaja pertenece a un User
CierreCaja.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = CierreCaja;

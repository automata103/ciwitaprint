// models/PagoFactura.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PagoFactura = sequelize.define('PagoFactura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'pagos_factura',
  timestamps: false
});

module.exports = PagoFactura;

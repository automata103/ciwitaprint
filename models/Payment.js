// models/Payment.js
//modes
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'invoice_id'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'paymentmethod'
  },
  bankAccount: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'bankaccount'
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,                  // Habilita createdAt y updatedAt
  createdAt: 'created_at',           // Mapea correctamente a la columna real
  updatedAt: 'updated_at'            // Idem
});

module.exports = Payment;

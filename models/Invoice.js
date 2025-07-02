const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customer_id'
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  itbis: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  labor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fiscalreceipt: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  fiscalnumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente'
  },
  ispaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentdate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paymentdate'
  },
  paymentmethod: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'paymentmethod'
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Invoice;

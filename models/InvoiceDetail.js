// models/InvoiceDetail.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvoiceDetail = sequelize.define('InvoiceDetail', {
invoiceId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: 'invoiceid'  // nombre real en la base de datos
},
productId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: 'productid'
},

  quantity: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(10, 2)
}, {
  tableName: 'invoice_details',
  timestamps: false
});


module.exports = InvoiceDetail;

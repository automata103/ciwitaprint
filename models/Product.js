// models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  size: DataTypes.STRING,
  price: DataTypes.DECIMAL(10, 2),
  stock: DataTypes.INTEGER,
  category: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;

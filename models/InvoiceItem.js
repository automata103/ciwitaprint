// models/InvoiceItem.js
module.exports = (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define('InvoiceItem', {
    invoiceId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL
  });

  InvoiceItem.associate = models => {
    InvoiceItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return InvoiceItem;
};

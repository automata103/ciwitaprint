const Customer = require('./Customer');
const Product = require('./Product');
const Invoice = require('./Invoice');
const InvoiceDetail = require('./InvoiceDetail');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const AccountsReceivable = require('./AccountsReceivable');
const PagoFactura = require('./PagoFactura');
const Payment = require('./Payment');

// 📦 Relaciones de Customer
Customer.hasMany(Invoice, { foreignKey: 'customer_id', as: 'invoices' });
Invoice.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(Order, { foreignKey: 'customerid', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customerid', as: 'customer' });

Customer.hasMany(AccountsReceivable, { foreignKey: 'customerid', as: 'accountsReceivable' });
AccountsReceivable.belongsTo(Customer, { foreignKey: 'customerid', as: 'customer' });

// 🧾 Invoice y AccountsReceivable
Invoice.hasOne(AccountsReceivable, { foreignKey: 'invoiceId', as: 'account' });
AccountsReceivable.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

// 🧾 Invoice y sus detalles
Invoice.hasMany(InvoiceDetail, { foreignKey: 'invoiceId', as: 'details' });
InvoiceDetail.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

// 🧾 Invoice y pagos (Payment y PagoFactura)
Invoice.hasMany(PagoFactura, { foreignKey: 'invoiceId', as: 'pagos' });
PagoFactura.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

// 🧾 Product con detalles de factura y orden
Product.hasMany(InvoiceDetail, { foreignKey: 'productid', as: 'invoiceDetails' });
InvoiceDetail.belongsTo(Product, { foreignKey: 'productid', as: 'product' });

Product.hasMany(OrderDetail, { foreignKey: 'productid', as: 'orderDetails' });
OrderDetail.belongsTo(Product, { foreignKey: 'productid', as: 'product' });

// 📝 Order y sus detalles
Order.hasMany(OrderDetail, { foreignKey: 'order_id', as: 'details' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = {
  Customer,
  Product,
  Invoice,
  InvoiceDetail,
  Order,
  OrderDetail,
  AccountsReceivable,
  PagoFactura,
  Payment
};

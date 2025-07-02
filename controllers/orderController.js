// controllers/orderController.js
// controllers/orderController.js
const { Order, Customer, Product, OrderDetail } = require('../models');


module.exports = {
  list: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [{
          model: Customer,
          as: 'customer',
          attributes: ['name'] // Solo incluir el nombre del cliente
        }]
      });
      res.render('orders/list', { orders });
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).send('Error al obtener pedidos: ' + error.message);
    }
  },

  add: async (req, res) => {
    try {
      const customers = await Customer.findAll();
      const products = await Product.findAll();
      res.render('orders/add', { customers, products });
    } catch (error) {
      console.error('Error al cargar formulario de pedido:', error);
      res.status(500).send('Error al cargar formulario de pedido: ' + error.message);
    }
  },

  create: async (req, res) => {
    try {
      const { customerId, products, comments } = req.body;

      // Validar que los productos sean un array y que no esté vacío
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).send('No se proporcionaron productos válidos');
      }

      // Crear el pedido
      const order = await Order.create({
        customerId,
        comments,
        date: new Date()
      });

      // Crear los detalles del pedido
      for (const product of products) {
        await OrderDetail.create({
          orderId: order.id,
          productId: product.id,
          quantity: product.quantity,
          price: product.price
        });
      }

      res.redirect('/orders');
    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).send('Error al crear pedido: ' + error.message);
    }
  },

  show: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          Customer,
          {
            model: OrderDetail,
            include: [Product]
          }
        ]
      });

      if (!order) {
        return res.status(404).send('Pedido no encontrado');
      }

      res.render('orders/show', { order });
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      res.status(500).send('Error al obtener pedido: ' + error.message);
    }
  }
};

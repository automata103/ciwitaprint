// controllers/productController.js
const  Product  = require('../models/Product');

module.exports = {
  list: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.render('products/list', { products });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).send('Error al obtener productos');
    }
  },

  add: (req, res) => {
    res.render('products/add');
  },

  create: async (req, res) => {
    try {
      await Product.create(req.body);
      res.redirect('/products');
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).send('Error al crear producto');
    }
  },

  edit: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).send('Producto no encontrado');
      }
      res.render('products/edit', { product });
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).send('Error al obtener producto');
    }
  },

  update: async (req, res) => {
    try {
      await Product.update(req.body, { where: { id: req.params.id } });
      res.redirect('/products');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).send('Error al actualizar producto');
    }
  },

  delete: async (req, res) => {
    try {
      await Product.destroy({ where: { id: req.params.id } });
      res.redirect('/products');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).send('Error al eliminar producto');
    }
  }
};

// controllers/customerController.js
const  Customer  = require('../models/Customer');

module.exports = {
  list: async (req, res) => {
    try {
      const customers = await Customer.findAll(); // Asegúrate de que Customer esté definido
      res.render('customers/list', { customers });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener clientes');
    }
  },
  add: (req, res) => {
    res.render('customers/add');
  },

  create: async (req, res) => {
    try {
      await Customer.create(req.body);
      res.redirect('/customers');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear cliente');
    }
  },
  edit: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        return res.status(404).send('Cliente no encontrado');
      }
      res.render('customers/edit', { customer }); // Asegúrate de que la ruta sea correcta
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener cliente');
    }
  },

  update: async (req, res) => {
    try {
      await Customer.update(req.body, { where: { id: req.params.id } });
      res.redirect('/customers');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar cliente');
    }
  },
  delete: async (req, res) => {
    try {
      await Customer.destroy({ where: { id: req.params.id } });
      res.redirect('/customers');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar cliente');
    }
  }
};

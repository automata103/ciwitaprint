const { Invoice, InvoiceDetail, Customer, Product, Payment, AccountsReceivable } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  // Listar todas las facturas
  list: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        include: [{ model: Customer, as: 'customer' }],
        order: [['date', 'DESC']]
      });
      res.render('invoices/list', { 
        invoices, 
        layout: 'layout',
        title: 'Facturas | CiwitaPrint',
        currentPath: '/invoices'
      });
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      res.status(500).send('Error al obtener facturas: ' + error.message);
    }
  },

  // Mostrar formulario para nueva factura
  add: async (req, res) => {
    try {
      const customers = await Customer.findAll();
      const products = await Product.findAll();
      res.render('invoices/add', { 
        customers, 
        products,
        title: 'Nueva Factura | CiwitaPrint',
        currentPath: '/invoices/add'
      });
    } catch (error) {
      console.error('Error al cargar formulario de factura:', error);
      res.status(500).send('Error al cargar formulario de factura: ' + error.message);
    }
  },

  // Crear una nueva factura
  create: async (req, res) => {
    try {
      const { customerId, products, subtotal, discount, labor, comments, fiscalReceipt } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).send('No se proporcionaron productos válidos');
      }

      const numericSubtotal = parseFloat(subtotal || 0);
      const numericDiscount = parseFloat(discount || 0);
      const numericLabor = parseFloat(labor || 0);
      const itbis = parseFloat((numericSubtotal * 0.18).toFixed(2));
      const total = parseFloat((numericSubtotal + numericLabor - numericDiscount + itbis).toFixed(2));

      let fiscalNumber = null;
      if (fiscalReceipt === 'true') {
        const lastInvoice = await Invoice.findOne({
          where: { fiscalNumber: { [Op.ne]: null } },
          order: [['fiscalNumber', 'DESC']]
        });

        let lastFiscalNumber = 0;
        if (lastInvoice && lastInvoice.fiscalNumber) {
          const lastNumber = lastInvoice.fiscalNumber.substring(2);
          lastFiscalNumber = parseInt(lastNumber, 10);
        }
        fiscalNumber = `EB0${(lastFiscalNumber + 1).toString().padStart(10, '0')}`;
      }

      const invoice = await Invoice.create({
        customerId,
        subtotal: numericSubtotal,
        itbis,
        discount: numericDiscount,
        labor: numericLabor,
        total,
        comments,
        fiscalReceipt: fiscalReceipt === 'true',
        fiscalNumber,
        date: new Date(),
        status: 'Pendiente',
        isPaid: false
      });

      for (const product of products) {
        await InvoiceDetail.create({
          invoiceId: invoice.id,
          productId: product.id,
          quantity: product.quantity,
          price: product.price
        });
      }

      res.redirect('/invoices');
    } catch (error) {
      console.error('Error al crear factura:', error);
      res.status(500).send('Error al crear factura: ' + error.message);
    }
  },

  // Mostrar detalles de una factura
 // Mostrar detalles de una factura
show: async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer' },
        {
          model: InvoiceDetail,
          as: 'details', // ← alias correcto
          include: [
            { model: Product, as: 'product' } // ← también debes respetar el alias aquí si lo definiste
          ]
        }
      ]
    });

    if (!invoice) {
      return res.status(404).send('Factura no encontrada');
    }

    // Pagos realizados
    const payments = await Payment.findAll({ where: { invoiceId: invoice.id } });
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const balance = parseFloat(invoice.total - totalPaid).toFixed(2);

    res.render('invoices/show', {
      invoice,
      payments,
      totalPaid: totalPaid.toFixed(2),
      balance,
      layout: false,
      title: `Factura #${invoice.id} | CiwitaPrint`,
      currentPath: `/invoices/${invoice.id}`
    });
  } catch (error) {
    console.error('Error al obtener factura:', error);
    res.status(500).send('Error al obtener factura: ' + error.message);
  }
},

  // Mostrar formulario para registrar pago
  showPayInvoice: async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      if (!invoice) {
        return res.status(404).send('Factura no encontrada');
      }

      res.render('invoices/pay', { 
        invoice,
        title: `Pagar Factura #${invoice.id} | CiwitaPrint`,
        currentPath: `/invoices/${invoice.id}/pay`
      });
    } catch (error) {
      console.error('Error al obtener factura:', error);
      res.status(500).send('Error al obtener factura: ' + error.message);
    }
  },

  // Procesar un nuevo pago
  processPayment: async (req, res) => {
    const { id } = req.params;
    const { amount, paymentMethod } = req.body;

    try {
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        return res.status(404).send('Factura no encontrada');
      }

      if (invoice.isPaid) {
        return res.status(400).send('Esta factura ya está pagada');
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).send('El monto ingresado no es válido');
      }

      const payments = await Payment.findAll({ where: { invoiceId: invoice.id } });
      const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      const newTotalPaid = totalPaid + parsedAmount;
      const invoiceTotal = parseFloat(invoice.total);

      if (newTotalPaid > invoiceTotal) {
        return res.status(400).send('No puedes pagar más del total de la factura');
      }

      await Payment.create({
        invoiceId: invoice.id,
        amount: parsedAmount,
        paymentMethod,
        bankAccount: req.body.bankAccount || null,
        reference: req.body.reference || null
      });

      invoice.paymentDate = new Date();
      invoice.paymentMethod = paymentMethod;

      if (newTotalPaid >= invoiceTotal) {
        invoice.isPaid = true;
        invoice.status = 'Pagada';
      } else {
        invoice.status = 'Parcial';
      }

      await invoice.save();

      // Actualizar o crear cuenta por cobrar
      const [account, created] = await AccountsReceivable.findOrCreate({
        where: { invoiceId: invoice.id },
        defaults: {
          customerId: invoice.customerId,
          amount_due: invoiceTotal,
          amount_paid: newTotalPaid,
          balance: invoiceTotal - newTotalPaid,
          status: invoice.isPaid ? 'Pagado' : 'Pendiente',
          payment_date: invoice.paymentDate,
          payment_method: paymentMethod
        }
      });

      if (!created) {
        account.amount_paid = newTotalPaid;
        account.balance = invoiceTotal - newTotalPaid;
        account.status = invoice.isPaid ? 'Pagado' : 'Pendiente';
        account.payment_date = invoice.paymentDate;
        account.payment_method = paymentMethod;
        await account.save();
      }

      res.redirect(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      res.status(500).send('Error al procesar el pago: ' + error.message);
    }
  }
};

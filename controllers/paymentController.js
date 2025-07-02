const { Invoice, Payment } = require('../models');

// Registrar un pago
exports.createPayment = async (req, res) => {
  const { invoiceId, amount, paymentMethod, bankAccount, reference } = req.body;

  try {
    // Validaciones básicas
    if (!invoiceId || !amount) {
      return res.status(400).json({ error: 'Faltan campos requeridos: invoiceId y amount' });
    }

    if (isNaN(parseFloat(amount))) {
      return res.status(400).json({ error: 'El monto ingresado no es válido' });
    }

    // Buscar factura
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });

    // Obtener pagos previos
    const payments = await Payment.findAll({ where: { invoiceId } });
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const newTotalPaid = totalPaid + parseFloat(amount);

    // Validar que no se exceda el total
    if (newTotalPaid > parseFloat(invoice.total)) {
      return res.status(400).json({ error: 'No puedes pagar más del total de la factura' });
    }

    // Guardar el pago
    const payment = await Payment.create({
      invoiceId,
      amount,
      paymentMethod,
      bankAccount,
      reference
    });

    // Actualizar fecha de pago si es el primer pago
    if (!invoice.paymentDate) {
      invoice.paymentDate = new Date();
    }

    // Si el pago cubre el total → marcar como pagada
    if (newTotalPaid >= parseFloat(invoice.total)) {
      invoice.isPaid = true;
      invoice.status = 'pagada';
    } else {
      invoice.status = 'parcial';
    }

    await invoice.save();

    // Responder con éxito
    res.status(200).json({ message: 'Pago registrado exitosamente', payment });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago', details: error.message });
  }
};

// Obtener todos los pagos
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los pagos' });
  }
};

// Obtener pagos por factura
exports.getPaymentsByInvoice = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const payments = await Payment.findAll({ where: { invoiceId } });
    if (!payments.length) {
      return res.status(404).json({ error: 'No hay pagos registrados para esta factura' });
    }

    res.json(payments);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los pagos' });
  }
};
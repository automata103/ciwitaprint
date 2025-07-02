const { Invoice, Payment, AccountsReceivable, Customer } = require('../models');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
  try {
    const totalSales = await Invoice.sum('total', {});

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPayments = await Payment.findAll({
      where: { 'created_at': { [Op.gte]: today } },
      attributes: ['id']
    });
    const todayOrders = todayPayments.length;

    const todayIncome = await Payment.sum('amount', {
      where: { 'created_at': { [Op.gte]: today } }
    });

    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const weekIncome = await Payment.sum('amount', {
      where: { 'created_at': { [Op.between]: [weekAgo, new Date()] } }
    });

    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);
    const monthIncome = await Payment.sum('amount', {
      where: { 'created_at': { [Op.between]: [monthAgo, new Date()] } }
    });

    const activeClients = await Customer.count();

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const newClients = await Customer.count({
      where: { 'created_at': { [Op.gte]: firstDayOfMonth } }
    });

    const pendingInvoices = await Invoice.findAll({
      where: {
        status: { [Op.in]: ['Pendiente', 'Parcial'] }
      },
      include: [{
        model: Payment,
        as: 'payments',
        attributes: ['amount']
      }]
    });

    const pendingOrders = pendingInvoices.length;

    const pendingAmount = pendingInvoices.reduce((total, invoice) => {
      const paidAmount = invoice.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
      return total + (parseFloat(invoice.total) - paidAmount);
    }, 0);

    const accountsReceivable = await AccountsReceivable.findAll({
      where: { balance: { [Op.gt]: 0 } },
      include: [{
        model: Invoice,
        as: 'invoice',
        include: [{
          model: Customer,
          as: 'customer'
        }]
      }]
    });

      const formattedAccounts = accountsReceivable.map(ar => ({
        customerName: ar.invoice.customer.name,
        customerPhone: ar.invoice.customer.phone || 'N/A',
        customerEmail: ar.invoice.customer.email || null,
        customerId: ar.invoice.customer.id,
        balance: parseFloat(ar.balance || 0).toFixed(2),
        invoiceId: ar.invoice.id,
        dueDate: ar.invoice.dueDate || null
      }));


    res.render('dashboard', {
      totalSales: totalSales?.toFixed(2) || '0.00',
      todayIncome: todayIncome?.toFixed(2) || '0.00',
      todayOrders,
      weekIncome: weekIncome?.toFixed(2) || '0.00',
      monthIncome: monthIncome?.toFixed(2) || '0.00',
      pendingOrders,
      pendingAmount: pendingAmount.toFixed(2),
      activeClients,
      newClients,
      accountsReceivable: formattedAccounts
    });

  } catch (error) {
    console.error('Error al cargar el dashboard:', error);
    res.status(500).send('Error al cargar el dashboard: ' + error.message);
  }
};

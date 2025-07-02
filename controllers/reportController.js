// controllers/reportController.js
const { Invoice, Product, Client } = require('../models');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

exports.sales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const invoices = await Invoice.findAll({ where, include: Client });
    res.render('reports/sales', { invoices });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.products = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: InvoiceItem,
        attributes: ['quantity'],
        include: [{
          model: Invoice,
          attributes: ['date']
        }]
      }]
    });
    res.render('reports/products', { products });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.clients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [{
        model: Invoice,
        attributes: ['total']
      }]
    });
    res.render('reports/clients', { clients });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.exportSalesPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const invoices = await Invoice.findAll({ where, include: Client });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
    doc.pipe(res);

    doc.fontSize(25).text('Sales Report', { align: 'center' });
    doc.moveDown();

    invoices.forEach(invoice => {
      doc.fontSize(12).text(`Invoice ID: ${invoice.id}`);
      doc.fontSize(12).text(`Client: ${invoice.Client.name}`);
      doc.fontSize(12).text(`Date: ${invoice.date}`);
      doc.fontSize(12).text(`Total: $${invoice.total}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.exportSalesExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const invoices = await Invoice.findAll({ where, include: Client });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    worksheet.columns = [
      { header: 'Invoice ID', key: 'id', width: 10 },
      { header: 'Client', key: 'client', width: 32 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Total', key: 'total', width: 10 }
    ];

    invoices.forEach(invoice => {
      worksheet.addRow({
        id: invoice.id,
        client: invoice.Client.name,
        date: invoice.date,
        total: invoice.total
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const CierreCaja = require('../models/CierreCaja');
const User = require('../models/User');

// Crear un nuevo cierre de caja
exports.createCierre = async (req, res) => {
  try {
    const { fecha, total_ingresos, total_gastos, saldo_final, usuario_id } = req.body;

    const nuevoCierre = await CierreCaja.create({
      fecha,
      total_ingresos,
      total_gastos,
      saldo_final,
      usuario_id
    });

    res.status(201).json({ success: true, data: nuevoCierre });
  } catch (error) {
    console.error('Error al crear cierre de caja:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Listar todos los cierres de caja
exports.listarCierres = async (req, res) => {
  try {
   const cierres = await CierreCaja.findAll({
  include: {
    model: User,
    as: 'usuario',
    attributes: ['id', 'username', 'nombre_completo']
  },
  order: [['fecha', 'DESC']]
});


    // Puedes usar esta línea si quieres mostrar una vista EJS
    // res.render('cierres/index', { cierres });

    // JSON para pruebas
    res.status(200).json({ success: true, data: cierres });
  } catch (error) {
    console.error('Error al listar cierres:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mostrar formulario para crear un cierre
exports.mostrarFormularioCrear = async (req, res) => {
  try {
    const usuarios = await User.findAll({ attributes: ['id', 'nombre_completo'] });
    res.render('cierres/crear', { usuarios });
  } catch (error) {
    console.error('Error al cargar formulario:', error);
    res.status(500).send('Error al cargar el formulario');
  }
};

// Eliminar un cierre
exports.eliminarCierre = async (req, res) => {
  try {
    const { id } = req.params;
    await CierreCaja.destroy({ where: { id } });
    res.redirect('/cierres');
  } catch (error) {
    console.error('Error al eliminar cierre:', error);
    res.status(500).send('Error al eliminar cierre');
  }
};

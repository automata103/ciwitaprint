// controllers/notificationController.js
const { Order, AccountReceivable, AccountPayable } = require('../models');

exports.getNotifications = async (req, res) => {
  try {
    const today = new Date();
    const upcomingOrders = await Order.findAll({
      where: {
        deliveryDate: {
          [Op.between]: [today, new Date(today.setDate(today.getDate() + 3))]
        },
        status: 'Pendiente'
      }
    });

    const overdueReceivables = await AccountReceivable.findAll({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: 'Pendiente'
      }
    });

    const overduePayables = await AccountPayable.findAll({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: 'Pendiente'
      }
    });

    res.json({
      upcomingOrders,
      overdueReceivables,
      overduePayables
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

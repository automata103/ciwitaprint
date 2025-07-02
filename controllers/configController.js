// controllers/configController.js
const { Config } = require('../models');

exports.edit = async (req, res) => {
  try {
    const config = await Config.findOne();
    res.render('config/edit', { config });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { businessName, logo, tax } = req.body;
    await Config.update({ businessName, logo, tax }, { where: { id: 1 } });
    res.redirect('/config/edit');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

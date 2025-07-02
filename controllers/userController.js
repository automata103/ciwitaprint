// controllers/userController.js
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.list = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users/list', { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.add = async (req, res) => {
  try {
    res.render('users/add');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role });
    res.redirect('/users');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.edit = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.render('users/edit', { user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await User.update({ name, email, role }, { where: { id: req.params.id } });
    res.redirect('/users');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.redirect('/users');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

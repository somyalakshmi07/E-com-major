// filepath: c:\Users\Dell\kids-accessories-ecommerce\server\controllers\adminController.js
const path = require('path');
const Product = require('../models/Product');

exports.renderAdminPage = async (req, res) => {
  const products = await Product.find();
  res.render('admin', { products });
};

exports.addProduct = async (req, res) => {
  const { name, category, price } = req.body;
  const imageUrl = req.file ? '/uploads/' + req.file.filename : '';
  await Product.create({ name, category, price, imageUrl });
  res.redirect('/admin/dashboard');
};
const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/products');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, featured, stock } = req.body;
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      featured: featured === 'on',
      stock,
      image: req.file ? req.file.filename : 'default-product.jpg'
    });

    await newProduct.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Add more product controller methods as needed
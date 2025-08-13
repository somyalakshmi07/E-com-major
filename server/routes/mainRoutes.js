const express = require('express');
const router = express.Router();
const Product = require('../server/models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products }); // Pass products to EJS
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
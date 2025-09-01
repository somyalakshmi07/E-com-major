const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    
    // Get featured products (first 3 for demo)
    const featuredProducts = products.slice(0, 3);
    
    res.render('index', {
      title: 'Kids Fun Shop - Home',
      featuredProducts: featuredProducts
    });
  });
});

module.exports = router;
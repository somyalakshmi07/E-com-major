const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    
    res.render('products', {
      title: 'All Products - Kids Fun Shop',
      products: products
    });
  });
});

router.get('/category/:category', (req, res) => {
  const category = req.params.category;
  
  Product.getByCategory(category, (err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    
    res.render('products', {
      title: `${category} - Kids Fun Shop`,
      products: products
    });
  });
});

router.get('/:id', (req, res) => {
  const productId = req.params.id;
  
  Product.getById(productId, (err, product) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    
    if (!product) {
      return res.status(404).send('Product not found');
    }
    
    res.render('product-detail', {
      title: `${product.name} - Kids Fun Shop`,
      product: product
    });
  });
});

module.exports = router;
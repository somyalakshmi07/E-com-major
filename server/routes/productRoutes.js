const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public routes
router.get('/api/products', productController.getAllProducts);
router.get('/api/products/featured', productController.getFeaturedProducts);

// Admin routes (protected)
router.post('/admin/products', 
  productController.uploadImage, 
  productController.createProduct
);

module.exports = router;
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Public routes
router.get('/api/categories', categoryController.getAllCategories);

// Admin routes (protected)
router.post('/admin/categories', categoryController.createCategory);

module.exports = router;
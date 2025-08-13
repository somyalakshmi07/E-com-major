const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload'); // For image uploads

// Admin dashboard
router.get('/dashboard', isAdmin, (req, res) => {
    res.render('admin/dashboard');
});

// Add product form
router.get('/products/add', isAdmin, (req, res) => {
    res.render('admin/add-product');
});

// Handle product creation
router.post('/products', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            image: req.file ? req.file.path : null
        });

        await product.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
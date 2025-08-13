const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth'); // Add authentication middleware

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.render('cart', { 
        cartItems: [],
        subtotal: '0.00',
        tax: '0.00',
        shipping: '0.00',
        total: '0.00'
      });
    }

    const totals = cart.calculateTotals();
    res.render('cart', { 
      cartItems: cart.items,
      ...totals
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const quantityNum = parseInt(quantity) || 1;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantityNum;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity: quantityNum,
        price: product.price,
        name: product.name,
        image: product.image,
        category: product.category
      });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Update quantity
router.post('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const quantityNum = parseInt(quantity);

    if (quantityNum < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantityNum;
    await cart.save();

    const totals = cart.calculateTotals();
    res.json({ 
      success: true,
      ...totals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

//  Add to cart

router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product ID is required' 
            });
        }

        // Get product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        // Check stock
        if (quantity > product.stock) {
            return res.status(400).json({ 
                success: false, 
                message: 'Not enough stock available' 
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
                name: product.name,
                image: product.image,
                category: product.category
            });
        }

        await cart.save();

        // Calculate total items in cart
        const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        res.json({ 
            success: true,
            cartItemCount,
            message: 'Product added to cart'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
});
module.exports = router;
const express = require('express');
const db = require('../database/database');
const router = express.Router();

// Add to cart
router.post('/add', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  
  const { productId, quantity } = req.body;
  const userId = req.session.userId;
  
  // Check if product already in cart
  db.get(
    "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?", 
    [userId, productId], 
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      
      if (row) {
        // Update quantity if product already in cart
        db.run(
          "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
          [quantity, row.id],
          function(err) {
            if (err) {
              console.error(err);
              return res.status(500).send('Server Error');
            }
            res.redirect('/cart');
          }
        );
      } else {
        // Add new item to cart
        db.run(
          "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [userId, productId, quantity],
          function(err) {
            if (err) {
              console.error(err);
              return res.status(500).send('Server Error');
            }
            res.redirect('/cart');
          }
        );
      }
    }
  );
});

// View cart
router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  
  const userId = req.session.userId;
  
  db.all(
    `SELECT cart_items.*, products.name, products.price, products.image_url 
     FROM cart_items 
     JOIN products ON cart_items.product_id = products.id 
     WHERE user_id = ?`,
    [userId],
    (err, items) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      
      let total = 0;
      items.forEach(item => {
        item.subtotal = item.price * item.quantity;
        total += item.subtotal;
      });
      
      res.render('cart', {
        title: 'Shopping Cart - Kids Fun Shop',
        cartItems: items,
        total: total.toFixed(2)
      });
    }
  );
});

// Remove from cart
router.post('/remove/:id', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  
  const itemId = req.params.id;
  const userId = req.session.userId;
  
  db.run(
    "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
    [itemId, userId],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      res.redirect('/cart');
    }
  );
});

// Checkout page
router.get('/checkout', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  
  const userId = req.session.userId;
  
  // Get cart items to display on checkout page
  db.all(
    `SELECT cart_items.*, products.name, products.price 
     FROM cart_items 
     JOIN products ON cart_items.product_id = products.id 
     WHERE user_id = ?`,
    [userId],
    (err, items) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      
      let total = 0;
      items.forEach(item => {
        item.subtotal = item.price * item.quantity;
        total += item.subtotal;
      });
      
      res.render('checkout', {
        title: 'Checkout - Kids Fun Shop',
        cartItems: items,
        total: total.toFixed(2)
      });
    }
  );
});

// Complete order
router.post('/complete-order', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  
  const userId = req.session.userId;
  
  // In a real application, you would process payment and save order details
  // For this demo, we'll just clear the cart
  db.run(
    "DELETE FROM cart_items WHERE user_id = ?",
    [userId],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      
      res.render('order-complete', {
        title: 'Order Complete - Kids Fun Shop'
      });
    }
  );
});

module.exports = router;
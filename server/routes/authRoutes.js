const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login - Little Treasures',
    currentPage: 'login'
  });
});

// Login handle
router.post('/login', (req, res, next) => {
  // Simple authentication for demo
  const { email, password } = req.body;
  
  if (email === 'admin@example.com' && password === 'password123') {
    req.session.user = { 
      id: 1, 
      username: 'admin', 
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };
    req.flash('success_msg', 'You are now logged in');
    return res.redirect('/');
  }
  
  req.flash('error_msg', 'Invalid credentials');
  res.redirect('/auth/login');
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register', {
    pageTitle: 'Register - Little Treasures',
    currentPage: 'register'
  });
});

// Register handle
router.post('/register', async (req, res) => {
  // For demo purposes, just redirect to login
  req.flash('success_msg', 'Registration is disabled in demo mode. Use admin@example.com / password123');
  res.redirect('/auth/login');
});

// Logout handle
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
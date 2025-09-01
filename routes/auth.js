const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database/database');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login - Kids Fun Shop',
    error: null
  });
});

// Login processing
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      
      if (!user) {
        return res.render('login', {
          title: 'Login - Kids Fun Shop',
          error: 'Invalid username or password'
        });
      }
      
      // Compare password with hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server Error');
        }
        
        if (result) {
          req.session.userId = user.id;
          req.session.username = user.username;
          res.redirect('/');
        } else {
          res.render('login', {
            title: 'Login - Kids Fun Shop',
            error: 'Invalid username or password'
          });
        }
      });
    }
  );
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register - Kids Fun Shop',
    error: null
  });
});

// Register processing
router.post('/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  
  // Basic validation
  if (password !== confirmPassword) {
    return res.render('register', {
      title: 'Register - Kids Fun Shop',
      error: 'Passwords do not match'
    });
  }
  
  // Check if user already exists
  db.get(
    "SELECT id FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      
      if (row) {
        return res.render('register', {
          title: 'Register - Kids Fun Shop',
          error: 'Username or email already exists'
        });
      }
      
      // Hash password and create user
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server Error');
        }
        
        db.run(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hash],
          function(err) {
            if (err) {
              console.error(err);
              return res.status(500).send('Server Error');
            }
            
            req.session.userId = this.lastID;
            req.session.username = username;
            res.redirect('/');
          }
        );
      });
    }
  );
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
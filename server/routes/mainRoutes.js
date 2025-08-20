const express = require('express');
const router = express.Router();

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About Us - Little Treasures',
    currentPage: 'about'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', {
    pageTitle: 'Contact Us - Little Treasures',
    currentPage: 'contact'
  });
});

module.exports = router;
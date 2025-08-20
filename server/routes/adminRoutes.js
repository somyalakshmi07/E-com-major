const express = require('express');
const router = express.Router();

// Admin dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error_msg', 'Please log in as admin');
    return res.redirect('/auth/login');
  }
  
  res.render('admin/dashboard', {
    pageTitle: 'Admin Dashboard - Little Treasures',
    currentPage: 'admin'
  });
});

module.exports = router;
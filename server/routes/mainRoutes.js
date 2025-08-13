// routes/mainRoutes.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  res.render('home', { 
    currentUser: req.user // Pass the authenticated user from Passport
  });
});

module.exports = router;
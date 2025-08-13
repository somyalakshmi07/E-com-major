const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');

// Example isAdmin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Access denied');
};

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Admin dashboard
router.get('/dashboard', isAdmin, adminController.renderAdminPage);

// Add product (with image upload)
router.post('/add-product', isAdmin, upload.single('image'), adminController.addProduct);

module.exports = router;
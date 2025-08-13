require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const session = require('express-session');


// Import routes
const homeRoutes = require('../server/routes/homeRoutes');
const productRoutes = require('../server/routes/productRoutes');
const categoryRoutes = require('../server/routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cartCountMiddleware = require('./middleware/cartCount');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// Add after session middleware but before routes
app.use(cartCountMiddleware);
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', homeRoutes);
app.use('/', productRoutes);
app.use('/', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/admin', adminRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.use(session({
  secret: 'oD+dbogOVXvmIZuN91EkhMHjIJTlnVCAHtBfPVrtdIk=',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
// Start server
const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
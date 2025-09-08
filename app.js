const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'kids-fun-shop-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Make session available to all templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Use routes
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

// Start server
app.listen(PORT, () => {
  console.log(`Kids Fun Shop running on http://localhost:${PORT}`);
});
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Session configuration
app.use(session({
    secret: 'BafmaYs4f6q6aLHkjPmPckBIKS3g6+VZR7zHOOIh3A8=',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Initialize cart and wishlist
app.use((req, res, next) => {
    req.session.cart = req.session.cart || [];
    req.session.wishlist = req.session.wishlist || [];
    next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Image handling
const placeholderImages = {
    'dress1.jpg': 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=500',
    'dress2.jpg': 'https://images.unsplash.com/photo-1590071089561-2085c1ddf6a3?w=500',
    'dress3.jpg': 'https://images.unsplash.com/photo-1603969409445-8f38a8f8b724?w=500',
    'toy1.jpg': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500',
    'toy2.jpg': 'https://images.unsplash.com/photo-1594782915050-3a7a6d21ab51?w=500',
    'toy3.jpg': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500',
    'medicine1.jpg': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
    'medicine2.jpg': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500',
    'medicine3.jpg': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500',
    'book1.jpg': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    'book2.jpg': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500',
    'book3.jpg': 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500',
    'category-clothing.jpg': 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800',
    'category-toys.jpg': 'https://images.unsplash.com/photo-1599623560574-39d485900c95?w=800',
    'category-books.jpg': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
    'category-health.jpg': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
    'summer-banner.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'
};

function getImageUrl(imageName) {
    return placeholderImages[imageName] || '/images/default-product.jpg';
}

// Products database
const products = [
    { id: 1, name: 'Colorful Summer Dress', price: 24.99, image: getImageUrl('dress1.jpg'), category: 'clothing', rating: 4.5, stock: 15 },
    { id: 2, name: 'Educational Wooden Blocks', price: 19.99, image: getImageUrl('toy1.jpg'), category: 'toys', rating: 5, stock: 8 },
    { id: 3, name: 'Children\'s Multivitamin', price: 12.99, image: getImageUrl('medicine1.jpg'), category: 'health', rating: 4, stock: 20 },
    { id: 4, name: 'Bedtime Story Book Set', price: 29.99, image: getImageUrl('book1.jpg'), category: 'books', rating: 4.8, stock: 12 },
    { id: 5, name: 'Adorable Bunny Onesie', price: 22.99, image: getImageUrl('dress2.jpg'), category: 'clothing', rating: 4.7, stock: 10 },
    { id: 6, name: 'Interactive Learning Tablet', price: 39.99, image: getImageUrl('toy2.jpg'), category: 'toys', rating: 4.2, stock: 5 },
    { id: 7, name: 'Organic Baby Shampoo', price: 9.99, image: getImageUrl('medicine2.jpg'), category: 'health', rating: 4.9, stock: 18 },
    { id: 8, name: 'Alphabet Puzzle Book', price: 14.99, image: getImageUrl('book2.jpg'), category: 'books', rating: 4.3, stock: 7 },
    { id: 9, name: 'Rainbow Tutu Skirt', price: 18.99, image: getImageUrl('dress3.jpg'), category: 'clothing', rating: 4.6, stock: 9 },
    { id: 10, name: 'Building Blocks Set', price: 27.99, image: getImageUrl('toy3.jpg'), category: 'toys', rating: 4.4, stock: 11 },
    { id: 11, name: 'Kids Vitamin Gummies', price: 11.99, image: getImageUrl('medicine3.jpg'), category: 'health', rating: 4.1, stock: 22 },
    { id: 12, name: 'Animal Sound Book', price: 16.99, image: getImageUrl('book3.jpg'), category: 'books', rating: 4.7, stock: 14 }
];

// Routes
app.get('/', (req, res) => {
    res.render('home', {
        pageTitle: 'Little Treasures - Kids Accessories',
        featuredProducts: products.slice(0, 4),
        products: products.slice(0, 8), // Add this line to pass products to the template
        categories: [
            { name: 'Clothing', icon: '👚' },
            { name: 'Toys', icon: '🧸' },
            { name: 'Books', icon: '📚' },
            { name: 'Health', icon: '💊' },
            { name: 'School', icon: '🎒' },
            { name: 'Baby Care', icon: '🍼' }
        ],
        cartCount: req.session.cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
        wishlistCount: req.session.wishlist.length || 0,
        currentPage: 'home'
    });
});
app.get('/shop', (req, res) => {
    const { category = 'all', sort = 'default', page = 1, search = '' } = req.query;
    const itemsPerPage = 6;
    const currentPage = parseInt(page);
    
    let filteredProducts = products.filter(product => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = !search || 
            product.name.toLowerCase().includes(search.toLowerCase()) || 
            product.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    
    switch(sort) {
        case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
        case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
        case 'rating': filteredProducts.sort((a, b) => b.rating - a.rating); break;
    }
    
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    
    res.render('shop', {
        pageTitle: 'Shop - Little Treasures',
        products: paginatedProducts,
        categories: [
            { name: 'All', value: 'all' },
            { name: 'Clothing', value: 'clothing' },
            { name: 'Toys', value: 'toys' },
            { name: 'Books', value: 'books' },
            { name: 'Health', value: 'health' }
        ],
        sortOptions: [
            { name: 'Default', value: 'default' },
            { name: 'Price: Low to High', value: 'price-low' },
            { name: 'Price: High to Low', value: 'price-high' },
            { name: 'Highest Rating', value: 'rating' }
        ],
        currentCategory: category,
        currentSort: sort,
        currentPage: currentPage,
        totalPages: totalPages,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
        searchQuery: search,
        cartCount: req.session.cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
        wishlistCount: req.session.wishlist.length || 0,
        currentPage: 'shop'
    });
});

app.get('/categories', (req, res) => {
    const categoryStats = {
        clothing: { count: products.filter(p => p.category === 'clothing').length, subcategories: ['Dresses', 'Outerwear', 'Onesies', 'Accessories'] },
        toys: { count: products.filter(p => p.category === 'toys').length, subcategories: ['Educational', 'Outdoor', 'Creative', 'Electronic'] },
        books: { count: products.filter(p => p.category === 'books').length, subcategories: ['Picture Books', 'Early Readers', 'Activity Books', 'Bedtime Stories'] },
        health: { count: products.filter(p => p.category === 'health').length, subcategories: ['Vitamins', 'Personal Care', 'Medicines', 'Safety'] }
    };

    const newArrivals = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

    res.render('categories', {
        pageTitle: 'Categories - Little Treasures',
        categories: ['clothing', 'toys', 'books', 'health'].map(cat => ({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            value: cat,
            icon: cat === 'clothing' ? '👚' : cat === 'toys' ? '🧸' : cat === 'books' ? '📚' : '💊',
            description: cat === 'clothing' ? 'Adorable outfits for your little ones' :
                         cat === 'toys' ? 'Fun and educational toys' :
                         cat === 'books' ? 'Engaging stories for young minds' : 'Essential health products for kids',
            image: `category-${cat}.jpg`,
            count: categoryStats[cat].count,
            subcategories: categoryStats[cat].subcategories
        })),
        newArrivals: newArrivals,
        seasonalBanner: {
            title: "Summer Fun Sale!",
            subtitle: "Up to 30% off on outdoor toys and summer clothing",
            image: "summer-banner.jpg",
            link: "/shop?category=toys"
        },
        cartCount: req.session.cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
        wishlistCount: req.session.wishlist.length || 0,
        currentPage: 'categories'
    });
});

// Cart API endpoints
app.post('/cart/add', (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id == productId);
    
    if (product) {
        const existingItem = req.session.cart.find(item => item.id == productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            req.session.cart.push({ ...product, quantity: 1 });
        }
        res.json({ 
            success: true, 
            cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0) 
        });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

app.post('/cart/remove', (req, res) => {
    const { productId } = req.body;
    req.session.cart = req.session.cart.filter(item => item.id != productId);
    res.json({ 
        success: true, 
        cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0) 
    });
});

app.post('/cart/update', (req, res) => {
    const { productId, quantity } = req.body;
    const item = req.session.cart.find(item => item.id == productId);
    if (item) {
        item.quantity = quantity;
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false });
    }
});

// Cart page
app.get('/cart', (req, res) => {
    const cartItems = req.session.cart || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;
    
    res.render('cart', {
        pageTitle: 'Your Cart - Little Treasures',
        cartItems,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0),
        wishlistCount: req.session.wishlist.length || 0,
        currentPage: 'cart'
    });
});

// Wishlist API endpoints
app.post('/wishlist/toggle', (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id == productId);
    
    if (product) {
        const existingIndex = req.session.wishlist.findIndex(item => item.id == productId);
        if (existingIndex >= 0) {
            req.session.wishlist.splice(existingIndex, 1);
            res.json({ success: true, inWishlist: false });
        } else {
            req.session.wishlist.push(product);
            res.json({ success: true, inWishlist: true });
        }
    } else {
        res.status(404).json({ success: false });
    }
});

// Wishlist page
app.get('/wishlist', (req, res) => {
    res.render('wishlist', {
        pageTitle: 'Your Wishlist - Little Treasures',
        wishlistItems: req.session.wishlist || [],
        cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0),
        wishlistCount: req.session.wishlist.length || 0,
        currentPage: 'wishlist'
    });
});

// Count endpoints
app.get('/cart/count', (req, res) => {
    res.json({ count: req.session.cart.reduce((sum, item) => sum + item.quantity, 0) });
});

app.get('/wishlist/count', (req, res) => {
    res.json({ count: req.session.wishlist.length });
});

// Start server
const PORT = process.env.PORT || 8080;
app.use(express.static('../client/views')); 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
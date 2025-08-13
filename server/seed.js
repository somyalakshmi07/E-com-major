require('dotenv').config({ path: 'C:/Users/Dell/kids-accessories-ecommerce/.env' }); // Explicitly specify path
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Verify environment variables are loaded
console.log('Environment variables:', {
  MONGO_URI: process.env.MONGO_URI
});

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

const categories = [
  { name: 'Clothing', icon: '👕' },
  { name: 'Toys', icon: '🧸' },
  { name: 'Books', icon: '📚' },
  { name: 'Accessories', icon: '🧦' },
  { name: 'Nursery', icon: '🛏️' },
  { name: 'Feeding', icon: '🍼' }
];

const products = [
  {
    name: 'Cotton Onesie',
    description: 'Soft cotton onesie for babies',
    price: 12.99,
    image: 'onesie.jpg',
    featured: true,
    stock: 50
  },
  {
    name: 'Wooden Train Set',
    description: 'Eco-friendly wooden train toys',
    price: 29.99,
    image: 'train.jpg',
    featured: true,
    stock: 30
  },
  {
    name: 'Baby Storybook',
    description: 'Colorful picture book for toddlers',
    price: 8.99,
    image: 'book.jpg',
    featured: true,
    stock: 100
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    console.log('Inserting categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories inserted`);

    // Update products with category IDs
    const updatedProducts = products.map(product => ({
      ...product,
      category: createdCategories[0]._id // Assign all products to first category
    }));

    // Insert products
    console.log('Inserting products...');
    const createdProducts = await Product.insertMany(updatedProducts);
    console.log(`${createdProducts.length} products inserted`);

    // Close connection
    await mongoose.connection.close();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedDB();
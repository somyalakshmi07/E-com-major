const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getHomePage = async (req, res) => {
  try {
    const categories = await Category.find().limit(6);
    const featuredProducts = await Product.find({ featured: true }).limit(8);
    
    res.render('home', {
      title: 'Little Treasures - Home',
      categories,
      featuredProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
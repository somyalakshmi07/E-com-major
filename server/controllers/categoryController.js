const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    
    const newCategory = new Category({
      name,
      icon
    });

    await newCategory.save();
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Add more category controller methods as needed
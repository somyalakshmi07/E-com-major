router.get('/', auth, async (req, res) => {
  try {
    // Get products and other shop data
    const products = await Product.find();
    
    // Get cart count for the header
    const cart = await Cart.findOne({ user: req.user.id });
    const cartItemCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    res.render('shop', {
      products,
      cartItemCount, // Make sure this is passed to the template
      // other variables...
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
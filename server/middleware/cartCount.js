module.exports = async function(req, res, next) {
  try {
    if (req.user) {
      const cart = await Cart.findOne({ user: req.user.id });
      res.locals.cartItemCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    } else {
      res.locals.cartItemCount = 0;
    }
    next();
  } catch (error) {
    console.error('Cart count middleware error:', error);
    res.locals.cartItemCount = 0;
    next();
  }
};
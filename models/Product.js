const db = require('../database/database');

class Product {
  static getAll(callback) {
    db.all("SELECT * FROM products", callback);
  }

  static getById(id, callback) {
    db.get("SELECT * FROM products WHERE id = ?", [id], callback);
  }

  static getByCategory(category, callback) {
    db.all("SELECT * FROM products WHERE category = ?", [category], callback);
  }
}

module.exports = Product;
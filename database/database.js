const mysql = require('mysql2/promise');
const path = require('path');

const db = mysql.createPool({
  host: "kids-fun-shop.mysql.database.azure.com", // Private DNS inside VNet
  user: "adminuser",
  password: "Somya@123",
  database: "kids_fun_shop",
  port: 3306,
  ssl: { rejectUnauthorized: true }  // Azure MySQL enforces SSL
});

// Initialize database with tables
db.getConnection()
  .then(connection => {
    console.log("Connected to the database.");

    // Products table
    return connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price INTEGER,
        category TEXT,
        image_url TEXT,
        age_range TEXT,
        stock INTEGER
      )
    `);
  })
  .then(() => {
    console.log("Products table ensured.");
  })
  .catch(err => {
    console.error("Database initialization error:", err);
  });

module.exports = db;
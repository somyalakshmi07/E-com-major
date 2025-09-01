const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'kids_fun_shop.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with tables
db.serialize(() => {
  // Products table
  db.run(`
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

  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Cart items table
  db.run(`CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Insert sample products if they don't exist
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      const products = [
        // Toys Category (10 items)
        {
          name: "Colorful Building Blocks",
          description: "100 pieces of colorful building blocks for creative play",
          price: 499, // INR
          category: "Toys",
          image_url: "/images/products/building-blocks.jpg",
          age_range: "3-8",
          stock: 50
        },
        {
          name: "Remote Control Car",
          description: "Fast and fun remote control car for racing",
          price: 899,
          category: "Toys",
          image_url: "/images/remote-control-car.jpg",
          age_range: "5-12",
          stock: 40
        },
        {
          name: "Puzzle Cube",
          description: "Classic puzzle cube for brain exercise",
          price: 199,
          category: "Toys",
          image_url: "/images/puzzle-cube.jpg",
          age_range: "6-12",
          stock: 60
        },
        {
          name: "Stacking Rings",
          description: "Colorful stacking rings for toddlers",
          price: 299,
          category: "Toys",
          image_url: "/images/stacking-rings.jpg",
          age_range: "1-4",
          stock: 70
        },
        {
          name: "Musical Drum Set",
          description: "Mini drum set for little musicians",
          price: 799,
          category: "Toys",
          image_url: "/images/musical-drum-set.jpg",
          age_range: "3-8",
          stock: 30
        },
        {
          name: "Toy Train",
          description: "Battery operated toy train with tracks",
          price: 699,
          category: "Toys",
          image_url: "/images/toy-train.jpg",
          age_range: "3-8",
          stock: 45
        },
        {
          name: "Action Figure Hero",
          description: "Superhero action figure for imaginative play",
          price: 349,
          category: "Toys",
          image_url: "/images/action-figure-hero.jpg",
          age_range: "5-12",
          stock: 55
        },
        {
          name: "Bubble Maker",
          description: "Automatic bubble maker for outdoor fun",
          price: 249,
          category: "Toys",
          image_url: "/images/bubble-maker.jpg",
          age_range: "3-10",
          stock: 80
        },
        {
          name: "Jump Rope",
          description: "Colorful jump rope for active kids",
          price: 99,
          category: "Toys",
          image_url: "/images/jump-rope.jpg",
          age_range: "5-12",
          stock: 100
        },
        {
          name: "Mini Basketball Hoop",
          description: "Indoor mini basketball hoop set",
          price: 599,
          category: "Toys",
          image_url: "/images/mini-basketball-hoop.jpg",
          age_range: "6-12",
          stock: 35
        },

        // Stuffed Animals Category (10 items)
        {
          name: "Super Soft Teddy Bear",
          description: "Extra soft and cuddly teddy bear for bedtime",
          price: 399,
          category: "Stuffed Animals",
          image_url: "/images/teddy-bear.jpg",
          age_range: "0-5",
          stock: 30
        },
        {
          name: "Fluffy Bunny",
          description: "Adorable fluffy bunny plush toy",
          price: 349,
          category: "Stuffed Animals",
          image_url: "/images/fluffy-bunny.jpg",
          age_range: "0-5",
          stock: 25
        },
        {
          name: "Cuddly Elephant",
          description: "Soft elephant plush for hugs",
          price: 449,
          category: "Stuffed Animals",
          image_url: "/images/cuddly-elephant.jpg",
          age_range: "0-5",
          stock: 20
        },
        {
          name: "Mini Lion Cub",
          description: "Cute lion cub stuffed animal",
          price: 299,
          category: "Stuffed Animals",
          image_url: "/images/mini-lion-cub.jpg",
          age_range: "0-5",
          stock: 18
        },
        {
          name: "Penguin Pal",
          description: "Chilly penguin plush for winter fun",
          price: 349,
          category: "Stuffed Animals",
          image_url: "/images/penguin-pal.jpg",
          age_range: "0-5",
          stock: 22
        },
        {
          name: "Rainbow Unicorn",
          description: "Magical rainbow unicorn plush",
          price: 499,
          category: "Stuffed Animals",
          image_url: "/images/rainbow-unicorn.jpg",
          age_range: "3-8",
          stock: 15
        },
        {
          name: "Sleepy Sloth",
          description: "Slow and sleepy sloth plush",
          price: 399,
          category: "Stuffed Animals",
          image_url: "/images/sleepy-sloth.jpg",
          age_range: "3-8",
          stock: 12
        },
        {
          name: "Friendly Fox",
          description: "Bright orange fox plush toy",
          price: 349,
          category: "Stuffed Animals",
          image_url: "/images/friendly-fox.jpg",
          age_range: "3-8",
          stock: 14
        },
        {
          name: "Giraffe Buddy",
          description: "Tall giraffe plush for animal lovers",
          price: 449,
          category: "Stuffed Animals",
          image_url: "/images/giraffe-buddy.jpg",
          age_range: "3-8",
          stock: 10
        },
        {
          name: "Polar Bear Cub",
          description: "Snowy polar bear cub plush",
          price: 399,
          category: "Stuffed Animals",
          image_url: "/images/polar-bear-cub.jpg",
          age_range: "3-8",
          stock: 13
        },

        // Arts & Crafts Category (10 items)
        {
          name: "Art Set Deluxe",
          description: "Complete art set with crayons, markers, and coloring books",
          price: 599,
          category: "Arts & Crafts",
          image_url: "/images/art-set.jpg",
          age_range: "5-12",
          stock: 25
        },
        {
          name: "Finger Paint Kit",
          description: "Safe and washable finger paint kit",
          price: 249,
          category: "Arts & Crafts",
          image_url: "/images/finger-paint-kit.jpg",
          age_range: "3-8",
          stock: 30
        },
        {
          name: "Origami Paper Pack",
          description: "Bright origami paper for folding fun",
          price: 149,
          category: "Arts & Crafts",
          image_url: "/images/origami-paper-pack.jpg",
          age_range: "5-12",
          stock: 40
        },
        {
          name: "DIY Bracelet Kit",
          description: "Make your own colorful bracelets",
          price: 299,
          category: "Arts & Crafts",
          image_url: "/images/diy-bracelet-kit.jpg",
          age_range: "6-12",
          stock: 20
        },
        {
          name: "Sticker Mania",
          description: "Over 500 fun stickers for crafts",
          price: 199,
          category: "Arts & Crafts",
          image_url: "/images/sticker-mania.jpg",
          age_range: "3-10",
          stock: 50
        },
        {
          name: "Coloring Book Set",
          description: "Set of 3 themed coloring books",
          price: 249,
          category: "Arts & Crafts",
          image_url: "/images/coloring-book-set.jpg",
          age_range: "3-8",
          stock: 35
        },
        {
          name: "Craft Scissors",
          description: "Safe craft scissors for kids",
          price: 99,
          category: "Arts & Crafts",
          image_url: "/images/craft-scissors.jpg",
          age_range: "5-12",
          stock: 60
        },
        {
          name: "Foam Shapes Pack",
          description: "Assorted foam shapes for art projects",
          price: 149,
          category: "Arts & Crafts",
          image_url: "/images/foam-shapes-pack.jpg",
          age_range: "3-8",
          stock: 45
        },
        {
          name: "Glitter Glue Set",
          description: "6-pack glitter glue for sparkling crafts",
          price: 199,
          category: "Arts & Crafts",
          image_url: "/images/glitter-glue-set.jpg",
          age_range: "5-12",
          stock: 38
        },
        {
          name: "Bead Art Kit",
          description: "Create bead art with templates",
          price: 349,
          category: "Arts & Crafts",
          image_url: "/images/bead-art-kit.jpg",
          age_range: "6-12",
          stock: 28
        },

        // Educational Category (10 items)
        {
          name: "Science Experiment Kit",
          description: "Fun and safe science experiments for curious kids",
          price: 799,
          category: "Educational",
          image_url: "/images/science-kit.jpg",
          age_range: "8-12",
          stock: 20
        },
        {
          name: "Math Puzzle Set",
          description: "Challenging math puzzles for learning",
          price: 299,
          category: "Educational",
          image_url: "/images/math-puzzle-set.jpg",
          age_range: "6-12",
          stock: 25
        },
        {
          name: "Alphabet Flashcards",
          description: "Colorful alphabet flashcards for early learners",
          price: 149,
          category: "Educational",
          image_url: "/images/alphabet-flashcards.jpg",
          age_range: "3-6",
          stock: 40
        },
        {
          name: "Solar System Model",
          description: "Build your own solar system model",
          price: 499,
          category: "Educational",
          image_url: "/images/solar-system-model.jpg",
          age_range: "8-12",
          stock: 15
        },
        {
          name: "Animal Fact Book",
          description: "Learn fun facts about animals",
          price: 199,
          category: "Educational",
          image_url: "/images/animal-fact-book.jpg",
          age_range: "5-10",
          stock: 30
        },
        {
          name: "Magnetic Letters",
          description: "Set of magnetic letters for spelling practice",
          price: 249,
          category: "Educational",
          image_url: "/images/magnetic-letters.jpg",
          age_range: "3-8",
          stock: 35
        },
        {
          name: "World Map Puzzle",
          description: "Puzzle map of the world for geography fun",
          price: 399,
          category: "Educational",
          image_url: "/images/world-map-puzzle.jpg",
          age_range: "6-12",
          stock: 22
        },
        {
          name: "Counting Bears",
          description: "Colorful bears for counting and sorting",
          price: 299,
          category: "Educational",
          image_url: "/images/counting-bears.jpg",
          age_range: "3-8",
          stock: 28
        },
        {
          name: "Shape Sorter",
          description: "Wooden shape sorter for toddlers",
          price: 349,
          category: "Educational",
          image_url: "/images/shape-sorter.jpg",
          age_range: "1-4",
          stock: 18
        },
        {
          name: "Story Book Set",
          description: "Set of 5 story books for kids",
          price: 499,
          category: "Educational",
          image_url: "/images/story-book-set.jpg",
          age_range: "3-8",
          stock: 20
        },

        // Sports Category (10 items)
        {
          name: "Junior Soccer Ball",
          description: "Size-appropriate soccer ball for young players",
          price: 299,
          category: "Sports",
          image_url: "/images/soccer-ball.jpg",
          age_range: "3-10",
          stock: 40
        },
        {
          name: "Kids Cricket Bat",
          description: "Lightweight cricket bat for kids",
          price: 399,
          category: "Sports",
          image_url: "/images/kids-cricket-bat.jpg",
          age_range: "6-12",
          stock: 25
        },
        {
          name: "Badminton Set",
          description: "Kids badminton set with rackets and shuttle",
          price: 499,
          category: "Sports",
          image_url: "/images/badminton-set.jpg",
          age_range: "6-12",
          stock: 30
        },
        {
          name: "Skipping Rope",
          description: "Colorful skipping rope for exercise",
          price: 99,
          category: "Sports",
          image_url: "/images/skipping-rope.jpg",
          age_range: "5-12",
          stock: 50
        },
        {
          name: "Mini Basketball",
          description: "Small basketball for indoor play",
          price: 199,
          category: "Sports",
          image_url: "/images/mini-basketball.jpg",
          age_range: "6-12",
          stock: 35
        },
        {
          name: "Table Tennis Set",
          description: "Kids table tennis set for fun games",
          price: 399,
          category: "Sports",
          image_url: "/images/table-tennis-set.jpg",
          age_range: "8-12",
          stock: 20
        },
        {
          name: "Frisbee Disc",
          description: "Lightweight frisbee disc for outdoor fun",
          price: 149,
          category: "Sports",
          image_url: "/images/frisbee-disc.jpg",
          age_range: "5-12",
          stock: 60
        },
        {
          name: "Swimming Goggles",
          description: "Comfortable swimming goggles for kids",
          price: 249,
          category: "Sports",
          image_url: "/images/swimming-goggles.jpg",
          age_range: "6-12",
          stock: 28
        },
        {
          name: "Kids Football Jersey",
          description: "Colorful football jersey for young players",
          price: 349,
          category: "Sports",
          image_url: "/images/kids-football-jersey.jpg",
          age_range: "6-12",
          stock: 18
        },
        {
          name: "Roller Skates",
          description: "Adjustable roller skates for beginners",
          price: 799,
          category: "Sports",
          image_url: "/images/roller-skates.jpg",
          age_range: "8-12",
          stock: 12
        },

        // Costumes Category (10 items)
        {
          name: "Princess Dress-Up Set",
          description: "Complete princess costume with accessories",
          price: 999,
          category: "Costumes",
          image_url: "/images/princess-costume.jpg",
          age_range: "3-7",
          stock: 15
        },
        {
          name: "Superhero Cape & Mask",
          description: "Cape and mask set for superhero adventures",
          price: 399,
          category: "Costumes",
          image_url: "/images/superhero-cape-mask.jpg",
          age_range: "4-10",
          stock: 20
        },
        {
          name: "Pirate Costume",
          description: "Pirate outfit with hat and eyepatch",
          price: 599,
          category: "Costumes",
          image_url: "/images/pirate-costume.jpg",
          age_range: "5-10",
          stock: 12
        },
        {
          name: "Fairy Wings Set",
          description: "Sparkling fairy wings and wand",
          price: 349,
          category: "Costumes",
          image_url: "/images/fairy-wings-set.jpg",
          age_range: "3-8",
          stock: 18
        },
        {
          name: "Animal Onesie",
          description: "Soft animal onesie for dress-up",
          price: 799,
          category: "Costumes",
          image_url: "/images/animal-onesie.jpg",
          age_range: "3-8",
          stock: 10
        },
        {
          name: "Wizard Robe & Hat",
          description: "Magical wizard robe and hat",
          price: 699,
          category: "Costumes",
          image_url: "/images/wizard-robe-hat.jpg",
          age_range: "6-12",
          stock: 14
        },
        {
          name: "Astronaut Suit",
          description: "Space explorer costume for kids",
          price: 899,
          category: "Costumes",
          image_url: "/images/astronaut-suit.jpg",
          age_range: "6-12",
          stock: 8
        },
        {
          name: "Dinosaur Costume",
          description: "Roaring dinosaur outfit",
          price: 599,
          category: "Costumes",
          image_url: "/images/dinosaur-costume.jpg",
          age_range: "3-8",
          stock: 16
        },
        {
          name: "Chef Apron & Hat",
          description: "Mini chef apron and hat set",
          price: 299,
          category: "Costumes",
          image_url: "/images/chef-apron-hat.jpg",
          age_range: "4-10",
          stock: 20
        },
        {
          name: "Ballerina Tutu",
          description: "Pink ballerina tutu for dance lovers",
          price: 499,
          category: "Costumes",
          image_url: "/images/ballerina-tutu.jpg",
          age_range: "3-8",
          stock: 13
        }
      ];

      const stmt = db.prepare(`INSERT INTO products 
        (name, description, price, category, image_url, age_range, stock) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`);
      
      products.forEach(product => {
        stmt.run(
          product.name, 
          product.description, 
          product.price, 
          product.category, 
          product.image_url, 
          product.age_range, 
          product.stock
        );
      });
      
      stmt.finalize();
    }
  });
});

module.exports = db;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Temporary in-memory user storage for development
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // "password123"
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  }
];

// Helper function to find user
const findUser = async (email) => {
  return users.find(user => user.email === email);
};

// Helper function to find user by ID
const findUserById = async (id) => {
  return users.find(user => user.id === id);
};

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await findUser(email);
        if (!user) {
          return done(null, false, { message: 'No user found with this email' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
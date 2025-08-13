const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse('User already exists', 400));
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user' // Default to 'user' if role not specified
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    try {
        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Logout user
exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // 10 seconds
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
           success: true,
           token
       });
};
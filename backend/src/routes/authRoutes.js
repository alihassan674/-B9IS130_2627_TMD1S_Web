
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const { rateLimit } = require('express-rate-limit');

const router = express.Router();

// Limit repeated authentication requests
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    message:
      'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// Validate email format
const isValidEmail = (email) => {
  return (
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    // Validate field data types
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Name, email, and password must be valid text values',
      });
    }

    // Normalize name and email
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validate required fields
    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required',
      });
    }

    // Validate name length
    if (normalizedName.length > 100) {
      return res.status(400).json({
        message: 'Name must not exceed 100 characters',
      });
    }

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: 'Please enter a valid email address',
      });
    }

    // Validate minimum password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long',
      });
    }

    // Reject whitespace-only passwords
    if (!password.trim()) {
      return res.status(400).json({
        message: 'Password cannot contain only spaces',
      });
    }

    // Prevent bcrypt password truncation
    if (Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        message: 'Password must not exceed 72 UTF-8 bytes',
      });
    }

    // Check whether user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle duplicate email database errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists',
      });
    }

    next(error);
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // Validate field data types
    if (
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Email and password must be valid text values',
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Validate required fields
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: 'Please enter a valid email address',
      });
    }

    // Prevent bcrypt password truncation
    if (Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        message: 'Password must not exceed 72 UTF-8 bytes',
      });
    }

    // Explicitly include password for comparison
    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Compare submitted password with stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

module.exports = router;

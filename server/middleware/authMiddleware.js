import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';

/**
 * Protect middleware: Verifies JWT token and attaches user object to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'travellog_default_jwt_secret_dbs'
      );

      // Find user by decoded ID, excluding password hash
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User account no longer exists',
        });
      }

      return next();
    } catch (error) {
      console.error(`JWT Verification Error: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token verification failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No Bearer token provided in Authorization header',
    });
  }
};

/**
 * Rate Limiter for Authentication endpoints (OWASP ASVS & A07 Mitigation)
 * Limits IP to 10 authentication requests per 15 minutes window
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

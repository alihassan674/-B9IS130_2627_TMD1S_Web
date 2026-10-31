import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect, authLimiter } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply rate limiter, validation, and sanitization to registration
router.post(
  '/register',
  authLimiter,
  validateRegister,
  handleValidationErrors,
  registerUser
);

// Apply rate limiter, validation, and sanitization to login
router.post(
  '/login',
  authLimiter,
  validateLogin,
  handleValidationErrors,
  loginUser
);

// Protected endpoint to retrieve authenticated user's profile
router.get('/me', protect, getMe);

export default router;

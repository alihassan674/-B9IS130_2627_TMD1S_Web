const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Protect middleware ─────────────────────────────────────────
// Attach this to any route that requires the user to be signed in.
// It reads the JWT from the Authorization header, verifies it,
// and attaches the user document to req.user so route handlers
// can access it without hitting the database again.

const protect = async (req, res, next) => {
  let token;

  // JWT is sent as:  Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]; // extract the token part
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorised — no token provided' });
  }

  try {
    // Verify the token using the same secret that signed it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (without the password field) to the request object
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorised — user not found' });
    }

    next(); // token is valid — continue to the route handler
  } catch (error) {
    return res.status(401).json({ message: 'Not authorised — token invalid or expired' });
  }
};

module.exports = { protect };


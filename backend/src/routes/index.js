const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TravelLog API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;


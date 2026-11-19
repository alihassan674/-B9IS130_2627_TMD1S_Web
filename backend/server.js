
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const connectDB = require('./src/config/db');
const routes = require('./src/routes/index');
const authRoutes = require('./src/routes/authRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const journalRoutes = require('./src/routes/journalRoutes');
const photoRoutes = require('./src/routes/photoRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const publicRoutes = require('./src/routes/publicRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const HOST = isProduction
  ? '127.0.0.1'
  : '0.0.0.0';

// Trust only the local Nginx reverse proxy in production
if (isProduction) {
  app.set('trust proxy', 'loopback');
}

// ── Security middleware ─────────────────────────────────────

app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "data:", "https:", "http:"],
        upgradeInsecureRequests: isProduction
          ? []
          : null,
      },
    },
  })
);

// ── CORS configuration ──────────────────────────────────────

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Request body parser ─────────────────────────────────────

app.use(express.json({ limit: '100kb' }));

// ── API routes ──────────────────────────────────────────────

app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/journals', journalRoutes);
app.use('/api/journals/:entryId/photos', photoRoutes);
app.use('/api/trips/:tripId/expenses', expenseRoutes);
app.use('/api/public', publicRoutes);

// ── Unknown API route handler ───────────────────────────────

app.use('/api', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// ── Production frontend ─────────────────────────────────────

if (isProduction) {
  const frontendPath = path.resolve(
    __dirname,
    '../frontend/dist'
  );

  const indexPath = path.join(frontendPath, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error(
      'Frontend production build not found. Run npm run build inside the frontend folder.'
    );

    process.exit(1);
  }

  // Serve optimized React production files
  app.use(express.static(frontendPath));

  // Support React client-side navigation and public trip links
  app.get('/{*splat}', (req, res, next) => {
    if (!req.accepts('html') || path.extname(req.path)) {
      return next();
    }

    res.sendFile(indexPath);
  });
}

// ── General 404 handler ──────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// ── Global error handler ─────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status =
    Number.isInteger(err.status) &&
      err.status >= 400 &&
      err.status < 600
      ? err.status
      : 500;

  const message =
    status >= 500
      ? 'Internal server error'
      : err.message || 'Request failed';

  res.status(status).json({ message });
});

// ── Start server ─────────────────────────────────────────────

const start = async () => {
  await connectDB();

  app.listen(PORT, HOST, () => {
    console.log(
      `🚀 Server running on http://${HOST}:${PORT}`
    );

    console.log(
      `🌍 Environment: ${isProduction ? 'production' : 'development'}`
    );

    if (isProduction) {
      console.log('📦 Serving TravelLog production frontend');
    }
  });
};

start();

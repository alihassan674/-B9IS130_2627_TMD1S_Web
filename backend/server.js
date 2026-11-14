require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const routes = require('./src/routes/index');
const authRoutes = require('./src/routes/authRoutes');
const tripRoutes = require('./src/routes/tripRoutes')
const journalRoutes = require('./src/routes/journalRoutes')
const photoRoutes = require('./src/routes/photoRoutes')
const expenseRoutes = require('./src/routes/expenseRoutes')
const publicRoutes = require('./src/routes/publicRoutes')
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.disable('x-powered-by');

app.use(helmet());

app.use(cors());

app.use(express.json({ limit: '100kb' }));

// ── Routes ───────────────────────────────────────────────────
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes)
app.use('/api/trips/:tripId/journals', journalRoutes)
app.use('/api/journals/:entryId/photos', photoRoutes)
app.use('/api/trips/:tripId/expenses', expenseRoutes)
app.use('/api/public', publicRoutes)

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);

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
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();


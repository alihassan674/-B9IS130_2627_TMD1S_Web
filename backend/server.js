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

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

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
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// ── Start server ─────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();


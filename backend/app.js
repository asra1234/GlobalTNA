require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const errorHandler = require('./middleware/errorHandler');

function requireDatabaseConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database connection is not ready yet' });
  }

  next();
}

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      service: 'GlobalTNA backend',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    });
  });

  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    });
  });

  app.use('/api', requireDatabaseConnection);

  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
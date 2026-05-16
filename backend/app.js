require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
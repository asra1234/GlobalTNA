require('dotenv').config();
const mongoose = require('mongoose');
const createApp = require('./app');
const getMongoUri = require('./lib/getMongoUri');

const app = createApp();

const PORT = process.env.PORT || 5000;
const MONGO_URI = getMongoUri(process.env);

if (!MONGO_URI) {
  console.error('MongoDB connection error: MONGO_URI or MONGO_URL must be set for Railway deployments');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

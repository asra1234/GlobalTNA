require('dotenv').config();
const mongoose = require('mongoose');
const createApp = require('./app');
const getMongoUri = require('./lib/getMongoUri');

const app = createApp();

const PORT = process.env.PORT || 5000;
const MONGO_URI = getMongoUri(process.env);
const MONGO_RETRY_DELAY_MS = 5000;

if (!MONGO_URI) {
  console.error('MongoDB connection error: MONGO_URI or MONGO_URL must be set for Railway deployments');
  process.exit(1);
}

async function connectToMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log(`Retrying MongoDB connection in ${MONGO_RETRY_DELAY_MS / 1000} seconds...`);
    setTimeout(connectToMongo, MONGO_RETRY_DELAY_MS);
  }
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  connectToMongo();
});

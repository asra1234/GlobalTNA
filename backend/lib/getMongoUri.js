function isRailwayEnvironment(env) {
  return Boolean(env.RAILWAY_PROJECT_ID || env.RAILWAY_ENVIRONMENT_ID || env.RAILWAY_SERVICE_ID);
}

function getMongoUri(env = process.env) {
  if (env.MONGO_URI) {
    return env.MONGO_URI;
  }

  if (env.MONGO_URL) {
    return env.MONGO_URL;
  }

  if (isRailwayEnvironment(env)) {
    return null;
  }

  return 'mongodb://localhost:27017/globaltna';
}

module.exports = getMongoUri;
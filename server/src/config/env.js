const requiredVars = [
  'PORT', 'MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET',
  'AI_API_KEY', 'AI_API_URL', 'CLIENT_ORIGIN'
];

function loadEnv() {
  require('dotenv').config();
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return {
    port: parseInt(process.env.PORT, 10) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '7d',
    aiApiKey: process.env.AI_API_KEY,
    aiApiUrl: process.env.AI_API_URL,
    clientOrigin: process.env.CLIENT_ORIGIN,
  };
}

module.exports = loadEnv();
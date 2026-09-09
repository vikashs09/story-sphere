const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: process.env.PORT || 5000,

  mongoUri:
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/story_sphere",

  jwtSecret:
    process.env.JWT_SECRET,

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN || "7d",

  nodeEnv:
    process.env.NODE_ENV || "development"
};

if (!config.jwtSecret) {
  console.warn(
    "Warning: JWT_SECRET is not configured"
  );
}

module.exports = config;
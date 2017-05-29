const config = {};

config.redisStore = {
  url: process.env.REDIS_STORE_URI,
  secret: process.env.REDIS_STORE_SECRET
};

config.db = {
  url: process.env.DATABASE_URL
};

module.exports = config;

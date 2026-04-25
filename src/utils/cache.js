const { redisClient } = require("../config/redis");

const DEFAULT_TTL = 60 * 5; // 5 minutes

const getCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  await redisClient.setEx(key, ttl, JSON.stringify(value));
};

const deleteCache = async (key) => {
  await redisClient.del(key);
};

const deleteCacheByPattern = async (pattern) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

module.exports = { getCache, setCache, deleteCache, deleteCacheByPattern };

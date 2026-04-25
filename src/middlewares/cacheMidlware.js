const { getCache } = require("../utils/cache");

const cacheMiddleware = (key) => async (req, res, next) => {
  try {
    const cacheKey = typeof key === "function" ? key(req) : key;
    const cached = await getCache(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        data: cached,
      });
    }

    next();
  } catch (err) {
    // Cache failure should never block the request
    console.error("Cache middleware error:", err);
    next();
  }
};

module.exports = cacheMiddleware;

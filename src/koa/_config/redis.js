const redis = require("redis");
const logger = require('./log');
const redisClient = redis.createClient();
const isFunction = (func) => typeof func === 'function';
const noop = () => {};

redisClient.on("error", function(err) {
    logger.error("redis error " + err);
});

redisClient.on("connect", () => {
  logger.info("redis server started...");
});

redisClient.has = (key = '', cb = noop) => {
  return new Promise((resolve, reject) => {
    if (key) {
      return redisClient.get(key,  (err, res) => {
        if (err) logger.error(err);
        const result = res == null ? false : res;
        cb(result);
        resolve(result);
      });
    }
    cb(false);
    resolve(false);
  });
};

module.exports = redisClient;
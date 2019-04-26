var NodeCache = require('node-cache');
var cache = new NodeCache();

const ERROR = 'Key is not defined';

var Cache = function () { }

Cache.set = function (key, value, ttl) {
  if (!key) throw new Error(ERROR);
  ttl = ttl ? ttl : 0; // Default 0 means unlimited
  return cache.set(key, value, ttl);
}

Cache.get = function (key) {
  if (!key) throw new Error(ERROR);
  return cache.get(key);
}

Cache.clear = function (key) {
  if (!key) throw new Error(ERROR);
  return cache.del(key);
}

Cache.clearAll = function () {
  return cache.flushAll();
}

module.exports = Cache;
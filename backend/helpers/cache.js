const Redis = require('ioredis');
const { REDIS_URI } = process.env
const redis = new Redis(REDIS_URI);

module.exports = redis;
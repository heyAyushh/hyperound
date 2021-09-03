const Redis = require("ioredis");

class RedisStore {
    const noop = () => {}

    constructor(connectionURL, sessionTTL) {
      this.redis = new Redis(connectionURL)
      this.sessionTTL = sessionTTL ?? 86400 // 1 day in seconds
    }

    async function get(sessionId, session, callback = noop) {
      this.redis.get(sessionId, (err, data) => {
        if (err) {
          return callback(err)
        }

        if (!data) {
          return callback()
        }

        let result

        try {
          result = JSON.parse(data)
        } catch (err) {
          return callback(err)
        }

        return callback(null, result)
      })
    }

    async function set(sessionId, session, callback) {
      let value
      try {
        value = JSON.stringify(session)
      } catch (err) {
        return callback
      }
    }

    async function destroy(sessionId, session, callback = noop) {
      await this.redis.del(key, callback)
    }
}

module.exports = RedisStore

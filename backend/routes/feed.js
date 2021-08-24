const { Post } = require('../models/post.js')

module.exports = function (fastify, opts, done) {
    fastify.get('/feed/latest', {
    schema: {
      description: 'Fetch newest ten posts for home feed in chronological order',
      query: {
        type: 'object',
        properties: {
          date: {
            description: 'Get posts older than given date',
            type: 'string'
          }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'array'
        }
      }
    }
  }, async (request, reply) => {
    try {
      const feedQuery = await Post.find(
        {
          locked: false,
          updatedAt: { $lt: request.query.date ?? Date.now() }
        }, { __v: 0, 'favorites.users': 0})
        .sort({ updatedAt: 'desc' }).limit(10).lean()
      reply.send(feedQuery)
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  fastify.get('/feed/latest/polling', {
    schema: {
      description: 'Fetch the latest post after a point in time',
      query: {
        type: 'object',
        properties: {
          date: {
            type: 'string'
          }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            _id: { type: 'string' },
            locked: { type: 'boolean' },
            creator: { type: 'string' },
            text: { type: 'string' },
            content: { type: 'string' },
            contentType: { type: 'string' },
            favorites: {
              count: { type: 'number' }
            },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const feedQuery = await Post.findOne(
        {
          locked: false,
          updatedAt: { $gt: request.query.date  }
        }, { __v: 0, 'favorites.users': 0 })
        .sort({ updatedAt: 'desc' }).lean()
      reply.send(feedQuery)
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  fastify.get('/feed/trending', {
    schema: {
      description: 'Fetch top 10 trending posts in the past week',
      query: {
        type: 'object',
        properties: {
          date: {
            description: 'Get posts older than given date',
            type: 'string'
          }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'array'
        }
      }
    }
  }, async (request, reply) => {
    try {
      const feedQuery = await Post.find(
        {
          locked: false,
          updatedAt: { $lt: request.query.date ?? Date.now(), $gte: Date.now() - 604800000 } // last 1 week
        }, { __v: 0, 'favorites.users': 0 })
        .sort({ 'favorites.count': 'desc' }).limit(10).lean()
      reply.send(feedQuery)
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  done()
}

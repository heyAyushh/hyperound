const { Post } = require('../models/post.js')

module.exports = function (fastify, opts, done) {
  fastify.get('/feed', {
    schema: {
      description: 'Fetch newest posts for home feed in chronological order',
      query: {
        type: 'object',
        properties: {
          date: { type: 'string' }
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
        }, { __v: 0 })
        .sort({ updatedAt: 'desc' }).limit(10).lean()
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

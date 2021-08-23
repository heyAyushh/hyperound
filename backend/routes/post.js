const mongoose = require('mongoose')
const { Post } = require('../models/post.js')

module.exports = function (fastify, opts, done) {
  fastify.post('/post', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Create a new post in user-context',
      body: {
        type: 'object',
        required: ['creator'],
        properties: {
          creator: { type: 'string' },
          text: { type: 'string' },
          content: { type: 'string' },
          content_type: { type: 'string' },
          locked: {
            type: 'boolean',
            default: false
          },
        }
      },
      response: {
        201: {
          description: 'Successful response',
          type: 'object'
        }
      }
    }
  }, async (request, reply) => {
    try {
      if (request.body.creator !== request.session.user_id) {
        reply.code(403).send()
      }
      await Post.create({
        creator: mongoose.Types.ObjectId(request.body.creator),
        text: request.body.text,
        content: request.body.content,
        content_type: request.body.content_type,
        locked: request.body.locked
      })
      reply.code(201).send()
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  done()
}

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
          contentType: { type: 'string' },
          locked: {
            type: 'boolean',
            default: false
          }
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
      const newPost = await Post.create({
        creator: mongoose.Types.ObjectId(request.body.creator),
        text: request.body.text,
        content: request.body.content,
        contentType: request.body.contentType,
        locked: request.body.locked
      })
      reply.code(201).send({ _id: newPost._id })
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  fastify.patch('/favorite', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Toggles the favourite state on a post for a particular user',
      body: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object'
        }
      }
    }
  }, async (request, reply) => {
    try {
      const post = await Post.findOne({ _id: request.body.id })
      if (!post) {
        reply.code(404).send()
      } else {
        if (post.favorites.users.includes(request.session.user_id)) {
          await Post.updateOne(
            { _id: request.body.id },
            {
              $inc: { 'favorites.count': -1 },
              $pull: { 'favorites.users': request.session.user_id }
            })
        } else {
          await Post.updateOne(
            { _id: request.body.id },
            {
              $inc: { 'favorites.count': 1 },
              $push: { 'favorites.users': request.session.user_id }
            })
        }
      }
      reply.send()
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  done()
}

const mongoose = require('mongoose')
const { User } = require('../models/user.js')

module.exports = function (fastify, opts, done) {
  fastify.get('/profile/:userId', {
    schema: {
      description: 'Fetch a profile by user ID',
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            address: { type: 'string' },
            twitter: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                screen_name: { type: 'string' },
                verified: { type: 'string' }
              }
            },
            socials: {
              type: 'object',
              properties: {
                twitter: { type: 'string' },
                instagram: { type: 'string' },
                facebook: { type: 'string' },
                website: { type: 'string' }
              }
            },
            followers: {
              type: 'object',
              properties: {
                count: { type: 'number' },
                users: { type: 'array' }
              }
            },
            following: {
              type: 'object',
              properties: {
                count: { type: 'number' },
                users: { type: 'array' }
              }
            }
          }
        },
        404: {
          description: 'Profile does not exist',
          type: 'object'
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userQuery = await User.findOne(
        { _id: mongoose.Types.ObjectId(request.params.userId) },
        { __v: 0, 'followers.users': 0, 'following.users': 0 })
        .lean()
      if (!userQuery) {
        reply.code(404).send()
      } else {
        reply.send(userQuery)
      }
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  done()
}

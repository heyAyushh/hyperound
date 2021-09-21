const { User } = require('../models/user.js')

module.exports = function (fastify, opts, done) {
  fastify.patch('/profile', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Modify profile details in user context',
      body: {
        type: 'object',
        required: ['body'],
        properties: {
          body: { type: 'object' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object'
        },
        404: {
          description: 'Profile does not exist',
          type: 'object'
        }
      }
    }
  }, async (request, reply) => {
    try {
      if (request.body.userId !== String(request.session.user_id)) {
        reply.code(403).send()
        return
      }
      await User.findByIdAndUpdate(request.body.userId, request.body.body)
      if (!userQuery) {
        reply.code(404).send()
      } else {
        reply.send()
      }
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  fastify.get('/profile/id/:userId', {
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
      const userQuery = await User.findById(request.params.userId,
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

  fastify.get('/profile/name/:username', {
    schema: {
      description: 'Fetch a profile by username',
      params: {
        type: 'object',
        required: ['username'],
        properties: {
          username: { type: 'string' }
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
      const userQuery = await User.findOne({ username: request.params.username },
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

  fastify.post('/follow/:userId', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Follow a profile by user ID as a particular user',
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
          type: 'object'
        },
        404: {
          description: 'Profile does not exist',
          type: 'object'
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userQuery = await User.findById(request.params.userId, { followers: 1 }).lean()
      console.log(userQuery, !userQuery.followers.users.includes(String(request.session.user_id)))
      if (!userQuery) {
        reply.code(404).send()
        return
      } else {
        if (!userQuery.followers.users.includes(String(request.session.user_id))) {
          await User.findByIdAndUpdate(request.params.userId, {
            $inc: { 'followers.count': 1 },
            $push: { 'followers.users': request.session.user_id }
          })
          await User.findByIdAndUpdate(request.session.user_id, {
            $inc: { 'following.count': 1 },
            $push: { 'following.users': request.params.userId }
          })
        }
        reply.send()
      }
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  fastify.delete('/follow/:userId', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Unfollow a profile by user ID as a particular user',
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
          type: 'object'
        },
        404: {
          description: 'Profile does not exist',
          type: 'object'
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userQuery = await User.findById(request.params.userId, { followers: 1 }).lean()
      if (!userQuery) {
        reply.code(404).send()
        return
      } else {
        if (userQuery.followers.users.includes(String(request.session.user_id))) {
          await User.findByIdAndUpdate(request.params.userId, {
            $inc: { 'followers.count': -1 },
            $pull: { 'followers.users': request.session.user_id }
          })
          await User.findByIdAndUpdate(request.session.user_id, {
            $inc: { 'following.count': -1 },
            $pull: { 'following.users': request.params.userId }
          })
        }
        reply.send()
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

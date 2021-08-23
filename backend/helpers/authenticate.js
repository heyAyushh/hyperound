const fp = require("fastify-plugin")
const { User } = require('../models/user.js')

module.exports = fp(async function(fastify, opts) {
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      console.log(request.session.user_id)
      const userQuery = await User.findById(request.session.user_id)
      if (!userQuery) {
        throw new Error('Non-existent user / missing ID')
      }
    } catch (err) {
      console.log(err)
      fastify.log.error('❎ error:' + err)
      reply.code(403).send()
    }
  })
})

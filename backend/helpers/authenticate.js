const fp = require('fastify-plugin')
const { User } = require('../models/user.js')

// module.exports = fp(async function (fastify, opts) {
//   fastify.decorate('authenticate', async function (request, reply) {
//     try {
//       const user_id = request.session.get('user_id')
//       if (!user_id) {
//         throw new Error('Missing session')
//       }
//       const userQuery = await User.findById(user_id)
//       if (!userQuery) {
//         throw new Error('Non-existent user')
//       }
//     } catch (err) {
//       fastify.log.error('❎ error:' + err)
//       reply.code(403).send()
//     }
//   })
// })

module.exports = fp(async function (fastify, opts) {
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify()
      console.log('✅ JWT verified')
      const user_id = request.user.user_id;

      if (!user_id) {
        throw new Error('Missing user_id in jwt')
      }
      const userQuery = await User.findById(user_id)
      if (!userQuery) {
        throw new Error('Non-existent user')
      }
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      reply.code(403).send()
    }
  })
})
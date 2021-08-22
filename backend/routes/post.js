const mongoose = require('mongoose')
const { Post } = require('../models/post.js')

module.exports = function (fastify, opts, done) {
  fastify.post('/post', async (request, reply) => {//{ preHandler: [fastify.authenticate] }
    try {
      console.log(request.session)
      await Post.create({
        creator: mongoose.Types.ObjectId(request.body.creator),
        text: request.body.text,
        content: request.body.content,
        content_type: request.body.content_type,
        locked: request.body.locked
      })
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  done()
}

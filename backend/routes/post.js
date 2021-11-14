const mongoose = require('mongoose')
const { Post } = require('../models/post.js')
const { User } = require('../models/user.js')
const { uploadFileUrl, readFileUrl } = require('../helpers/hypeblobs.js')
const encodeImageToBlurhash = require('../helpers/blurhash.js')

module.exports = function (fastify, opts, done) {
  fastify.get('/posts', {
    // get all posts
  }, async (request, reply) => {
    try {
      const posts = await Post.find({}).populate('creator')
      reply.send(posts)
    } catch (err) {
      reply.code(500).send(err)
    }
  })

  fastify.get('/posts/user/:username', {
    preValidation: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const user = await User.findOne({ username: request.params.username })
      const posts = await Post.find({ creator: user._id })
      reply.send(posts)
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      };
    }
  })

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
      if (request.body.creator !== String(request.user.user_id)) {
        reply.code(403).send()
        return
      }
      // const blurhash = await encodeImageToBlurhash();
      // TODO @heyAyushh bhai isme url daal do
      // const blurhash = await encodeImageToBlurhash();

      const newPost = await Post.create({
        creator: mongoose.Types.ObjectId(request.body.creator),
        // featuring: request.body.featuring,
        // text: request.body.text,
        description: request.body.description,
        title: request.body.title,
        content: {
          url: request.body.content,
          // blurhash
        },
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

  fastify.get('/post/uploadUrl', {
    preValidation: [fastify.authenticate]
  }, async (req, reply) => {
    // get upload url for post
    try {
      const urlData = uploadFileUrl();
      if (urlData && urlData.error) {
        throw new Error(urlData.error)
      }
      reply.send(urlData)
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      reply.code(500).send(err)
    }
  })

  fastify.get('/post/readUrl/:contentId', {
    preValidation: [fastify.authenticate]
  }, async (req, reply) => {
    // get upload url for post
    try {
      const contentId = req.params.contentId
      const urlData = readFileUrl(contentId)
      reply.send(urlData)
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      reply.code(500).send(err)
    }
  })

  fastify.post('/favorite/:postId', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Adds favorite status on a post for a particular user',
      params: {
        type: 'object',
        required: ['postId'],
        properties: {
          postId: { type: 'string' }
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
      const post = await Post.findById(request.params.postId)
      if (!post) {
        reply.code(404).send()
        return
      } else {
        if (!post.favorites.users.includes(request.user.user_id)) {
          await Post.findByIdAndUpdate(request.params.postId, {
            $inc: { 'favorites.count': 1 },
            $push: { 'favorites.users': request.user.user_id }
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

  fastify.delete('/favorite/:postId', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Removes favorite status on a post for a particular user',
      params: {
        type: 'object',
        required: ['postId'],
        properties: {
          postId: { type: 'string' }
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
      const post = await Post.findById(request.params.postId)
      if (!post) {
        reply.code(404).send()
        return
      } else {
        if (post.favorites.users.includes(request.user.user_id)) {
          await Post.findByIdAndUpdate(request.params.postId, {
            $inc: { 'favorites.count': -1 },
            $pull: { 'favorites.users': request.user.user_id }
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

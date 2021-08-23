const nacl = require('tweetnacl')
const { nanoid } = require('nanoid')
const { User } = require('../models/user.js')
const { Challenge } = require('../models/challenge.js')

module.exports = function (fastify, opts, done) {
  fastify.get('/login/twitter/done', {
    schema: {
      description: 'Internal endpoint to handle OAuth callback data'
    }
  }, async (request, reply) => {
    try {
      const twitterResponse = request.session.grant.response
      const userQuery = await User.findOne(
        { 'twitter.id': twitterResponse.raw.user_id },
        { __v: 0, createdAt: 0, updatedAt: 0 })
        .lean()
      if (!userQuery) {
        const newUser = new User({
          twitter: {
            id: twitterResponse.raw.user_id,
            screen_name: twitterResponse.raw.screen_name,
            verified: twitterResponse.profile.verified
          }
        })
        const userObj = await newUser.save()
        request.session.user_id = userObj._id
      } else {
        request.session.user_id = userQuery._id
      }
      reply.send()
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  fastify.get('/login/wallet/challenge', {
    schema: {
      description: 'Get a new challenge for a wallet address',
      query: {
        type: 'object',
        required: ['address'],
        properties: {
          address: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            challenge: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      if (!/^([A-Za-z0-9]{44})$/.test(request.query.address)) {
        reply.code(400).send({ error: 'Invalid address sent' })
        return
      }
      const newChallenge = `Hey, please sign this to verify your address! ${await nanoid(8)}`
      const oldChallenge = await Challenge.findOne({ address: request.query.address })
      if (!oldChallenge) {
        await Challenge.create({
          address: request.query.address,
          challenge: newChallenge
        })
      } else {
        await Challenge.updateOne(
          { address: request.query.address },
          { challenge: newChallenge, updatedAt: Date.now() }
        )
      }
      reply.send({ challenge: newChallenge })
    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  fastify.post('/login/wallet/done', {
    schema: {
      description: 'Submit challenge signature for a wallet address',
      body: {
        type: 'object',
        required: ['address', 'signature'],
        properties: {
          address: { type: 'string' },
          signature: { type: 'array' }
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
      const challengeQuery = await Challenge.findOne({ address: request.body.address }).lean()
      if (!challengeQuery) {
        reply.code(400).send({ error: 'Non-existent challenge' })
        return
      }
      if (!nacl.sign.detached.verify(
        new TextEncoder().encode(challengeQuery.challenge),
        new Uint8Array(request.body.signature),
        new TextEncoder().encode(request.body.address)
      )) {
        reply.code(403).send({ error: 'Invalid signature for PubKey' })
        return
      }
      const userQuery = await User.findOne({ address: request.body.address }).lean()
      if (!userQuery) {
        const newUser = new User({
          address: request.body.address
        })
        const userObj = await newUser.save().lean()
        request.session.user_id = userObj._id
        reply.code(200).send(userObj)
      } else {
        request.session.user_id = userQuery._id
        reply.code(200).send(userQuery)
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

const nacl = require('tweetnacl')
const querystring = require('querystring')
const { nanoid } = require('nanoid')
const { User } = require('../models/user.js')
const { Challenge } = require('../models/challenge.js')
const { PublicKey } = require('@solana/web3.js')

module.exports = function (fastify, opts, done) {
  fastify.get('/login/twitter/done', {
    schema: {
      description: 'Internal endpoint to handle OAuth callback data',
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
        }
      }
    }
  }, async (request, reply) => {
    try {
      const twitterResponse = request.session.grant.response
      const userQuery = await User.findOne(
        { 'twitter.id': twitterResponse.raw.user_id },
        { __v: 0, updatedAt: 0 })
        .lean()
      if (!userQuery) {
        if (!request.session.user_id) {
          // if no user with twitter id and no current session with user_id, create a new account
          const newUser = new User({
            twitter: {
              id: twitterResponse.raw.user_id,
              screen_name: twitterResponse.raw.screen_name,
              verified: twitterResponse.profile.verified
            }
          })
          const userObj = await newUser.save()
          request.session.user_id = userObj._id
          const responseObj = { state: Buffer.from(JSON.stringify(userObj)).toString('base64'), twitter_auth: true }
          reply.redirect(`https://${process.env.DOMAIN || process.env.BASE_URL}/auth/twitter/done?${querystring.stringify(responseObj)}`)
        } else {
          // check if user_id exists
          const idQuery = await User.findById(request.session.user_id)
          if (!idQuery) {
            request.session.user_id = undefined // who is this?!
            reply.code(403).send()
            return
          }
          // user exists, connect account with twitter
          const updatedUser = await User.findByIdAndUpdate(request.session.user_id,
            { 'twitter.id': twitterResponse.raw.user_id }
          )
          request.session.touch()
          const responseObj = { state: Buffer.from(JSON.stringify(updatedUser)).toString('base64'), twitter_auth: true }
          reply.redirect(`https://${process.env.DOMAIN || process.env.BASE_URL}/auth/twitter/done?${querystring.stringify(responseObj)}`)
        }
      } else {
        // twitter id exists, log in
        request.session.user_id = userQuery._id
        const responseObj = { state: Buffer.from(JSON.stringify(userQuery)).toString('base64'), twitter_auth: true }
        reply.redirect(`https://${process.env.DOMAIN || process.env.BASE_URL}/auth/twitter/done?${querystring.stringify(responseObj)}`)
      }
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
      const pubKeyBytes = new PublicKey(request.body.address).toBytes()
      if (!nacl.sign.detached.verify(
        new TextEncoder().encode(challengeQuery.challenge),
        new Uint8Array(request.body.signature),
        pubKeyBytes
      )) {
        reply.code(403).send({ error: 'Invalid signature for PubKey' })
        return
      }
      const userQuery = await User.findOne({ address: request.body.address }).lean()
      if (!userQuery) {
        if (!request.session.user_id) {
          // if no user with address and no current session with user_id, create a new account
          const newUser = new User({
            address: request.body.address
          })
          const userObj = await newUser.save()
          request.session.user_id = userObj._id
          reply.send(userObj)
        } else {
          // check if user_id is valid
          const idQuery = await User.findById(request.session.user_id)
          if (!idQuery) {
            request.session.user_id = undefined // who is this?!
            reply.code(403).send()
            return
          }
          // user exists, connect wallet to account
          const updatedUser = await User.findByIdAndUpdate(request.session.user_id,
            { address: request.body.address }
          )
          request.session.touch()
          reply.send(updatedUser)
        }
      } else {
        // user exists, login with wallet
        request.session.user_id = userQuery._id
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

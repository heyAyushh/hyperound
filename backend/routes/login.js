const nacl = require('tweetnacl')
const querystring = require('querystring')
const { nanoid } = require('nanoid')
const { User } = require('../models/user.js')
const { Challenge } = require('../models/challenge.js')
const { PublicKey } = require('@solana/web3.js')

module.exports = function (fastify, opts, done) {
  fastify.post('/login/twitter/done', {
    schema: {
      description: 'Endpoint to receive Twitter data',
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
          request.session.set('user_id', userObj)
          const responseObj = { state: Buffer.from(JSON.stringify(userObj)).toString('base64'), twitter_auth: true }
          reply.send(responseObj)
        } else {
          // check if user_id exists
          const idQuery = await User.findById(request.session.get('user_id'))
          if (!idQuery) {
            request.session.delete()   // who is this?!
            reply.code(404).send({ error: 'User not found' })
          }
          // user exists, connect account with twitter
          const updatedUser = await User.findByIdAndUpdate(request.session.get('user_id'),
            { 'twitter.id': twitterResponse.raw.user_id }
          )
          request.session.touch()
          const responseObj = { state: Buffer.from(JSON.stringify(updatedUser)).toString('base64'), twitter_auth: true }
          reply.send(responseObj)
        }
      } else {
        // twitter id exists, log in
        request.session.set('user_id', userQuery)
        const responseObj = { state: Buffer.from(JSON.stringify(userQuery)).toString('base64'), twitter_auth: true }
        reply.send(responseObj)
      }
    } catch (err) {
      fastify.log.error('??? error:' + err)
      if (!reply.sent) {
        reply.statusCode = 400
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
      // if (!/^([A-Za-z0-9]{44})$/.test(request.query.address)) {
      //   reply.code(400).send({ error: 'Invalid address sent' })
      //   return
      // }
      const newChallenge = `Hey,\n please sign this message ${await nanoid(8)} &\n verify your connection to Hyperound!`
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
      fastify.log.error('??? error:' + err)
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
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                username: { type: 'string' },
                address: { type: 'string' },
                isCreator: { type: 'boolean' },
                avatar: { type: 'string' },
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
            token: {
              type: 'string'
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
        // if no user with address, create a new account
        const newUser = new User({
          address: request.body.address
        })
        const userObj = await newUser.save()
        const token = fastify.jwt.sign({
          user_id: userObj._id,
          isCreator: userObj.isCreator
        })

        reply.send({
          user: userQuery,
          token
        })
      } else {
        // user exists, login with wallet
        const token = fastify.jwt.sign({
          user_id: userQuery._id,
          isCreator: userQuery.isCreator
        })

        reply.send({
          user: userQuery,
          token
        })
      }
    } catch (err) {
      console.log(err)
      fastify.log.error('??? error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  done()
}

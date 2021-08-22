require('dotenv').config()
// const axios = require('axios')
const fastify = require('fastify')({ logger: true })
// const oauthPlugin = require('fastify-oauth2')
const grant = require('grant').fastify()
const mongoose = require('mongoose')
const { nacl } = require('tweetnacl')
const { nanoid } = require('nanoid')
const { User } = require('./models/user.js')
const { Challenge } = require('./models/challenge.js')

fastify
  .register(require('fastify-cookie'))
  .register(require('fastify-session'),
    {
      secret: process.env.COOKIE_KEY,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 604800,
        sameSite: 'Lax',
        domain: process.env.DOMAIN,
      }
    })
  .register(grant({
    defaults: {
      origin: process.env.BASE_URL,
      transport: 'session',
      state: true,
      prefix: '/login'
    },
    twitter: {
      key: process.env.TWITTER_API_KEY,
      secret: process.env.TWITTER_API_SECRET_KEY,
      callback: '/login/twitter/done',
      response: ['tokens', 'raw', 'profile']
    }
  }))

fastify.register(require('fastify-cors'), {
  origin: [process.env.BASE_URL, process.env.DOMAIN],
  credentials: true
})

fastify.get('/', async (request, reply) => {
  reply.send('Hyperound API')
})

fastify.get('/login/twitter/done', async (request, reply) => {
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
    request.session.user = { id: userObj._id }
  } else {
    request.session.user = { id: userQuery._id }
  }
  reply.send()
})

fastify.get('/login/wallet/challenge', async (request, reply) => {
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
      reply.sendStatus(400)
    }
  }
})

fastify.get('/login/wallet/done', async (request, reply) => {
  try {
    const challengeQuery = await Challenge.findOne({ address: request.body.address }).lean()
    if (!challengeQuery) {
      reply.code(400).send({ error: 'Non-existent challenge' })
      return
    }
    if (!nacl.sign.detached.verify(
      challengeQuery.challenge,
      request.body.signature,
      challengeQuery.address
    )) {
      reply.code(403).send({ error: 'Invalid signature for PubKey' })
      return
    }
    const userQuery = await User.findOne({ address: request.body.address }).lean()
    request.session.user = { id: userQuery._id }
    reply.sendStatus(200)
  } catch (err) {
    fastify.log.error('❎ error:' + err)
    if (!reply.sent) {
      reply.sendStatus(400)
    }
  }
})

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('⌛️ DB connection established...')
    await fastify.listen(process.env.PORT || 3000, function (err, address) {
      if (err) {
        throw err
      }
      console.log(`🚀 Server listening on ${address}...`)
    })
  } catch (err) {
    console.error('❎ error:', err)
    process.exit(1)
  }
}

start()

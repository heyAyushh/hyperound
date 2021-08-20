require('dotenv').config()
// const axios = require('axios')
const fastify = require('fastify')({ logger: true })
// const oauthPlugin = require('fastify-oauth2')
const grant = require('grant').fastify()
const mongoose = require('mongoose')
const { User } = require('./models/user.js')

fastify
  .register(require('fastify-cookie'))
  .register(require('fastify-session'),
    {
      secret: process.env.COOKIE_KEY,
      cookie: { secure: false, maxAge: 604800 }
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
  origin: process.env.BASE_URL,
  credentials: true
})

fastify.get('/', async (request, reply) => {
  reply.send('Team-Undefined API')
})

fastify.get('/login/twitter/done', async (request, reply) => {
  const twitterResponse = request.session.grant.response
  const userQuery = await User.findOne(
    { "twitter.id": twitterResponse.raw.user_id },
    { __v:0, createdAt: 0, updatedAt: 0 })
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

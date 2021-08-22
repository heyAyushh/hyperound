require('dotenv').config()
// const axios = require('axios')
const fastify = require('fastify')({ logger: true })
// const oauthPlugin = require('fastify-oauth2')
const grant = require('grant').fastify()
const mongoose = require('mongoose')

fastify
  .register(require('fastify-cookie'))
  .register(require('fastify-session'),
    {
      secret: process.env.COOKIE_KEY,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 604800,
        sameSite: 'Lax',
        domain: process.env.DOMAIN
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

fastify.register(require('./routes/login'))

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

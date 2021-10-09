require('dotenv').config()
// const axios = require('axios')
const fastify = require('fastify')({ logger: true })
// const oauthPlugin = require('fastify-oauth2')
const grant = require('grant').fastify()
const mongoose = require('mongoose')
const Redis = require('ioredis')
const fastifyCaching = require('fastify-caching')

const { IS_PROD, IS_TEST, REDIS_URI, SESSION_TTL = 604800 } = process.env

fastify
  .register(
    fastifyCaching,
    { privacy: fastifyCaching.privacy.NOCACHE },
    (err) => { if (err) throw err }
  )
  .register(require('fastify-cookie'))
  .register(require('@fastify/session'),
    {
      secret: process.env.COOKIE_KEY,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: SESSION_TTL,
        sameSite: 'Lax',
        domain: process.env.DOMAIN
      },
      store: new Redis(REDIS_URI)
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
  origin: '*',
  credentials: true
})

fastify.register(require('fastify-swagger'), {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Hyperound API Swagger',
      description: 'Hyperound Swagger UI',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://hyperound.com/api'
    },
    host: process.env.SWAGGER_HOST,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  uiConfig: {
    docExpansion: 'none',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true
})

fastify.register(require('fastify-multipart'), {
  // limits: {
  //   fieldNameSize: 100, // Max field name size in bytes
  //   fieldSize: 100,     // Max field value size in bytes
  //   fields: 10,         // Max number of non-file fields
  //   fileSize: 1000000,  // For multipart forms, the max file size in bytes
  //   files: 1,           // Max number of file fields
  //   headerPairs: 2000   // Max number of header key=>value pairs
  // }
})

fastify.get('/', async (request, reply) => {
  reply.send('Hyperound API')
})

fastify.register(require('./helpers/authenticate'))
fastify.register(require('./routes/login'))
fastify.register(require('./routes/post'))
fastify.register(require('./routes/feed'))
fastify.register(require('./routes/profile'))

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

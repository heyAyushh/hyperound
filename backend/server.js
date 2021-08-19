require('dotenv').config()
const axios = require('axios')
const fastify = require('fastify')({ logger: true })
const oauthPlugin = require('fastify-oauth2')
const grant = require('grant').fastify()

fastify
  .register(require('fastify-cookie'))
  .register(require('fastify-session'), { secret: process.env.COOKIE_KEY, cookie: { secure: false } })
  .register(grant({
    defaults: {
      origin: 'http://localhost:3000',
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
  origin: 'http://localhost:3000',
  credentials: true
})

fastify.get('/', async (request, reply) => {
  reply.send('Team-Undefined API')
})

fastify.get('/login/twitter/done', async (request, reply) => {
  console.log(request.session.grant.response)
  reply.send()
})


const start = async () => {
  try {
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

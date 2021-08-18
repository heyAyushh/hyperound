require('dotenv').config()
const axios = require('axios')
const fastify = require('fastify')({ logger: true })
const fastifyPassport = require('fastify-passport')
const fastifySecureSession = require('fastify-secure-session')
const oauthPlugin = require('fastify-oauth2')
const TwitterStrategy = require('passport-twitter')

fastify.register(fastifySecureSession, { key: process.env.SESSION_KEY })
fastify.register(fastifyPassport.initialize())
fastify.register(fastifyPassport.secureSession())

fastifyPassport.use('twitter', new TwitterStrategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET_KEY,
    callbackURL: `http://localhost:${process.env.port || 3000}/login/twitter/callback`
  },
  async function(token, tokenSecret, profile, callback) {
    return callback;
  }
));

fastify.get('/', async (request, reply) => {
    reply.send('Team-Undefined API')
})

fastify.get('/login/twitter', fastifyPassport.authenticate('twitter'))

fastify.get('/login/twitter/callback',
  { preValidation: fastifyPassport.authenticate('twitter', { failureRedirect: '/login' }) },
  async (request, reply) => {
    reply.send()
})


const start = async() => {
  try {
    await fastify.listen(process.env.PORT || 3000, function (err, address) {
      if (err) {
        throw err
      }
      console.log(`🚀 Server listening on ${address}...`)
    })
  } catch(err) {
    console.error('❎ error:', err)
    process.exit(1)
  }
}

start()

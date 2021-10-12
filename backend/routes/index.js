module.exports = async (fastify, opts, done) => {
	fastify.register(require('./login'))
	fastify.register(require('./post'))
	fastify.register(require('./feed'))
	fastify.register(require('./profile'))
	done()
}

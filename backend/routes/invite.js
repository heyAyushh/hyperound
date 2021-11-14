const { nanoid } = require('nanoid');
const { Invite } = require('../models/invite.js');
const { User } = require('../models/user.js');

module.exports = function (fastify, opts, done) {
  // check validity of invite code
  // and make creator if valid code
  fastify.get('/invite/:code', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'verify invite code and redeem in context',
      params: {
        type: 'object',
        properties: {
          code: {
            description: 'invite code',
            type: 'string'
          }
        }
      },
      response: {
        200: {
          description: 'Congratulations! Welcome to Hyperound Creators!',
          type: 'object',
          properties: {
            text: {
              type: 'string'
            },
            type: {
              type: 'string'
            }
          }
        },
        400: {
          description: 'Bad request!',
          type: 'object'
        },
        401: {
          description: 'Unauthorized! Log In first!',
          type: 'object'
        },
        404: {
          description: 'Bad request! Invite code not found!',
          type: 'object'
        }
      }
    }
  }, async (request, reply) => {
    try {
      if (!String(request.user.user_id)) {
        reply.code(403).send({
          text: 'User JWT not found!',
          type: 'error'
        })
      }

      if (request.params && request.params.code) {
        const code = request.params.code.toUpperCase();

        // find invite
        const invite = await Invite.findOne({ code });

        // update isCreator if invite found and number!=0
        if (invite && invite.redeems && invite.redeems.number && code.length === 7) {
          const number = invite.number - 1;
          const user = request.user.user_id;

          const redeemed_by =  invite.redeems && invite.redeems.redeemed_by ? invite.redeems.redeemed_by : [];

          await Invite.findOneAndUpdate({ code }, {
            reedeems: {
              number,
              redeemed_by: redeemed_by.push({
                user,
                date: new Date()
              })
            }
          });

          await User.findOneAndUpdate({ _id: user }, {
            isCreator: true,
            invitedBy: invite.creator
          });

          reply.code(200).send({
            text: 'Congratulations! Welcome to Hyperound Creators!',
            type: 'success'
          });
        } else {
          console.log({ invite, code })
          reply.code(400).send({
            text: 'Bad request! Invite code not found!',
            type: 'error'
          })
        }
      } else {
        reply.code(400).send({
          text: 'Bad request! Send code',
          type: 'error'
        })
      }

    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send({
          text: 'Bad request!',
          type: 'error'
        })
      }
    }
  })

  // create invites
  fastify.post('/invite', {
    // preValidation: [fastify.authenticate],
    schema: {
      description: 'Create Invite, DEV MODE',
      type: 'object',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            text: { type: 'string' },
            type: { type: 'string' },
            data: { type: 'string' }
          }
        },
        400: {
          description: 'Bad request!',
          type: 'object'
        },
        401: {
          description: 'Unauthorized! Log In first!',
          type: 'object'
        },
        404: {
          description: 'Bad request! Invite code not found!',
          type: 'object'
        }
      }
    }
  }, async (request, reply) => {
    try {

      // DEV MODE ONLY
      if (process.env.NODE_ENV === 'production') {
        reply.code(403).send({
          text: 'Forbidden!',
          type: 'error'
        })
        return
      }

      const code = nanoid(7).toUpperCase();

      // const user_id = request.session.get('user_id');
      // hyperound account user_id for now
      const user_id = '61340274bc6058cb2e7dcc04';
      const user = await User.findOne({ _id: user_id });

      if (!user.isCreator) {
        await User.findOneAndUpdate({ _id: user }, {
          isCreator: true,
          invitedBy: '61340274bc6058cb2e7dcc04'
        });
      }

      const invite = await Invite.create({
        code,
        creator: user_id,
        redeems: {
          number: 4,
          reedemed_by: [{
            user: user_id,
            date: new Date(),
          }]
        }
      });

      reply.send({
        text: 'Invite created!',
        type: 'success',
        data: invite.code
      });

    } catch (err) {
      fastify.log.error('❎ error:' + err)
      if (!reply.sent) {
        reply.code(400).send()
      }
    }
  })

  done()
}

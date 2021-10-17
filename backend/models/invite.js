const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const inviteSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: nanoid
  },
  creator: {
    type: String,
    ref: 'User'
  },
  redeems: {
    number: {
      type: Number,
      default: 1
    },
    reedemed_by: [{
      user: {
        type: String,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
  },
}, {
  timestamps: true
});

const Invite = mongoose.model('Invite', inviteSchema)

module.exports = { Invite }

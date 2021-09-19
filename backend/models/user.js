const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    default: nanoid(8)
  },
  address: {
    type: String
  },
  twitter: {
    id: String,
    screen_name: String,
    verified: Boolean
  },
  socials: {
    twitter: String,
    instagram: String,
    facebook: String,
    website: String
  },
  followers: {
    count: {
      type: Number,
      required: true,
      default: 0
    },
    users: {
      type: [String],
      required: true,
      default: []
    }
  },
  following: {
    count: {
      type: Number,
      required: true,
      default: 0
    },
    users: {
      type: [String],
      required: true,
      default: []
    }
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = { User }

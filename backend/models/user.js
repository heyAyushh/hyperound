const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    default: nanoid
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200
  },
  avatar: {
    url: String,
    // default: `${process.env.AVATAR_URL}/pixel-art-neutral/${nanoid(12)}.svg`
  },
  cover: {
    type: String
  },
  address: {
    type: String
  },
  token: {
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

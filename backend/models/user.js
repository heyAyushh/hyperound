const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    default: nanoid(8)
  },
  address: {
    type: String,
    unique: true
  },
  twitter: {
    id: {
      type: String,
      unique: true
    },
    screen_name: String,
    verified: Boolean
  },
  socials: {
    twitter: String,
    instagram: String,
    facebook: String,
    website: String
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = { User }

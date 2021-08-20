const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
    unique: true,
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

module.exports = { User: new mongoose.model('User', userSchema) }

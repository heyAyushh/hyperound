const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true
  },
  challenge: {
    type: String,
    unique: true
  },
  updatedAt: {
    type: Date,
    expires: 300,
    default: Date.now
  }
})

const Challenge = mongoose.model('Challenge', challengeSchema)

module.exports = { Challenge }

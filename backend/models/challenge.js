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

module.exports = { Challenge: new mongoose.model('Challenge', challengeSchema) }

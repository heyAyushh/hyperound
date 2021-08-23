const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.ObjectId,
    required: true
  },
  text: String,
  content: String,
  contentType: {
    type: String,
    enum: ['image', 'embed']
  },
  favorites: {
    count: {
      type: Number,
      default: 0
    },
    users: {
      type: [String],
      default: []
    }
  },
  locked: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = { Post }

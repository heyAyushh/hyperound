const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.ObjectId,
    required: true
  },
  text: String,
  content: String,
  content_type: {
    type: String,
    enum: ['image', 'embed']
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

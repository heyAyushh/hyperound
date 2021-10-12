const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  featuring: [{
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  }],
  text: String,
  title: String,
  description: String,
  content: {
    url: {
      type: String
    },
    blurhash: {
      type: String
    }
  },
  contentType: {
    type: String,
    enum: ['image', 'embed', 'video', 'text']
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

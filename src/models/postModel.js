const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5 
  },
  content: {
    type: String,
    required: true,
    minlength: 20 
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [String], 
  imageUrl: {
    type: String, 
    default: '' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
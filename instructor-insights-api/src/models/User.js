const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'users' // Explicitly set collection name
});

module.exports = mongoose.model('User', userSchema);
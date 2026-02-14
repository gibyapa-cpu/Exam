const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'courses' // Explicitly set collection name
});

// Add index for better performance
courseSchema.index({ instructorId: 1 });

module.exports = mongoose.model('Course', courseSchema);
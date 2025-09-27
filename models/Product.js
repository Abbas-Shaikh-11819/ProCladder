const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxLength: 200
  },
  image: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['exterior-cladding', 'interior-cladding', 'commercial', 'residential', 'industrial'],
    required: true
  },
  features: [{
    type: String
  }],
  specifications: [{
    name: String,
    value: String
  }],
  isUpcoming: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
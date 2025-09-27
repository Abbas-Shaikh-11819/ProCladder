const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    enum: ['exterior-cladding', 'interior-cladding', 'commercial', 'residential', 'consultation', 'other'],
    required: true
  },
  message: {
    type: String,
    required: true,
    maxLength: 1000
  },
  budget: {
    type: String,
    enum: ['under-50k', '50k-100k', '100k-500k', '500k+', 'not-specified']
  },
  timeline: {
    type: String,
    enum: ['immediate', '1-3-months', '3-6-months', '6-12-months', 'flexible']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'converted', 'closed'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);

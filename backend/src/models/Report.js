const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: { type: String, required: true },
  description: { type: String, required: true },
  firstNoticed: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  pestControlAction: {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    actionTaken: String,
    comments: String,
    success: Boolean,
    completedAt: Date
  },
  images: [String] // Optional: for storing image URLs
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);

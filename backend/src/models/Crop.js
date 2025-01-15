const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  plantingDate: { 
    type: Date, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['growing', 'harvested', 'failed'],
    default: 'growing'
  },
  pests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pest'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
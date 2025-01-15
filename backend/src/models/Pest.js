const mongoose = require('mongoose');

const controlMethodSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true
  },
  description: String,
  effectiveness: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  applicationFrequency: String,
  precautions: [String]
});

const pestSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  scientificName: String,
  description: String,
  affectedCrops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  }],
  symptoms: [String],
  controlMethods: [controlMethodSchema],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Pest', pestSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['farmer', 'pestcontrol', 'admin'],
    required: true 
  },
  farmLocation: { 
    type: String, 
    required: function() { return this.role === 'farmer'; }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for farmer's crops
userSchema.virtual('crops', {
  ref: 'Crop',
  localField: '_id',
  foreignField: 'farmerId'
});

// Virtual populate for pest control agent's managed pests
userSchema.virtual('pestsManaged', {
  ref: 'Pest',
  localField: '_id',
  foreignField: 'addedBy'
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
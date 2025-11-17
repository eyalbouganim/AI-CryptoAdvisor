const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  assetsInterest: {
    type: [String],
    default: [],
  },
  investorType: {
    type: String,
    enum: ['HODLer', 'Day Trader', 'NFT Collector', ''],
    default: '',
  },
  contentPreferences: {
    type: String,
    enum: ['Market News', 'Charts', 'Social', 'Fun', ''],
    default: '',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
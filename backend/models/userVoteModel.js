const mongoose = require('mongoose');

const userVoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  componentName: {
    type: String,
    required: true,
    enum: ['CoinPrices', 'MarketNews', 'InsightAI', 'FunCryptoMeme'],
  },
  vote: {
    type: String,
    required: true,
    enum: ['up', 'down'],
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, {
  timestamps: true,
});

const UserVote = mongoose.model('UserVote', userVoteSchema);

module.exports = UserVote;

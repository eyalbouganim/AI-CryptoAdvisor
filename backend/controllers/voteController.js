const UserVote = require('../models/userVoteModel');

// @desc    Submit a vote for a component
// @route   POST /api/votes
// @access  Private
const submitVote = async (req, res) => {
  const { componentName, vote, content } = req.body;

  if (!componentName || !vote || !content) {
    return res.status(400).json({ message: 'Missing required vote data.' });
  }

  try {
    const newVote = new UserVote({
      user: req.user.id,
      componentName,
      vote,
      content,
    });

    await newVote.save();
    res.status(201).json({ message: 'Vote submitted successfully.', vote: newVote });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ message: 'Server error while submitting vote.' });
  }
};

module.exports = { submitVote };

const User = require('../models/userModel');

// @desc    Update user preferences after onboarding
// @route   PUT /api/users/onboarding
// @access  Private
const updateUserOnboarding = async (req, res) => {
  const { userPreferences } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        userPreferences: {
          assetsInterest: userPreferences.assetsInterest,
          investorType: userPreferences.investorType,
          contentPreferences: userPreferences.contentPreferences,
        },
        hasCompletedOnboarding: true,
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating preferences.' });
  }
};

module.exports = { updateUserOnboarding };
const express = require('express');
const router = express.Router();
const { updateUserOnboarding } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Update user onboarding status
router.put('/onboarding', protect, updateUserOnboarding);

module.exports = router;

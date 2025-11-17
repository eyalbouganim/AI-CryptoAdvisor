const express = require('express');
const router = express.Router();
const { updateUserOnboarding } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/onboarding', protect, updateUserOnboarding);

module.exports = router;

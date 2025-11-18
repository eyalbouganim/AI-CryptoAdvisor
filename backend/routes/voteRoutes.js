const express = require('express');
const router = express.Router();
const { submitVote } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.post('/', protect, submitVote);

module.exports = router;

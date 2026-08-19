const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { getMatchForInternship } = require('../controllers/matchController');

router.get('/:internshipId', protect, authorize('student'), getMatchForInternship);

module.exports = router;
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { createProfile, addSkill, getMyPassport } = require('../controllers/studentController');

router.post('/profile', protect, authorize('student'), createProfile);
router.post('/skill', protect, authorize('student'), addSkill);
router.get('/passport', protect, authorize('student'), getMyPassport);

module.exports = router;

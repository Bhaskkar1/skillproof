const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { getPendingVerifications, updateVerificationStatus } = require('../controllers/issuerController');

router.get('/pending', protect, authorize('issuer'), getPendingVerifications);
router.patch('/verify/:studentSkillId', protect, authorize('issuer'), updateVerificationStatus);

module.exports = router;
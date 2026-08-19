const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { createInternship, getMyInternships, getAllInternships } = require('../controllers/employerController');
const { getCandidatesForInternship } = require('../controllers/matchController');

router.post('/internship', protect, authorize('employer'), createInternship);
router.get('/my-internships', protect, authorize('employer'), getMyInternships);
router.get('/internships', getAllInternships); // public browsing, no auth needed
router.get('/candidates/:internshipId', protect, authorize('employer'), getCandidatesForInternship);

module.exports = router;
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createProject, getMyProjects, getRecommendations } = require('../controllers/teamController');

router.post('/project', protect, createProject);
router.get('/projects', protect, getMyProjects);
router.get('/project/:projectId/recommend', protect, getRecommendations);

module.exports = router;
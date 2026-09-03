const express = require('express');
const router = express.Router();
const intelligenceController = require('../controllers/intelligenceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// What-If Simulation
router.post('/simulate', intelligenceController.simulateScenario);

// Scenario Recommendations
router.get('/recommend/:trialId', intelligenceController.getScenarioRecommendations);

module.exports = router;

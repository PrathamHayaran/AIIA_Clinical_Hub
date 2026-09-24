const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const intelligenceController = require('../controllers/intelligenceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

router.post('/copilot', authMiddleware, aiController.copilotChat);
router.get('/status', authMiddleware, aiController.getAIStatus);
router.post('/config', authMiddleware, roleGuard(['ADMIN']), aiController.updateAIConfig);
router.get('/risk/:trialId', authMiddleware, aiController.getTrialDiagnosis);

// "Why?" AI Root Cause Explainability
router.post('/why', authMiddleware, intelligenceController.getAIWhyExplanation);

// Executive AI Briefing
router.post('/briefing', authMiddleware, intelligenceController.getExecutiveBriefing);
router.get('/briefing', authMiddleware, intelligenceController.getExecutiveBriefing);

module.exports = router;

const express = require('express');
const router = express.Router();
const intelligenceController = require('../controllers/intelligenceController');
const authMiddleware = require('../middleware/authMiddleware');

// All intelligence endpoints are protected with authentication
router.use(authMiddleware);

// 1. Trial Health
router.get('/trial/:id/health', intelligenceController.getTrialHealth);

// 2. Predictive Delay & Trajectory
router.get('/trial/:id/prediction', intelligenceController.getTrialPrediction);

// 3. Root Cause & "Why?" Diagnosis
router.get('/trial/:id/root-cause', intelligenceController.getTrialRootCause);

// 4. Site Risk Contribution per Trial
router.get('/trial/:id/site-risk', intelligenceController.getTrialSiteRisk);

// 5. Portfolio Intelligence
router.get('/portfolio', intelligenceController.getPortfolioIntelligence);

// 6. Network Site Intelligence
router.get('/sites', intelligenceController.getSiteNetworkIntelligence);

module.exports = router;

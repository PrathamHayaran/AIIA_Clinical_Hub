const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, analyticsController.getDashboardMetrics);
router.get('/cross-trial', authMiddleware, analyticsController.getCrossTrialAnalytics);

module.exports = router;

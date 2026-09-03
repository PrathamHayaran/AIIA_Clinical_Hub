const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const trialRoutes = require('./trialRoutes');
const recruitmentRoutes = require('./recruitmentRoutes');
const safetyRoutes = require('./safetyRoutes');
const complianceRoutes = require('./complianceRoutes');
const siteRoutes = require('./siteRoutes');
const alertRoutes = require('./alertRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const aiRoutes = require('./aiRoutes');
const intelligenceRoutes = require('./intelligenceRoutes');
const scenarioRoutes = require('./scenarioRoutes');
const actionCenterRoutes = require('./actionCenterRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AIIA Clinical Trial Hub REST API is active and operational.',
    version: '2.0.0-Intelligence',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date(),
  });
});

router.use('/auth', authRoutes);
router.use('/trials', trialRoutes);
router.use('/recruitment', recruitmentRoutes);
router.use('/safety', safetyRoutes);
router.use('/compliance', complianceRoutes);
router.use('/sites', siteRoutes);
router.use('/alerts', alertRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/intelligence', intelligenceRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/action-center', actionCenterRoutes);

module.exports = router;

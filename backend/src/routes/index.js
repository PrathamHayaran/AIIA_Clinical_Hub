const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
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
const consultationRoutes = require('./consultationRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const staffGuard = require('../middleware/staffGuard');

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

// Authentication routes (accessible to all)
router.use('/auth', authRoutes);

// Dedicated Patient Portal routes (internally uses authMiddleware + patientGuard)
router.use('/patient', patientRoutes);

// Staff / Researcher / Admin routes (protected by authMiddleware + staffGuard)
router.use('/trials', authMiddleware, staffGuard, trialRoutes);
router.use('/recruitment', authMiddleware, staffGuard, recruitmentRoutes);
router.use('/consultations', authMiddleware, staffGuard, consultationRoutes);
router.use('/safety', authMiddleware, staffGuard, safetyRoutes);
router.use('/compliance', authMiddleware, staffGuard, complianceRoutes);
router.use('/sites', authMiddleware, staffGuard, siteRoutes);
router.use('/alerts', authMiddleware, staffGuard, alertRoutes);
router.use('/analytics', authMiddleware, staffGuard, analyticsRoutes);
router.use('/ai', authMiddleware, staffGuard, aiRoutes);
router.use('/intelligence', authMiddleware, staffGuard, intelligenceRoutes);
router.use('/scenarios', authMiddleware, staffGuard, scenarioRoutes);
router.use('/action-center', authMiddleware, staffGuard, actionCenterRoutes);

module.exports = router;


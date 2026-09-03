const express = require('express');
const router = express.Router();
const safetyController = require('../controllers/safetyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

router.get('/', authMiddleware, safetyController.getSafetyOverview);
router.get('/report', authMiddleware, safetyController.generateSafetyReport);

router.post(
  '/',
  authMiddleware,
  roleGuard(['ADMIN', 'SAFETY_OFFICER', 'RESEARCHER']),
  safetyController.logSafetyEvent
);

router.put(
  '/:id',
  authMiddleware,
  roleGuard(['ADMIN', 'SAFETY_OFFICER']),
  safetyController.updateSafetyEvent
);

module.exports = router;

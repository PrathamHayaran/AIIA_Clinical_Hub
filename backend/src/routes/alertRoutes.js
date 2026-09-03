const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

router.get('/', authMiddleware, alertController.getAllAlerts);

router.put(
  '/:id/resolve',
  authMiddleware,
  roleGuard(['ADMIN', 'RESEARCHER', 'SAFETY_OFFICER', 'COMPLIANCE_OFFICER']),
  alertController.resolveAlert
);

router.post(
  '/scan',
  authMiddleware,
  roleGuard(['ADMIN', 'MANAGEMENT']),
  alertController.triggerAlertScan
);

module.exports = router;

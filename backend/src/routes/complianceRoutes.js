const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

router.get('/', authMiddleware, complianceController.getComplianceOverview);

router.put(
  '/records/:id',
  authMiddleware,
  roleGuard(['ADMIN', 'COMPLIANCE_OFFICER']),
  complianceController.updateComplianceRecord
);

router.put(
  '/ethics/:id',
  authMiddleware,
  roleGuard(['ADMIN', 'COMPLIANCE_OFFICER']),
  complianceController.updateEthicsApproval
);

router.put(
  '/ctri/:id',
  authMiddleware,
  roleGuard(['ADMIN', 'COMPLIANCE_OFFICER']),
  complianceController.updateCTRIRegistration
);

module.exports = router;

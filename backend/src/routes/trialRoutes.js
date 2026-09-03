const express = require('express');
const router = express.Router();
const trialController = require('../controllers/trialController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

// Public / Authenticated read routes
router.get('/', authMiddleware, trialController.getAllTrials);
router.get('/:id', authMiddleware, trialController.getTrialById);
router.get('/:id/export/fhir', authMiddleware, trialController.exportTrialFHIR);
router.get('/:id/export/cdisc', authMiddleware, trialController.exportTrialCDISC);

// Admin / Researcher mutate routes
router.post(
  '/',
  authMiddleware,
  roleGuard(['ADMIN', 'RESEARCHER']),
  trialController.createTrial
);

router.put(
  '/:id',
  authMiddleware,
  roleGuard(['ADMIN', 'RESEARCHER']),
  trialController.updateTrial
);

router.delete(
  '/:id',
  authMiddleware,
  roleGuard(['ADMIN']),
  trialController.deleteTrial
);

router.put(
  '/milestones/:milestoneId',
  authMiddleware,
  roleGuard(['ADMIN', 'RESEARCHER']),
  trialController.updateMilestone
);

module.exports = router;

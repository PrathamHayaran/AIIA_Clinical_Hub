const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, recruitmentController.getRecruitmentOverview);
router.get('/:trialId', authMiddleware, recruitmentController.getTrialRecruitment);

module.exports = router;

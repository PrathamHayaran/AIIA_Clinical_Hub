const express = require('express');
const router = express.Router();
const intelligenceController = require('../controllers/intelligenceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Action Center Prioritized List
router.get('/', intelligenceController.getActionCenter);

// Complete / Acknowledge Action Item
router.post('/:id/complete', intelligenceController.completeActionItem);

module.exports = router;

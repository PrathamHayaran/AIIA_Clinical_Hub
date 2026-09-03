const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, authController.login);
router.post('/register', authController.register);
router.post('/quick-demo', authController.quickDemoLogin);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;

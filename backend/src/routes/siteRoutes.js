const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

router.get('/', authMiddleware, siteController.getAllSites);
router.get('/:id', authMiddleware, siteController.getSiteById);

router.post(
  '/',
  authMiddleware,
  roleGuard(['ADMIN']),
  siteController.createSite
);

module.exports = router;

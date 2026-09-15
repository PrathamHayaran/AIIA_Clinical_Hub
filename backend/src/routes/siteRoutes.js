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
  roleGuard(['ADMIN', 'RESEARCHER', 'MANAGEMENT']),
  siteController.createSite
);

router.put(
  '/:id',
  authMiddleware,
  roleGuard(['ADMIN', 'RESEARCHER', 'MANAGEMENT']),
  siteController.updateSite
);

router.delete(
  '/:id',
  authMiddleware,
  roleGuard(['ADMIN']),
  siteController.deleteSite
);

module.exports = router;


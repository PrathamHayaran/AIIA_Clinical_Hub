const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

// All consultation endpoints are protected by authMiddleware + staffGuard in routes/index.js
router.get('/patients', consultationController.getConsultationPatients);
router.get('/patient/:patientId', consultationController.getPatientThread);
router.post('/patient/:patientId', consultationController.sendMessageToPatient);

module.exports = router;

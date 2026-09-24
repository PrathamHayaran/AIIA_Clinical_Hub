const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const patientGuard = require('../middleware/patientGuard');
const patientController = require('../controllers/patientController');

// All patient endpoints require authentication and patient authorization
router.use(authMiddleware, patientGuard);

// 1. Overview & Profile
router.get('/me', patientController.getPatientOverview);
router.put('/me/profile', patientController.updatePatientProfile);

// 2. Trial Details
router.get('/me/trial', patientController.getPatientTrial);

// 3. Visits & Appointments
router.get('/me/visits', patientController.getPatientVisits);

// 4. Medication / Treatment Adherence
router.get('/me/adherence', patientController.getPatientAdherence);
router.post('/me/adherence', patientController.logPatientAdherence);
router.delete('/me/adherence/:id', patientController.deletePatientAdherence);

// 5. Health & Safety Self-Reporting
router.get('/me/safety-reports', patientController.getPatientSafetyReports);
router.post('/me/safety-reports', patientController.submitPatientSafetyReport);

// 6. Questionnaires
router.get('/me/questionnaires', patientController.getPatientQuestionnaires);
router.get('/me/questionnaires/:id', patientController.getQuestionnaireById);
router.post('/me/questionnaires/:id/submit', patientController.submitPatientQuestionnaire);

// 7. Documents & Consent
router.get('/me/documents', patientController.getPatientDocuments);
router.post('/me/documents/request-withdrawal', patientController.requestConsentWithdrawal);

// 8. Notifications
router.get('/me/notifications', patientController.getPatientNotifications);
router.put('/me/notifications/:id/read', patientController.markNotificationRead);

// 9. Study Team Communication
router.get('/me/messages', patientController.getPatientMessages);
router.post('/me/messages', patientController.sendPatientMessage);

module.exports = router;

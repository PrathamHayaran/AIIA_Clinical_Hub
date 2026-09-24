import api from './api';

export const patientApi = {
  // 1. Overview & Profile
  getOverview: async () => {
    const res = await api.get('/patient/me');
    return res.data.data || res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/patient/me/profile', data);
    return res.data.data || res.data;
  },

  // 2. Trial Details
  getTrial: async () => {
    const res = await api.get('/patient/me/trial');
    return res.data.data || res.data;
  },

  // 3. Visits & Appointments
  getVisits: async () => {
    const res = await api.get('/patient/me/visits');
    return res.data.data || res.data;
  },

  // 4. Medication / Treatment Adherence
  getAdherence: async () => {
    const res = await api.get('/patient/me/adherence');
    return res.data.data || res.data;
  },
  logAdherence: async (data) => {
    const res = await api.post('/patient/me/adherence', data);
    return res.data.data || res.data;
  },
  deleteAdherence: async (id) => {
    const res = await api.delete(`/patient/me/adherence/${id}`);
    return res.data.data || res.data;
  },

  // 5. Health & Safety Self-Reporting
  getSafetyReports: async () => {
    const res = await api.get('/patient/me/safety-reports');
    return res.data.data || res.data;
  },
  submitSafetyReport: async (data) => {
    const res = await api.post('/patient/me/safety-reports', data);
    return res.data.data || res.data;
  },

  // 6. Questionnaires
  getQuestionnaires: async () => {
    const res = await api.get('/patient/me/questionnaires');
    return res.data.data || res.data;
  },
  getQuestionnaireById: async (id) => {
    const res = await api.get(`/patient/me/questionnaires/${id}`);
    return res.data.data || res.data;
  },
  submitQuestionnaire: async (id, responses) => {
    const res = await api.post(`/patient/me/questionnaires/${id}/submit`, { responses });
    return res.data.data || res.data;
  },

  // 7. Documents & Consent
  getDocuments: async () => {
    const res = await api.get('/patient/me/documents');
    return res.data.data || res.data;
  },
  requestConsentWithdrawal: async (reason) => {
    const res = await api.post('/patient/me/documents/request-withdrawal', { reason });
    return res.data.data || res.data;
  },

  // 8. Notifications
  getNotifications: async () => {
    const res = await api.get('/patient/me/notifications');
    return res.data.data || res.data;
  },
  markNotificationRead: async (id) => {
    const res = await api.put(`/patient/me/notifications/${id}/read`);
    return res.data.data || res.data;
  },

  // 9. Study Team Communication
  getMessages: async () => {
    const res = await api.get('/patient/me/messages');
    return res.data.data || res.data;
  },
  sendMessage: async (message) => {
    const res = await api.post('/patient/me/messages', { message });
    return res.data.data || res.data;
  },
};

export default patientApi;

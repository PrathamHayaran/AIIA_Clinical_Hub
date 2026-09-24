import api from './api';

export const consultationApi = {
  // 1. Get all patients with messaging metadata
  getPatients: async () => {
    const res = await api.get('/consultations/patients');
    return res.data.data || res.data;
  },

  // 2. Get full conversation thread for a specific patient
  getPatientThread: async (patientId) => {
    const res = await api.get(`/consultations/patient/${patientId}`);
    return res.data.data || res.data;
  },

  // 3. Send clinical message / reply to patient
  sendMessage: async (patientId, message, subject) => {
    const res = await api.post(`/consultations/patient/${patientId}`, { message, subject });
    return res.data.data || res.data;
  },
};

export default consultationApi;

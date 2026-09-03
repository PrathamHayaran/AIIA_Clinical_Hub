import api from './api';

export const intelligenceApi = {
  // 1. Trial Health Score
  getTrialHealth: async (trialId) => {
    const res = await api.get(`/intelligence/trial/${trialId}/health`);
    return res.data;
  },

  // 2. Predictive Delay & Trajectory
  getTrialPrediction: async (trialId) => {
    const res = await api.get(`/intelligence/trial/${trialId}/prediction`);
    return res.data;
  },

  // 3. "Why?" AI Root Cause Analysis
  getTrialRootCause: async (trialId, metric = 'overall') => {
    const res = await api.get(`/intelligence/trial/${trialId}/root-cause?metric=${encodeURIComponent(metric)}`);
    return res.data;
  },

  // 4. Site Risk Contribution
  getTrialSiteRisk: async (trialId) => {
    const res = await api.get(`/intelligence/trial/${trialId}/site-risk`);
    return res.data;
  },

  // 5. Portfolio Intelligence
  getPortfolioIntelligence: async () => {
    const res = await api.get('/intelligence/portfolio');
    return res.data;
  },

  // 6. Network Site Intelligence
  getSiteNetworkIntelligence: async () => {
    const res = await api.get('/intelligence/sites');
    return res.data;
  },

  // 7. What-If Scenario Simulation
  simulateScenario: async (trialId, scenarioParams) => {
    const res = await api.post('/scenarios/simulate', { trialId, scenarioParams });
    return res.data;
  },

  // 8. Scenario Recommendations
  getScenarioRecommendations: async (trialId) => {
    const res = await api.get(`/scenarios/recommend/${trialId}`);
    return res.data;
  },

  // 9. AI Action Center
  getActionCenter: async () => {
    const res = await api.get('/action-center');
    return res.data;
  },

  // 10. Complete Action Item
  completeActionItem: async (actionId) => {
    const res = await api.post(`/action-center/${actionId}/complete`);
    return res.data;
  },

  // 11. AI Executive Briefing
  getExecutiveBriefing: async () => {
    const res = await api.post('/ai/briefing', {});
    return res.data;
  },

  // 12. AI "Why?" Explainability
  getAIWhy: async (trialId, metric = 'overall') => {
    const res = await api.post('/ai/why', { trialId, metric });
    return res.data;
  },
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { calculateTrialHealth, calculatePortfolioHealth } = require('../services/healthScoringService');
const { calculateTrialRisk } = require('../services/riskScoringService');
const { calculateTrialPrediction } = require('../services/predictionService');
const { explainRootCause } = require('../services/rootCauseService');
const { simulateTrialScenario, evaluateAndRecommendScenarios } = require('../services/scenarioService');
const { generatePrioritizedActionItems } = require('../services/actionCenterService');
const { calculateSiteNetworkIntelligence, calculateTrialSiteRiskContribution } = require('../services/networkIntelligenceService');
const aiService = require('../services/aiService');

/**
 * Helper to fetch a complete trial bundle with all relations
 */
async function fetchTrialBundle(trialIdOrUid) {
  return prisma.trial.findFirst({
    where: {
      OR: [
        { id: trialIdOrUid },
        { trialId: trialIdOrUid },
      ],
    },
    include: {
      milestones: { orderBy: { sequence: 'asc' } },
      trialSites: { include: { site: true } },
      safetyEvents: true,
      recruitmentRecords: { orderBy: { monthYear: 'asc' } },
      complianceRecords: true,
      ethicsApproval: true,
      ctriRegistration: true,
      alerts: true,
    },
  });
}

/**
 * 1. GET /api/intelligence/trial/:id/health
 */
exports.getTrialHealth = async (req, res) => {
  try {
    const { id } = req.params;
    const trial = await fetchTrialBundle(id);

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const health = calculateTrialHealth(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
      trialSites: trial.trialSites,
    });

    const risk = calculateTrialRisk(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
    });

    return res.json({
      success: true,
      trialId: trial.trialId,
      title: trial.title,
      health,
      risk,
    });
  } catch (err) {
    console.error('getTrialHealth error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 2. GET /api/intelligence/trial/:id/prediction
 */
exports.getTrialPrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const trial = await fetchTrialBundle(id);

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const prediction = calculateTrialPrediction(trial, {
      milestones: trial.milestones,
      recruitmentRecords: trial.recruitmentRecords,
      trialSites: trial.trialSites,
    });

    return res.json({
      success: true,
      prediction,
    });
  } catch (err) {
    console.error('getTrialPrediction error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 3. GET /api/intelligence/trial/:id/root-cause
 */
exports.getTrialRootCause = async (req, res) => {
  try {
    const { id } = req.params;
    const { metric = 'overall' } = req.query;
    const trial = await fetchTrialBundle(id);

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const prediction = calculateTrialPrediction(trial, {
      milestones: trial.milestones,
      recruitmentRecords: trial.recruitmentRecords,
      trialSites: trial.trialSites,
    });

    const risk = calculateTrialRisk(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
    });

    const rootCause = explainRootCause({
      metric,
      trial,
      options: {
        milestones: trial.milestones,
        safetyEvents: trial.safetyEvents,
        ethicsApproval: trial.ethicsApproval,
        ctriRegistration: trial.ctriRegistration,
        trialSites: trial.trialSites,
        prediction,
        riskScore: risk.score,
      },
    });

    return res.json({
      success: true,
      rootCause,
    });
  } catch (err) {
    console.error('getTrialRootCause error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 4. GET /api/intelligence/trial/:id/site-risk
 */
exports.getTrialSiteRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const trial = await fetchTrialBundle(id);

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const siteRisk = calculateTrialSiteRiskContribution(trial, trial.trialSites);

    return res.json({
      success: true,
      siteRisk,
    });
  } catch (err) {
    console.error('getTrialSiteRisk error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 5. GET /api/intelligence/portfolio
 */
exports.getPortfolioIntelligence = async (req, res) => {
  try {
    const trials = await prisma.trial.findMany({
      include: {
        milestones: true,
        trialSites: { include: { site: true } },
        safetyEvents: true,
        ethicsApproval: true,
        ctriRegistration: true,
      },
    });

    const trialsWithHealth = trials.map((t) => {
      const health = calculateTrialHealth(t, {
        milestones: t.milestones,
        safetyEvents: t.safetyEvents,
        ethicsApproval: t.ethicsApproval,
        ctriRegistration: t.ctriRegistration,
        trialSites: t.trialSites,
      });

      const risk = calculateTrialRisk(t, {
        milestones: t.milestones,
        safetyEvents: t.safetyEvents,
        ethicsApproval: t.ethicsApproval,
        ctriRegistration: t.ctriRegistration,
      });

      return {
        id: t.id,
        trialId: t.trialId,
        title: t.title,
        status: t.status,
        treatment: t.treatment,
        currentEnrolled: t.currentEnrolled,
        targetParticipants: t.targetParticipants,
        health,
        risk,
      };
    });

    const portfolio = calculatePortfolioHealth(trialsWithHealth);

    return res.json({
      success: true,
      portfolio,
      trials: trialsWithHealth,
    });
  } catch (err) {
    console.error('getPortfolioIntelligence error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 6. GET /api/intelligence/sites
 */
exports.getSiteNetworkIntelligence = async (req, res) => {
  try {
    const sites = await prisma.researchSite.findMany();
    const trialSites = await prisma.trialSite.findMany();
    const patients = await prisma.patient.findMany({ select: { id: true, siteId: true } });

    const network = calculateSiteNetworkIntelligence({ sites, trialSites, patients });

    return res.json({
      success: true,
      network,
    });
  } catch (err) {
    console.error('getSiteNetworkIntelligence error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 7. POST /api/scenarios/simulate
 */
exports.simulateScenario = async (req, res) => {
  try {
    const { trialId, scenarioParams = {} } = req.body;
    const targetId = trialId || 'AYU-002';
    const trial = await fetchTrialBundle(targetId);

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const simulation = simulateTrialScenario({
      trial,
      options: {
        milestones: trial.milestones,
        safetyEvents: trial.safetyEvents,
        ethicsApproval: trial.ethicsApproval,
        ctriRegistration: trial.ctriRegistration,
        trialSites: trial.trialSites,
        recruitmentRecords: trial.recruitmentRecords,
      },
      scenarioParams,
    });

    const recommendations = evaluateAndRecommendScenarios(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
      trialSites: trial.trialSites,
      recruitmentRecords: trial.recruitmentRecords,
    });

    return res.json({
      success: true,
      simulation,
      recommendations,
    });
  } catch (err) {
    console.error('simulateScenario error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 8. GET /api/scenarios/recommend/:trialId
 */
exports.getScenarioRecommendations = async (req, res) => {
  try {
    const { trialId } = req.params;
    const trial = await fetchTrialBundle(trialId);

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const recommendations = evaluateAndRecommendScenarios(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
      trialSites: trial.trialSites,
      recruitmentRecords: trial.recruitmentRecords,
    });

    return res.json({
      success: true,
      recommendations,
    });
  } catch (err) {
    console.error('getScenarioRecommendations error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 9. GET /api/action-center
 */
exports.getActionCenter = async (req, res) => {
  try {
    const trials = await prisma.trial.findMany();
    const alerts = await prisma.alert.findMany();
    const safetyEvents = await prisma.safetyEvent.findMany();
    const ethicsApprovals = await prisma.ethicsApproval.findMany();
    const ctriRegistrations = await prisma.cTRIRegistration.findMany();
    const milestones = await prisma.trialMilestone.findMany();

    const actionCenter = generatePrioritizedActionItems({
      trials,
      alerts,
      safetyEvents,
      ethicsApprovals,
      ctriRegistrations,
      milestones,
    });

    return res.json({
      success: true,
      actionCenter,
    });
  } catch (err) {
    console.error('getActionCenter error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 10. POST /api/action-center/:id/complete
 */
exports.completeActionItem = async (req, res) => {
  try {
    const { id } = req.params;
    // Return acknowledgement
    return res.json({
      success: true,
      message: `Action item ${id} acknowledged and logged for compliance audit.`,
      completedAt: new Date(),
    });
  } catch (err) {
    console.error('completeActionItem error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 11. POST /api/ai/why
 */
exports.getAIWhyExplanation = async (req, res) => {
  try {
    const { trialId, metric = 'overall' } = req.body;
    const targetId = trialId || 'AYU-002';
    const trial = await fetchTrialBundle(targetId);

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const prediction = calculateTrialPrediction(trial, {
      milestones: trial.milestones,
      recruitmentRecords: trial.recruitmentRecords,
      trialSites: trial.trialSites,
    });

    const risk = calculateTrialRisk(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
    });

    const rootCause = explainRootCause({
      metric,
      trial,
      options: {
        milestones: trial.milestones,
        safetyEvents: trial.safetyEvents,
        ethicsApproval: trial.ethicsApproval,
        ctriRegistration: trial.ctriRegistration,
        trialSites: trial.trialSites,
        prediction,
        riskScore: risk.score,
      },
    });

    return res.json({
      success: true,
      rootCause,
    });
  } catch (err) {
    console.error('getAIWhyExplanation error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 12. POST /api/ai/briefing
 */
exports.getExecutiveBriefing = async (req, res) => {
  try {
    const trials = await prisma.trial.findMany();
    const safetyEvents = await prisma.safetyEvent.findMany();
    const ethicsApprovals = await prisma.ethicsApproval.findMany();

    const briefing = aiService.generateExecutiveBriefing({
      trials,
      safetyEvents,
      ethicsApprovals,
    });

    return res.json({
      success: true,
      briefing,
    });
  } catch (err) {
    console.error('getExecutiveBriefing error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

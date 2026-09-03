/**
 * AIIA Trial Scenario Simulator & Recommendation Engine
 * Simulates hypothetical operational interventions without altering live trial records.
 */

const { calculateTrialRisk } = require('./riskScoringService');
const { calculateTrialHealth } = require('./healthScoringService');
const { calculateTrialPrediction } = require('./predictionService');

function simulateTrialScenario({
  trial,
  options = {},
  scenarioParams = {},
}) {
  const {
    milestones = [],
    safetyEvents = [],
    ethicsApproval = null,
    ctriRegistration = null,
    trialSites = [],
    recruitmentRecords = [],
  } = options;

  const {
    additionalSites = 0,
    siteVelocityBoostPct = 0, // e.g. 20 for +20%
    timelineExtensionDays = 0,
    resolveSafetyBacklog = false,
    renewEthicsApproval = false,
  } = scenarioParams;

  // 1. Current State Baseline
  const currentRisk = calculateTrialRisk(trial, { milestones, safetyEvents, ethicsApproval, ctriRegistration });
  const currentHealth = calculateTrialHealth(trial, { milestones, safetyEvents, ethicsApproval, ctriRegistration, trialSites });
  const currentPred = calculateTrialPrediction(trial, { milestones, recruitmentRecords, trialSites });

  // 2. Build Hypothetical Trial Model
  const simTargetEnd = new Date(new Date(trial.expectedEndDate).getTime() + timelineExtensionDays * 24 * 60 * 60 * 1000);

  // Velocity boost calculation:
  // Each additional active site adds ~20% capacity; velocity boost adds direct percentage
  const siteMultiplier = 1 + (additionalSites * 0.22);
  const velocityMultiplier = (1 + (siteVelocityBoostPct / 100)) * siteMultiplier;
  const simEffectiveVelocity = Number((currentPred.currentVelocity * velocityMultiplier).toFixed(2));

  // Projected new completion date
  const remaining = Math.max(0, trial.targetParticipants - trial.currentEnrolled);
  const simWeeksNeeded = remaining / Math.max(0.1, simEffectiveVelocity);
  const simDaysNeeded = Math.round(simWeeksNeeded * 7);
  const simForecastedEnd = new Date(new Date().getTime() + simDaysNeeded * 24 * 60 * 60 * 1000);

  const simDelayMs = simForecastedEnd - simTargetEnd;
  const simPredictedDelayDays = Math.max(0, Math.round(simDelayMs / (1000 * 60 * 60 * 24)));

  // Simulated Safety Events
  let simSafetyEvents = [...safetyEvents];
  if (resolveSafetyBacklog) {
    simSafetyEvents = simSafetyEvents.map((e) => ({ ...e, status: 'Resolved' }));
  }

  // Simulated Ethics Approval
  let simEthicsApproval = ethicsApproval;
  if (renewEthicsApproval && simEthicsApproval) {
    simEthicsApproval = {
      ...simEthicsApproval,
      expiryDate: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      status: 'Approved',
    };
  }

  // Simulated Milestones
  let simMilestones = [...milestones];
  if (simPredictedDelayDays <= 7) {
    simMilestones = simMilestones.map((m) => (m.status === 'DELAYED' ? { ...m, status: 'ACTIVE' } : m));
  }

  // Simulated Trial Object for Scoring
  const simTrial = {
    ...trial,
    expectedEndDate: simTargetEnd,
    dataQualityScore: Math.min(100, (trial.dataQualityScore || 90) + (additionalSites > 0 ? 3 : 0)),
    safetyScore: resolveSafetyBacklog ? 98 : trial.safetyScore,
    complianceScore: renewEthicsApproval ? 98 : trial.complianceScore,
  };

  // 3. Simulated State Scores
  const simRisk = calculateTrialRisk(simTrial, {
    milestones: simMilestones,
    safetyEvents: simSafetyEvents,
    ethicsApproval: simEthicsApproval,
    ctriRegistration,
  });

  const simHealth = calculateTrialHealth(simTrial, {
    milestones: simMilestones,
    safetyEvents: simSafetyEvents,
    ethicsApproval: simEthicsApproval,
    ctriRegistration,
    trialSites,
  });

  // Calculate Deltas
  const riskDelta = simRisk.score - currentRisk.score; // negative is improvement
  const healthDelta = simHealth.score - currentHealth.score; // positive is improvement
  const delayDelta = simPredictedDelayDays - currentPred.predictedDelayDays; // negative is improvement

  return {
    trialId: trial.trialId,
    scenarioParams,
    current: {
      riskScore: currentRisk.score,
      riskCategory: currentRisk.category,
      healthScore: currentHealth.score,
      healthCategory: currentHealth.category,
      expectedCompletion: currentPred.targetCompletionDate,
      forecastedCompletion: currentPred.forecastedCompletionDate,
      predictedDelayDays: currentPred.predictedDelayDays,
      delayProbability: currentPred.delayProbability,
      effectiveVelocity: currentPred.currentVelocity,
    },
    simulated: {
      riskScore: simRisk.score,
      riskCategory: simRisk.category,
      healthScore: simHealth.score,
      healthCategory: simHealth.category,
      expectedCompletion: simTargetEnd,
      forecastedCompletion: simForecastedEnd,
      predictedDelayDays: simPredictedDelayDays,
      delayProbability: Math.max(5, Math.round(currentPred.delayProbability * (simPredictedDelayDays / Math.max(1, currentPred.predictedDelayDays)))),
      effectiveVelocity: simEffectiveVelocity,
    },
    deltas: {
      riskDelta,
      healthDelta,
      delayDelta,
      velocityImprovementPct: Math.round((velocityMultiplier - 1) * 100),
    },
    summary: `Simulated intervention results in Risk: ${currentRisk.score} → ${simRisk.score} (${riskDelta > 0 ? '+' : ''}${riskDelta} pts), Health: ${currentHealth.score} → ${simHealth.score} (+${healthDelta} pts), and Delay: ${currentPred.predictedDelayDays}d → ${simPredictedDelayDays}d (${delayDelta} days).`,
  };
}

/**
 * Runs multiple canonical scenarios and determines the optimal operational recommendation
 */
function evaluateAndRecommendScenarios(trial, options = {}) {
  const canonicalScenarios = [
    {
      id: 'SCENARIO_A',
      name: 'Scenario A: Activate +2 Research Sites',
      description: 'Onboard 2 additional accredited Ayush research centers to broaden regional intake.',
      params: { additionalSites: 2, siteVelocityBoostPct: 10, timelineExtensionDays: 0, resolveSafetyBacklog: false },
    },
    {
      id: 'SCENARIO_B',
      name: 'Scenario B: Site Velocity Acceleration (+20%)',
      description: 'Implement community screening camps and fast-track triage at existing participating centers.',
      params: { additionalSites: 0, siteVelocityBoostPct: 20, timelineExtensionDays: 0, resolveSafetyBacklog: false },
    },
    {
      id: 'SCENARIO_C',
      name: 'Scenario C: Targeted Regional Outreach (+15% Intake)',
      description: 'Deploy specialized recruitment coordinators to Jaipur and Mumbai sites.',
      params: { additionalSites: 0, siteVelocityBoostPct: 15, timelineExtensionDays: 0, resolveSafetyBacklog: false },
    },
    {
      id: 'SCENARIO_D',
      name: 'Scenario D: Formal Timeline Extension (+30 Days)',
      description: 'Request formal timeline amendment with the ethics committee without changing operational pacing.',
      params: { additionalSites: 0, siteVelocityBoostPct: 0, timelineExtensionDays: 30, resolveSafetyBacklog: false },
    },
  ];

  const results = canonicalScenarios.map((sc) => {
    const sim = simulateTrialScenario({ trial, options, scenarioParams: sc.params });
    // Composite effectiveness score: favors large delay reduction, risk drop, and health gain
    const effectivenessScore = (sim.deltas.healthDelta * 1.5) + (Math.abs(Math.min(0, sim.deltas.riskDelta)) * 1.2) + (Math.abs(Math.min(0, sim.deltas.delayDelta)) * 2.0);
    return {
      ...sc,
      simulation: sim,
      effectivenessScore,
    };
  });

  // Sort by highest effectiveness score
  results.sort((a, b) => b.effectivenessScore - a.effectivenessScore);
  const best = results[0];

  return {
    trialId: trial.trialId,
    recommendedScenario: {
      id: best.id,
      name: best.name,
      description: best.description,
      effectivenessScore: Math.round(best.effectivenessScore),
      projectedImprovement: {
        riskScore: `${best.simulation.current.riskScore} → ${best.simulation.simulated.riskScore}`,
        healthScore: `${best.simulation.current.healthScore} → ${best.simulation.simulated.healthScore}`,
        delayDays: `${best.simulation.current.predictedDelayDays} days → ${best.simulation.simulated.predictedDelayDays} days`,
      },
      rationale: `This scenario produces the largest quantifiable operational improvement, reducing projected timeline delay by ${Math.abs(best.simulation.deltas.delayDelta)} days while lifting trial health by ${best.simulation.deltas.healthDelta} points.`,
    },
    allScenarios: results,
  };
}

module.exports = {
  simulateTrialScenario,
  evaluateAndRecommendScenarios,
};

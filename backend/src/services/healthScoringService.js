/**
 * AIIA Clinical Trial Health Scoring Engine
 * Computes multidimensional operational health (0 - 100).
 * Health Score represents operational vitality and execution quality.
 * Factors:
 *  - Recruitment Health (0-100)
 *  - Safety Health (0-100)
 *  - Compliance Health (0-100)
 *  - Data Quality Health (0-100)
 *  - Site Performance Health (0-100)
 *  - Milestones Health (0-100)
 */

function calculateTrialHealth(trial, options = {}) {
  const {
    milestones = [],
    safetyEvents = [],
    ethicsApproval = null,
    ctriRegistration = null,
    trialSites = [],
  } = options;

  // 1. Recruitment Health (Weight: 25%)
  let recruitmentHealth = 100;
  if (trial.targetParticipants > 0) {
    const recruitmentPct = (trial.currentEnrolled / trial.targetParticipants) * 100;
    const now = new Date();
    const start = new Date(trial.startDate);
    const end = new Date(trial.expectedEndDate);
    const totalDurationDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(0, (now - start) / (1000 * 60 * 60 * 24));
    const expectedProgressPct = Math.min(100, (elapsedDays / totalDurationDays) * 100);

    const lag = expectedProgressPct - recruitmentPct;
    if (lag > 25) {
      recruitmentHealth = Math.max(20, Math.round(100 - lag * 1.8));
    } else if (lag > 10) {
      recruitmentHealth = Math.max(50, Math.round(100 - lag * 1.4));
    } else if (lag <= 0) {
      recruitmentHealth = Math.min(100, Math.round(85 + (recruitmentPct / 100) * 15));
    } else {
      recruitmentHealth = Math.round(100 - lag * 1.0);
    }
  }

  // 2. Safety Health (Weight: 20%)
  let safetyHealth = trial.safetyScore || 95;
  const seriousUnresolved = safetyEvents.filter(
    (e) => (e.severity === 'Serious' || e.severity === 'Severe') && e.status !== 'Resolved'
  );
  const totalEvents = safetyEvents.length;
  if (seriousUnresolved.length > 0) {
    safetyHealth = Math.max(30, 85 - seriousUnresolved.length * 20);
  } else if (totalEvents > 5) {
    safetyHealth = Math.max(70, 95 - (totalEvents - 5) * 3);
  }

  // 3. Compliance Health (Weight: 20%)
  let complianceHealth = trial.complianceScore || 90;
  if (ethicsApproval) {
    const daysToExpiry = Math.round((new Date(ethicsApproval.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysToExpiry <= 0) {
      complianceHealth = Math.min(complianceHealth, 35);
    } else if (daysToExpiry <= 14) {
      complianceHealth = Math.min(complianceHealth, 65);
    }
  }
  if (ctriRegistration && ctriRegistration.status === 'Update_Due') {
    complianceHealth = Math.min(complianceHealth, 75);
  }

  // 4. Data Quality Health (Weight: 15%)
  const dataQualityHealth = trial.dataQualityScore || 90;

  // 5. Site Performance Health (Weight: 10%)
  let sitePerformanceHealth = 85;
  if (trialSites.length > 0) {
    const siteScores = trialSites.map((ts) => {
      const site = ts.site || {};
      const target = ts.targetEnrollment || 1;
      const enrolled = ts.currentEnrollment || 0;
      const pacing = Math.min(100, (enrolled / target) * 100);
      return (site.performanceScore || 80) * 0.5 + pacing * 0.5;
    });
    sitePerformanceHealth = Math.round(siteScores.reduce((a, b) => a + b, 0) / siteScores.length);
  }

  // 6. Milestones Health (Weight: 10%)
  let milestonesHealth = 90;
  if (milestones.length > 0) {
    const delayedCount = milestones.filter((m) => m.status === 'DELAYED').length;
    const completedCount = milestones.filter((m) => m.status === 'COMPLETED').length;
    const progressRatio = completedCount / milestones.length;
    milestonesHealth = Math.max(25, Math.round(progressRatio * 40 + (1 - delayedCount / milestones.length) * 60));
  }

  // Composite Health Score
  const compositeHealth = Math.round(
    recruitmentHealth * 0.25 +
    safetyHealth * 0.20 +
    complianceHealth * 0.20 +
    dataQualityHealth * 0.15 +
    sitePerformanceHealth * 0.10 +
    milestonesHealth * 0.10
  );

  let healthCategory = 'Healthy'; // Healthy (>=80), Watchlist (60-79), At-Risk (40-59), Critical (<40)
  if (compositeHealth < 40) healthCategory = 'Critical';
  else if (compositeHealth < 60) healthCategory = 'At-Risk';
  else if (compositeHealth < 80) healthCategory = 'Watchlist';

  return {
    score: Math.min(100, Math.max(0, compositeHealth)),
    category: healthCategory,
    breakdown: {
      recruitment: recruitmentHealth,
      safety: safetyHealth,
      compliance: complianceHealth,
      dataQuality: dataQualityHealth,
      sitePerformance: sitePerformanceHealth,
      milestones: milestonesHealth,
    },
  };
}

/**
 * Calculates aggregate Portfolio Health for executive overview
 */
function calculatePortfolioHealth(trialsWithHealth = []) {
  if (trialsWithHealth.length === 0) {
    return {
      portfolioHealthScore: 85,
      counts: { healthy: 0, watchlist: 0, highRisk: 0, critical: 0 },
      topRisks: [],
    };
  }

  let totalScore = 0;
  const counts = { healthy: 0, watchlist: 0, highRisk: 0, critical: 0 };
  const riskWatchlist = [];

  trialsWithHealth.forEach((item) => {
    const h = item.healthScore || item.health?.score || 80;
    totalScore += h;

    if (h >= 80) counts.healthy++;
    else if (h >= 60) counts.watchlist++;
    else if (h >= 40) {
      counts.highRisk++;
      riskWatchlist.push(item);
    } else {
      counts.critical++;
      riskWatchlist.push(item);
    }
  });

  const portfolioHealthScore = Math.round(totalScore / trialsWithHealth.length);

  // Sort watchlist by lowest health first
  riskWatchlist.sort((a, b) => (a.health?.score || a.healthScore || 80) - (b.health?.score || b.healthScore || 80));

  return {
    portfolioHealthScore,
    counts,
    topRisks: riskWatchlist.slice(0, 5),
  };
}

module.exports = {
  calculateTrialHealth,
  calculatePortfolioHealth,
};

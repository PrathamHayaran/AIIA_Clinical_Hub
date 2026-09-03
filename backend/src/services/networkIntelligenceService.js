/**
 * AIIA Research Network Intelligence & Site Risk Contribution Engine
 * Evaluates performance rankings across all research centers and computes
 * per-trial site risk contributions.
 */

function calculateSiteNetworkIntelligence({ sites = [], trialSites = [], patients = [] }) {
  const siteAnalytics = sites.map((site) => {
    const participatingTrials = trialSites.filter((ts) => ts.siteId === site.id);
    const sitePatients = patients.filter((p) => p.siteId === site.id);

    const totalTarget = participatingTrials.reduce((sum, ts) => sum + (ts.targetEnrollment || 0), 0);
    const totalEnrolled = participatingTrials.reduce((sum, ts) => sum + (ts.currentEnrollment || 0), 0);
    const pacingPct = totalTarget > 0 ? Math.round((totalEnrolled / totalTarget) * 100) : site.recruitmentRate || 80;

    // Composite Performance Score (0-100)
    const compositeScore = Math.round(
      pacingPct * 0.40 +
      (site.dataQualityRate || 90) * 0.25 +
      (site.complianceRate || 95) * 0.20 +
      (site.performanceScore || 85) * 0.15
    );

    return {
      id: site.id,
      siteCode: site.siteCode,
      name: site.name,
      city: site.city,
      state: site.state,
      principalInvestigator: site.principalInvestigator,
      activeTrialsCount: participatingTrials.length,
      totalParticipantsEnrolled: totalEnrolled,
      totalCapacity: site.capacity,
      recruitmentRate: pacingPct,
      dataQualityRate: site.dataQualityRate,
      complianceRate: site.complianceRate,
      overallPerformanceScore: Math.min(100, compositeScore),
      status: compositeScore >= 85 ? 'Top Performer' : compositeScore >= 70 ? 'Satisfactory' : 'Requires Support',
    };
  });

  // Sort sites by overall performance score descending
  siteAnalytics.sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore);

  return {
    totalSites: siteAnalytics.length,
    averagePerformanceScore: Math.round(
      siteAnalytics.reduce((sum, s) => sum + s.overallPerformanceScore, 0) / Math.max(1, siteAnalytics.length)
    ),
    sites: siteAnalytics,
  };
}

/**
 * Computes individual site risk contribution percentages for a given trial
 */
function calculateTrialSiteRiskContribution(trial, trialSites = []) {
  if (trialSites.length === 0) {
    return {
      trialId: trial.trialId,
      siteContributions: [],
      explanation: 'No multi-center participating sites assigned to this trial.',
    };
  }

  // Calculate deficit / risk weight for each site
  const siteWeights = trialSites.map((ts) => {
    const site = ts.site || {};
    const target = ts.targetEnrollment || 1;
    const enrolled = ts.currentEnrollment || 0;
    const completionPct = (enrolled / target) * 100;
    const deficit = Math.max(0, 100 - completionPct);
    const sitePerfPenalty = Math.max(0, 100 - (site.performanceScore || 85));

    // Combined deficit weight
    const rawWeight = (deficit * 0.7) + (sitePerfPenalty * 0.3) + 5; // baseline

    return {
      siteId: site.id || ts.siteId,
      siteCode: site.siteCode || 'SITE',
      name: site.name || ts.sitePi || 'Regional Site',
      city: site.city || 'Regional Center',
      targetEnrollment: target,
      currentEnrollment: enrolled,
      completionPct: Math.round(completionPct),
      rawWeight,
    };
  });

  const totalWeight = siteWeights.reduce((sum, s) => sum + s.rawWeight, 0);

  const siteContributions = siteWeights.map((s) => {
    const percentage = Math.round((s.rawWeight / Math.max(1, totalWeight)) * 100);
    return {
      siteId: s.siteId,
      siteCode: s.siteCode,
      name: s.name,
      city: s.city,
      targetEnrollment: s.targetEnrollment,
      currentEnrollment: s.currentEnrollment,
      completionPct: s.completionPct,
      riskContributionPct: percentage,
    };
  });

  // Sort descending by risk contribution
  siteContributions.sort((a, b) => b.riskContributionPct - a.riskContributionPct);

  // Top risk drivers text
  const topTwo = siteContributions.slice(0, 2);
  const topSum = topTwo.reduce((sum, s) => sum + s.riskContributionPct, 0);
  const explanation = topTwo.length > 1
    ? `${topTwo[0].city} (${topTwo[0].riskContributionPct}%) and ${topTwo[1].city} (${topTwo[1].riskContributionPct}%) together contribute ${topSum}% of the operational and recruitment risk for this trial.`
    : `${topTwo[0]?.city || 'Primary site'} contributes ${topTwo[0]?.riskContributionPct || 100}% of the operational risk.`;

  return {
    trialId: trial.trialId,
    siteContributions,
    topRiskDrivers: topTwo,
    explanation,
  };
}

module.exports = {
  calculateSiteNetworkIntelligence,
  calculateTrialSiteRiskContribution,
};

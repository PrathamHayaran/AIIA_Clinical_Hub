/**
 * AIIA Predictive Trial Delay & Recruitment Forecasting Engine
 * Calculates operational trajectories, delay probabilities, and completion forecasts
 * strictly grounded in synthetic trial records.
 */

function calculateTrialPrediction(trial, options = {}) {
  const {
    milestones = [],
    recruitmentRecords = [],
    trialSites = [],
  } = options;

  const now = new Date();
  const start = new Date(trial.startDate);
  const targetEnd = new Date(trial.expectedEndDate);

  const totalDurationDays = Math.max(1, (targetEnd - start) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.max(1, (now - start) / (1000 * 60 * 60 * 24));
  const elapsedWeeks = Math.max(0.5, elapsedDays / 7);
  const totalWeeks = Math.max(1, totalDurationDays / 7);

  const targetParticipants = trial.targetParticipants || 100;
  const currentEnrolled = trial.currentEnrolled || 0;
  const remainingParticipants = Math.max(0, targetParticipants - currentEnrolled);

  // Overall Historical Velocity (patients / week)
  const historicalVelocity = currentEnrolled / elapsedWeeks;

  // Recent Velocity (from recruitment records if available)
  let recentVelocity = historicalVelocity;
  if (recruitmentRecords.length > 0) {
    const recentRecords = [...recruitmentRecords].sort((a, b) => (b.monthYear || '').localeCompare(a.monthYear || '')).slice(0, 3);
    const recentTotal = recentRecords.reduce((sum, r) => sum + (r.actualCount || 0), 0);
    const recentMonths = Math.max(1, recentRecords.length);
    recentVelocity = (recentTotal / recentMonths) / 4.33; // convert monthly to weekly
  }

  // Blended Effective Velocity
  const effectiveVelocity = Math.max(0.1, Number(((recentVelocity * 0.6) + (historicalVelocity * 0.4)).toFixed(2)));
  const targetVelocity = Number((targetParticipants / totalWeeks).toFixed(2));

  // Projected Completion
  const weeksNeeded = remainingParticipants / effectiveVelocity;
  const daysNeeded = Math.round(weeksNeeded * 7);
  const forecastedEndDate = new Date(now.getTime() + daysNeeded * 24 * 60 * 60 * 1000);

  // Predicted Delay in Days
  const delayMs = forecastedEndDate - targetEnd;
  const predictedDelayDays = Math.max(0, Math.round(delayMs / (1000 * 60 * 60 * 24)));

  // Delay Probability Computation (0 - 100%)
  let delayProbability = 10;
  const velocityRatio = effectiveVelocity / Math.max(0.1, targetVelocity);

  if (predictedDelayDays > 30) {
    delayProbability = Math.min(96, Math.round(75 + (predictedDelayDays / 10)));
  } else if (predictedDelayDays > 14) {
    delayProbability = Math.min(85, Math.round(55 + (predictedDelayDays * 1.2)));
  } else if (predictedDelayDays > 0) {
    delayProbability = Math.min(60, Math.round(30 + predictedDelayDays * 2));
  } else if (velocityRatio >= 1.0) {
    delayProbability = 8;
  }

  const delayedMilestones = milestones.filter((m) => m.status === 'DELAYED');
  if (delayedMilestones.length > 0) {
    delayProbability = Math.min(98, delayProbability + delayedMilestones.length * 8);
  }

  // Monthly Trajectory Forecasting (for charts)
  const trajectory = generateRecruitmentTrajectory({
    startDate: start,
    targetEndDate: targetEnd,
    forecastedEndDate,
    targetParticipants,
    currentEnrolled,
    effectiveVelocity,
    recruitmentRecords,
  });

  // Milestone Impact Forecast
  const milestoneForecasts = milestones.map((m) => {
    let projectedDate = new Date(m.plannedDate);
    if (m.status === 'DELAYED' || (m.status === 'PENDING' && predictedDelayDays > 0)) {
      projectedDate = new Date(projectedDate.getTime() + predictedDelayDays * 24 * 60 * 60 * 1000);
    }
    return {
      id: m.id,
      title: m.title,
      plannedDate: m.plannedDate,
      projectedDate,
      status: m.status,
      delayDays: m.status === 'COMPLETED' ? 0 : predictedDelayDays,
    };
  });

  return {
    trialId: trial.trialId,
    currentEnrolled,
    targetParticipants,
    enrollmentPct: Math.round((currentEnrolled / targetParticipants) * 100),
    currentVelocity: effectiveVelocity,
    targetVelocity,
    targetCompletionDate: targetEnd,
    forecastedCompletionDate: forecastedEndDate,
    predictedDelayDays,
    delayProbability,
    isDelayed: predictedDelayDays > 0,
    trajectory,
    milestoneForecasts,
    disclaimer: 'AI-generated operational forecast. Verify important management decisions with trial steering committee.',
  };
}

/**
 * Generates monthly trajectory data points for charting
 */
function generateRecruitmentTrajectory({
  startDate,
  targetEndDate,
  forecastedEndDate,
  targetParticipants,
  currentEnrolled,
  effectiveVelocity,
  recruitmentRecords = [],
}) {
  const points = [];
  const start = new Date(startDate);
  const end = new Date(Math.max(targetEndDate.getTime(), forecastedEndDate.getTime()));

  let curr = new Date(start.getFullYear(), start.getMonth(), 1);
  const now = new Date();
  let cumulativeActual = 0;

  while (curr <= end) {
    const monthKey = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}`;
    const isPast = curr <= now;

    // Actual count up to current date
    const record = recruitmentRecords.find((r) => r.monthYear === monthKey);
    if (record) {
      cumulativeActual += record.actualCount;
    } else if (isPast) {
      // interpolate
      const ratio = Math.min(1, (curr - start) / Math.max(1, now - start));
      cumulativeActual = Math.round(ratio * currentEnrolled);
    }

    // Target linear trajectory
    const targetRatio = Math.min(1, Math.max(0, (curr - start) / Math.max(1, targetEndDate - start)));
    const targetCount = Math.round(targetRatio * targetParticipants);

    // AI Forecast trajectory
    let forecastCount = null;
    if (curr >= now) {
      const weeksFromNow = Math.max(0, (curr - now) / (1000 * 60 * 60 * 24 * 7));
      forecastCount = Math.min(targetParticipants, Math.round(currentEnrolled + weeksFromNow * effectiveVelocity));
    } else {
      forecastCount = cumulativeActual;
    }

    points.push({
      month: curr.toLocaleString('default', { month: 'short', year: '2-digit' }),
      monthKey,
      target: targetCount,
      actual: isPast ? Math.min(currentEnrolled, cumulativeActual) : null,
      forecast: forecastCount,
    });

    curr.setMonth(curr.getMonth() + 1);
  }

  return points;
}

module.exports = {
  calculateTrialPrediction,
  generateRecruitmentTrajectory,
};

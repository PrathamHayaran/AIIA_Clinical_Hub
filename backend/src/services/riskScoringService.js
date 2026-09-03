/**
 * AIIA Trial Risk Scoring Engine
 * Computes an objective 0-100 risk score based on multidimensional trial telemetry.
 * Risk Categories:
 *  0 - 30:  Low
 *  31 - 60: Medium
 *  61 - 80: High
 *  81 - 100: Critical
 */

function calculateTrialRisk(trial, options = {}) {
  const {
    milestones = [],
    safetyEvents = [],
    ethicsApproval = null,
    ctriRegistration = null,
  } = options;

  let riskScore = 10; // Baseline low risk
  const breakdown = [];

  // 1. Recruitment Velocity Analysis
  if (trial.targetParticipants > 0) {
    const recruitmentPct = (trial.currentEnrolled / trial.targetParticipants) * 100;
    const now = new Date();
    const start = new Date(trial.startDate);
    const end = new Date(trial.expectedEndDate);
    const totalDurationDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(0, (now - start) / (1000 * 60 * 60 * 24));
    const expectedProgressPct = Math.min(100, (elapsedDays / totalDurationDays) * 100);

    const recruitmentLag = expectedProgressPct - recruitmentPct;

    if (recruitmentLag > 25) {
      const penalty = 25;
      riskScore += penalty;
      breakdown.push({
        factor: 'Recruitment Pace Lag',
        penalty,
        description: `Recruitment is lagging by ${Math.round(recruitmentLag)}% compared to elapsed timeline. Current: ${Math.round(recruitmentPct)}%, Expected: ${Math.round(expectedProgressPct)}%`,
      });
    } else if (recruitmentLag > 10) {
      const penalty = 15;
      riskScore += penalty;
      breakdown.push({
        factor: 'Moderate Recruitment Lag',
        penalty,
        description: `Enrollment is ${Math.round(recruitmentLag)}% behind target curve.`,
      });
    }
  }

  // 2. Delayed Milestones Analysis
  const delayedMilestones = milestones.filter((m) => m.status === 'DELAYED');
  if (delayedMilestones.length > 0) {
    const penalty = Math.min(25, delayedMilestones.length * 12);
    riskScore += penalty;
    breakdown.push({
      factor: 'Milestone Slips',
      penalty,
      description: `${delayedMilestones.length} critical milestone(s) flagged as DELAYED (${delayedMilestones.map((m) => m.title).join(', ')}).`,
    });
  }

  // 3. Safety Events & Pharmacovigilance
  const seriousEvents = safetyEvents.filter(
    (e) => (e.severity === 'Serious' || e.severity === 'Severe') && e.status !== 'Resolved'
  );
  const underReviewEvents = safetyEvents.filter((e) => e.status === 'Under Review' || e.status === 'Investigating');

  if (seriousEvents.length > 0) {
    const penalty = Math.min(25, seriousEvents.length * 15);
    riskScore += penalty;
    breakdown.push({
      factor: 'Unresolved Serious Adverse Events (SAE)',
      penalty,
      description: `${seriousEvents.length} Serious/Severe adverse event(s) actively undergoing safety investigation.`,
    });
  } else if (underReviewEvents.length > 1) {
    const penalty = 8;
    riskScore += penalty;
    breakdown.push({
      factor: 'Adverse Events Under Review',
      penalty,
      description: `${underReviewEvents.length} safety cases pending formal causality assessment.`,
    });
  }

  // 4. Data Quality Penalties
  if (trial.dataQualityScore < 80) {
    const penalty = 15;
    riskScore += penalty;
    breakdown.push({
      factor: 'Data Quality Deficit',
      penalty,
      description: `Data completeness / validation index is sub-optimal at ${trial.dataQualityScore}%.`,
    });
  } else if (trial.dataQualityScore < 90) {
    const penalty = 6;
    riskScore += penalty;
    breakdown.push({
      factor: 'Minor Data Queries',
      penalty,
      description: `Data quality is ${trial.dataQualityScore}%; unverified CRF fields present.`,
    });
  }

  // 5. Compliance, Ethics & CTRI Approvals
  if (ethicsApproval) {
    const daysToExpiry = Math.round((new Date(ethicsApproval.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysToExpiry <= 0) {
      const penalty = 20;
      riskScore += penalty;
      breakdown.push({
        factor: 'Ethics Approval Expired',
        penalty,
        description: 'Institutional Ethics Committee clearance has lapsed. Regulatory non-compliance.',
      });
    } else if (daysToExpiry <= 14) {
      const penalty = 12;
      riskScore += penalty;
      breakdown.push({
        factor: 'Ethics Approval Expiring Imminently',
        penalty,
        description: `IEC approval expires in ${daysToExpiry} days. Renewal documentation submission required.`,
      });
    }
  }

  if (ctriRegistration && ctriRegistration.status === 'Update_Due') {
    const penalty = 8;
    riskScore += penalty;
    breakdown.push({
      factor: 'CTRI 6-Month Filing Due',
      penalty,
      description: 'Mandatory clinical trial registry bi-annual progress filing is due.',
    });
  }

  // 6. Suspended status check
  if (trial.status === 'Suspended') {
    const penalty = 20;
    riskScore += penalty;
    breakdown.push({
      factor: 'Trial Suspended',
      penalty,
      description: 'Clinical trial is currently under formal suspension.',
    });
  }

  // Clamp risk score between 0 and 100
  const finalScore = Math.min(100, Math.max(5, riskScore));

  let category = 'Low';
  if (finalScore >= 81) category = 'Critical';
  else if (finalScore >= 61) category = 'High';
  else if (finalScore >= 31) category = 'Medium';

  return {
    score: finalScore,
    category,
    breakdown,
  };
}

module.exports = {
  calculateTrialRisk,
};

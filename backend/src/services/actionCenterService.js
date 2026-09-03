/**
 * AIIA AI Action Center & Action Prioritization Engine
 * Synthesizes multidimensional clinical trial telemetry to answer:
 * "What needs my attention today, why does it matter, and what action should I consider?"
 */

function generatePrioritizedActionItems({
  trials = [],
  alerts = [],
  safetyEvents = [],
  ethicsApprovals = [],
  ctriRegistrations = [],
  milestones = [],
}) {
  const actions = [];
  const now = new Date();

  trials.forEach((trial) => {
    const trialMilestones = milestones.filter((m) => m.trialId === trial.id);
    const trialSafety = safetyEvents.filter((s) => s.trialId === trial.id);
    const trialEthics = ethicsApprovals.find((e) => e.trialId === trial.id);
    const trialCtri = ctriRegistrations.find((c) => c.trialId === trial.id);

    // 1. Ethics Expiry Critical/High Priority Checks
    if (trialEthics) {
      const daysToExpiry = Math.round((new Date(trialEthics.expiryDate) - now) / (1000 * 60 * 60 * 24));
      if (daysToExpiry <= 0) {
        actions.push({
          id: `ACT-ETH-EXP-${trial.trialId}`,
          trialId: trial.trialId,
          trialTitle: trial.title,
          category: 'Ethics & Regulatory',
          problem: `Ethics Committee clearance has expired.`,
          severity: 'CRITICAL',
          priorityWeight: 100,
          whyItMatters: 'Protocol operations are non-compliant with GCP guidelines and risk formal study suspension.',
          recommendedAction: 'Submit urgent Annual Progress Report (APR) and expedited renewal petition to IEC.',
          actionLink: `/trials/${trial.trialId}`,
          deadline: trialEthics.expiryDate,
        });
      } else if (daysToExpiry <= 5) {
        actions.push({
          id: `ACT-ETH-5D-${trial.trialId}`,
          trialId: trial.trialId,
          trialTitle: trial.title,
          category: 'Ethics & Regulatory',
          problem: `Ethics approval expires in ${daysToExpiry} days.`,
          severity: 'CRITICAL',
          priorityWeight: 95,
          whyItMatters: 'Failure to renew before expiration will halt participant recruitment and dosing.',
          recommendedAction: 'Start renewal workflow and upload trial progress documentation to IEC portal.',
          actionLink: `/trials/${trial.trialId}`,
          deadline: trialEthics.expiryDate,
        });
      } else if (daysToExpiry <= 15) {
        actions.push({
          id: `ACT-ETH-15D-${trial.trialId}`,
          trialId: trial.trialId,
          trialTitle: trial.title,
          category: 'Ethics & Regulatory',
          problem: `Ethics approval expires in ${daysToExpiry} days.`,
          severity: 'HIGH',
          priorityWeight: 80,
          whyItMatters: 'Institutional Ethics Committee review cycles typically require 10-14 days turnaround.',
          recommendedAction: 'Prepare and dispatch investigator progress dossier for committee agenda.',
          actionLink: `/compliance`,
          deadline: trialEthics.expiryDate,
        });
      }
    }

    // 2. Active Serious Adverse Events (SAE)
    const unresolvedSAE = trialSafety.filter(
      (e) => (e.severity === 'Serious' || e.severity === 'Severe') && e.status !== 'Resolved'
    );
    if (unresolvedSAE.length > 0) {
      actions.push({
        id: `ACT-SAE-${trial.trialId}`,
        trialId: trial.trialId,
        trialTitle: trial.title,
        category: 'Pharmacovigilance',
        problem: `${unresolvedSAE.length} Serious Adverse Event(s) actively undergoing investigation.`,
        severity: 'CRITICAL',
        priorityWeight: 92,
        whyItMatters: 'Regulatory reporting mandates formal causality adjudication within strict 7-day window.',
        recommendedAction: 'Convene expedited DSMB safety review and finalize causality assessment.',
        actionLink: `/safety`,
      });
    }

    // 3. Recruitment Velocity Lag & Forecasted Delay
    if (trial.targetParticipants > 0) {
      const recruitmentPct = (trial.currentEnrolled / trial.targetParticipants) * 100;
      const start = new Date(trial.startDate);
      const end = new Date(trial.expectedEndDate);
      const totalDurationDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.max(0, (now - start) / (1000 * 60 * 60 * 24));
      const expectedProgressPct = Math.min(100, (elapsedDays / totalDurationDays) * 100);
      const lag = expectedProgressPct - recruitmentPct;

      if (lag > 25) {
        actions.push({
          id: `ACT-REC-CRIT-${trial.trialId}`,
          trialId: trial.trialId,
          trialTitle: trial.title,
          category: 'Patient Recruitment',
          problem: `Recruitment is projected to miss target by >25%. Current: ${Math.round(recruitmentPct)}% vs ${Math.round(expectedProgressPct)}% expected.`,
          severity: 'HIGH',
          priorityWeight: 85,
          whyItMatters: 'Extended enrollment timelines significantly inflate protocol costs and delay statistical data locks.',
          recommendedAction: 'Review underperforming participating research centers and authorize regional screening camps.',
          actionLink: `/recruitment`,
        });
      }
    }

    // 4. CTRI Registry 6-Month Filing Due
    if (trialCtri && trialCtri.status === 'Update_Due') {
      actions.push({
        id: `ACT-CTRI-${trial.trialId}`,
        trialId: trial.trialId,
        trialTitle: trial.title,
        category: 'Compliance & Registry',
        problem: `CTRI mandatory 6-month progress filing is overdue.`,
        severity: 'HIGH',
        priorityWeight: 75,
        whyItMatters: 'ICMR and CTRI compliance scores impact future national Ayush research grant eligibility.',
        recommendedAction: 'Update CTRI portal with latest patient accrual figures and milestone statuses.',
        actionLink: `/compliance`,
      });
    }

    // 5. Delayed Milestones
    const delayedMilestones = trialMilestones.filter((m) => m.status === 'DELAYED');
    if (delayedMilestones.length > 0) {
      actions.push({
        id: `ACT-MIL-${trial.trialId}`,
        trialId: trial.trialId,
        trialTitle: trial.title,
        category: 'Milestone Execution',
        problem: `${delayedMilestones.length} critical milestone(s) flagged as DELAYED (${delayedMilestones.map((m) => m.title).join(', ')}).`,
        severity: 'MEDIUM',
        priorityWeight: 65,
        whyItMatters: 'Upstream milestone slips cascade into subsequent database lock and publication milestones.',
        recommendedAction: 'Adjust site resource allocation and update projected completion timeline.',
        actionLink: `/trials/${trial.trialId}`,
      });
    }

    // 6. Data Quality Deficits
    if (trial.dataQualityScore < 85) {
      actions.push({
        id: `ACT-DQ-${trial.trialId}`,
        trialId: trial.trialId,
        trialTitle: trial.title,
        category: 'Data Quality',
        problem: `Data quality score has dropped to ${trial.dataQualityScore}%.`,
        severity: 'MEDIUM',
        priorityWeight: 55,
        whyItMatters: 'Open CRF queries and missing fields will prolong statistical data cleaning during lock.',
        recommendedAction: 'Perform remote Source Data Verification (SDV) to close open queries.',
        actionLink: `/trials/${trial.trialId}`,
      });
    }
  });

  // Sort actions by priorityWeight descending
  actions.sort((a, b) => b.priorityWeight - a.priorityWeight);

  const breakdown = {
    critical: actions.filter((a) => a.severity === 'CRITICAL').length,
    high: actions.filter((a) => a.severity === 'HIGH').length,
    medium: actions.filter((a) => a.severity === 'MEDIUM').length,
    low: actions.filter((a) => a.severity === 'LOW').length,
  };

  return {
    totalActions: actions.length,
    breakdown,
    actions,
  };
}

module.exports = {
  generatePrioritizedActionItems,
};

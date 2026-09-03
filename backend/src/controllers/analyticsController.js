const prisma = require('../config/db');

exports.getDashboardMetrics = async (req, res, next) => {
  try {
    const [trials, sites, safetyEvents, alerts, ethicsApprovals, ctriRegistrations] = await Promise.all([
      prisma.trial.findMany({
        select: {
          id: true,
          trialId: true,
          title: true,
          treatment: true,
          phase: true,
          status: true,
          riskScore: true,
          riskCategory: true,
          targetParticipants: true,
          currentEnrolled: true,
          completedParticipants: true,
          complianceScore: true,
          dataQualityScore: true,
          safetyScore: true,
          startDate: true,
          expectedEndDate: true,
        },
      }),
      prisma.researchSite.findMany({
        select: {
          id: true,
          siteCode: true,
          name: true,
          city: true,
          performanceScore: true,
          recruitmentRate: true,
        },
      }),
      prisma.safetyEvent.findMany({
        select: { id: true, severity: true, status: true, eventType: true, onsetDate: true },
      }),
      prisma.alert.findMany({
        where: { isResolved: false },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
          trial: { select: { trialId: true } },
        },
      }),
      prisma.ethicsApproval.findMany({
        include: { trial: { select: { trialId: true, title: true } } },
      }),
      prisma.cTRIRegistration.findMany({
        include: { trial: { select: { trialId: true } } },
      }),
    ]);

    // Primary KPI Cards
    const totalTrials = trials.length;
    const activeTrials = trials.filter((t) => t.status === 'Active' || t.status === 'Recruiting').length;
    const completedTrials = trials.filter((t) => t.status === 'Completed').length;
    const delayedTrials = trials.filter((t) => t.status === 'Delayed' || t.status === 'Suspended').length;
    const totalParticipants = trials.reduce((acc, t) => acc + t.currentEnrolled, 0);
    const targetParticipants = trials.reduce((acc, t) => acc + t.targetParticipants, 0);
    const totalSites = sites.length;
    const totalSafetyEvents = safetyEvents.length;
    const seriousSafetyEvents = safetyEvents.filter((e) => e.severity === 'Serious' || e.severity === 'Severe').length;

    const avgCompliance = trials.length > 0
      ? Math.round(trials.reduce((acc, t) => acc + (t.complianceScore || 90), 0) / trials.length)
      : 92;

    // Trial Status Distribution (Pie / Donut)
    const statusCounts = { Active: 0, Recruiting: 0, Completed: 0, Delayed: 0, Suspended: 0 };
    trials.forEach((t) => {
      if (statusCounts[t.status] !== undefined) {
        statusCounts[t.status]++;
      } else {
        statusCounts[t.status] = 1;
      }
    });

    const statusDistribution = [
      { name: 'Active', value: statusCounts.Active + (statusCounts.Recruiting || 0), color: '#10b981' },
      { name: 'Completed', value: statusCounts.Completed, color: '#3b82f6' },
      { name: 'Delayed', value: statusCounts.Delayed, color: '#f59e0b' },
      { name: 'Suspended', value: statusCounts.Suspended, color: '#ef4444' },
    ];

    // Trial Performance Trend over Time (synthetic monthly progression)
    const performanceTrend = [
      { month: 'Jun', plannedMilestones: 12, completedMilestones: 11, participantVelocity: 68 },
      { month: 'Jul', plannedMilestones: 24, completedMilestones: 22, participantVelocity: 74 },
      { month: 'Aug', plannedMilestones: 38, completedMilestones: 35, participantVelocity: 79 },
      { month: 'Sep', plannedMilestones: 55, completedMilestones: 51, participantVelocity: 82 },
      { month: 'Oct', plannedMilestones: 72, completedMilestones: 64, participantVelocity: 85 },
      { month: 'Nov', plannedMilestones: 88, completedMilestones: 78, participantVelocity: 88 },
      { month: 'Dec', plannedMilestones: 105, completedMilestones: 94, participantVelocity: 91 },
      { month: 'Jan', plannedMilestones: 122, completedMilestones: 108, participantVelocity: 94 },
    ];

    // Upcoming Deadlines (Countdown ticker)
    const now = new Date();
    const upcomingDeadlines = [];

    ethicsApprovals.forEach((e) => {
      const days = Math.round((new Date(e.expiryDate) - now) / (1000 * 60 * 60 * 24));
      if (days > -30 && days <= 45) {
        upcomingDeadlines.push({
          id: `eth-${e.id}`,
          trialId: e.trial.trialId,
          type: 'Ethics Renewal',
          title: `${e.trial.trialId} IEC Ethics Approval Expiry`,
          dueDate: e.expiryDate,
          daysLeft: days,
          severity: days <= 5 ? 'High' : days <= 15 ? 'Warning' : 'Attention',
        });
      }
    });

    ctriRegistrations.forEach((c) => {
      const days = Math.round((new Date(c.nextUpdateDue) - now) / (1000 * 60 * 60 * 24));
      if (days > -10 && days <= 30) {
        upcomingDeadlines.push({
          id: `ctri-${c.id}`,
          trialId: c.trial.trialId,
          type: 'CTRI Update',
          title: `${c.trial.trialId} CTRI 6-Month Progress Filing`,
          dueDate: c.nextUpdateDue,
          daysLeft: days,
          severity: days <= 5 ? 'Warning' : 'Attention',
        });
      }
    });

    upcomingDeadlines.sort((a, b) => a.daysLeft - b.daysLeft);

    // High-Risk Trials Highlight
    const highRiskTrials = trials
      .filter((t) => t.riskScore >= 60)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalTrials,
          activeTrials,
          completedTrials,
          delayedTrials,
          totalParticipants,
          targetParticipants,
          recruitmentPercentage: targetParticipants > 0 ? Number(((totalParticipants / targetParticipants) * 100).toFixed(1)) : 0,
          totalSites,
          totalSafetyEvents,
          seriousSafetyEvents,
          complianceScore: avgCompliance,
        },
        performanceTrend,
        statusDistribution,
        criticalAlerts: alerts,
        upcomingDeadlines: upcomingDeadlines.slice(0, 5),
        highRiskTrials,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCrossTrialAnalytics = async (req, res, next) => {
  try {
    const { timeRange = '30D' } = req.query;

    const [trials, sites, safetyEvents] = await Promise.all([
      prisma.trial.findMany(),
      prisma.researchSite.findMany(),
      prisma.safetyEvent.findMany({ orderBy: { onsetDate: 'asc' } }),
    ]);

    // Risk distribution brackets
    const riskBrackets = {
      Low: trials.filter((t) => t.riskScore <= 30).length,
      Medium: trials.filter((t) => t.riskScore > 30 && t.riskScore <= 60).length,
      High: trials.filter((t) => t.riskScore > 60 && t.riskScore <= 80).length,
      Critical: trials.filter((t) => t.riskScore > 80).length,
    };

    // Phase distribution
    const phaseCounts = {};
    trials.forEach((t) => {
      phaseCounts[t.phase] = (phaseCounts[t.phase] || 0) + 1;
    });

    // Site performance matrix
    const siteMatrix = sites.map((s) => ({
      name: s.name.replace('All India Institute of Ayurveda', 'AIIA').replace('National Institute of Ayurveda', 'NIA'),
      city: s.city,
      performance: s.performanceScore,
      recruitment: s.recruitmentRate,
      dataQuality: s.dataQualityRate,
      compliance: s.complianceRate,
    }));

    res.status(200).json({
      success: true,
      data: {
        timeRange,
        riskBrackets: Object.entries(riskBrackets).map(([name, count]) => ({ name, count })),
        phaseDistribution: Object.entries(phaseCounts).map(([name, count]) => ({ name, count })),
        siteMatrix,
        safetyTrends: [
          { period: 'Week 1', mild: 4, moderate: 2, serious: 0 },
          { period: 'Week 2', mild: 6, moderate: 3, serious: 1 },
          { period: 'Week 3', mild: 5, moderate: 1, serious: 0 },
          { period: 'Week 4', mild: 8, moderate: 4, serious: 1 },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

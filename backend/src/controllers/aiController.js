const prisma = require('../config/db');
const aiService = require('../services/aiService');
const { calculateTrialRisk } = require('../services/riskScoringService');

exports.copilotChat = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required for AIIA Research Copilot.',
      });
    }

    // Prepare safe, de-identified structured context from database
    const [trials, sites, alerts, safetyEvents] = await Promise.all([
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
          complianceScore: true,
          dataQualityScore: true,
          safetyScore: true,
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
          dataQualityRate: true,
          complianceRate: true,
        },
      }),
      prisma.alert.findMany({
        where: { isResolved: false },
        select: {
          id: true,
          type: true,
          severity: true,
          message: true,
          details: true,
        },
      }),
      prisma.safetyEvent.findMany({
        take: 15,
        orderBy: { onsetDate: 'desc' },
        select: {
          eventCode: true,
          trialId: true,
          eventType: true,
          severity: true,
          status: true,
        },
      }),
    ]);

    const contextData = {
      trials,
      sites,
      alerts,
      safetyEvents,
    };

    const aiResponse = await aiService.processCopilotQuery(prompt, contextData);

    res.status(200).json({
      success: true,
      query: prompt,
      data: aiResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrialDiagnosis = async (req, res, next) => {
  try {
    const { trialId } = req.params;

    const trial = await prisma.trial.findFirst({
      where: {
        OR: [{ id: trialId }, { trialId: trialId.toUpperCase() }],
      },
      include: {
        milestones: { orderBy: { sequence: 'asc' } },
        safetyEvents: true,
        ethicsApproval: true,
        ctriRegistration: true,
        trialSites: { include: { site: true } },
      },
    });

    if (!trial) {
      return res.status(404).json({
        success: false,
        message: 'Trial not found.',
      });
    }

    const liveRisk = calculateTrialRisk(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
    });

    const analysis = await aiService.analyzeTrialRisk({
      trial,
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
      riskAnalysis: liveRisk,
    });

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

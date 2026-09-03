const prisma = require('../config/db');
const { calculateTrialRisk } = require('../services/riskScoringService');
const { calculateTrialHealth } = require('../services/healthScoringService');
const { calculateTrialPrediction } = require('../services/predictionService');
const { broadcastEvent } = require('../sockets/socketHandler');

exports.getAllTrials = async (req, res, next) => {
  try {
    const {
      search,
      phase,
      status,
      riskCategory,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const where = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { trialId: { contains: search } },
        { title: { contains: search } },
        { treatment: { contains: search } },
        { principalInvestigator: { contains: search } },
        { indication: { contains: search } },
      ];
    }

    if (phase && phase !== 'ALL') {
      where.phase = phase;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (riskCategory && riskCategory !== 'ALL') {
      where.riskCategory = riskCategory;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [trials, totalCount] = await Promise.all([
      prisma.trial.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
        include: {
          trialSites: {
            include: {
              site: {
                select: { id: true, name: true, city: true, siteCode: true },
              },
            },
          },
          _count: {
            select: {
              safetyEvents: true,
              patients: true,
              alerts: { where: { isResolved: false } },
            },
          },
        },
      }),
      prisma.trial.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: trials,
      meta: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Search by ID or trialId (e.g. AYU-001)
    const trial = await prisma.trial.findFirst({
      where: {
        OR: [{ id: id }, { trialId: id.toUpperCase() }],
      },
      include: {
        milestones: {
          orderBy: { sequence: 'asc' },
        },
        trialSites: {
          include: {
            site: true,
          },
        },
        safetyEvents: {
          orderBy: { onsetDate: 'desc' },
        },
        ethicsApproval: true,
        ctriRegistration: true,
        complianceRecords: {
          orderBy: { dueDate: 'asc' },
        },
        alerts: {
          where: { isResolved: false },
          orderBy: { createdAt: 'desc' },
        },
        createdBy: {
          select: { id: true, name: true, email: true, department: true },
        },
      },
    });

    if (!trial) {
      return res.status(404).json({
        success: false,
        message: `Clinical trial with identifier "${id}" was not found.`,
      });
    }

    // Real-time risk, health, and prediction analysis
    const riskAnalysis = calculateTrialRisk(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
    });

    const healthAnalysis = calculateTrialHealth(trial, {
      milestones: trial.milestones,
      safetyEvents: trial.safetyEvents,
      ethicsApproval: trial.ethicsApproval,
      ctriRegistration: trial.ctriRegistration,
      trialSites: trial.trialSites,
    });

    const predictionAnalysis = calculateTrialPrediction(trial, {
      milestones: trial.milestones,
      trialSites: trial.trialSites,
    });

    res.status(200).json({
      success: true,
      data: {
        ...trial,
        liveRiskAnalysis: riskAnalysis,
        liveHealthAnalysis: healthAnalysis,
        livePrediction: predictionAnalysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createTrial = async (req, res, next) => {
  try {
    const {
      trialId,
      title,
      shortDescription,
      treatment,
      ayurvedicDiscipline = 'Kayachikitsa',
      indication,
      phase = 'Phase II',
      studyType = 'Randomized Double-Blind Placebo-Controlled',
      principalInvestigator,
      targetParticipants = 100,
      startDate,
      expectedEndDate,
      status = 'Recruiting',
      siteIds = [],
    } = req.body;

    if (!trialId || !title || !treatment || !principalInvestigator || !startDate || !expectedEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required clinical trial fields (trialId, title, treatment, PI, dates).',
      });
    }

    const existing = await prisma.trial.findUnique({
      where: { trialId: trialId.toUpperCase().trim() },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A trial with ID "${trialId}" already exists.`,
      });
    }

    const newTrial = await prisma.trial.create({
      data: {
        trialId: trialId.toUpperCase().trim(),
        title,
        shortDescription: shortDescription || `${title} evaluating ${treatment}.`,
        treatment,
        ayurvedicDiscipline,
        indication: indication || 'Clinical Study Cohort',
        phase,
        studyType,
        principalInvestigator,
        targetParticipants: Number(targetParticipants),
        currentEnrolled: 0,
        startDate: new Date(startDate),
        expectedEndDate: new Date(expectedEndDate),
        status,
        riskScore: 10,
        riskCategory: 'Low',
        complianceScore: 100,
        dataQualityScore: 100,
        safetyScore: 100,
        createdById: req.user.id,
      },
    });

    // Create standard default milestones
    const defaultMilestones = [
      { title: 'Scientific Protocol Approval', stage: 'Protocol', seq: 1, status: 'COMPLETED' },
      { title: 'Institutional Ethics Committee Clearance', stage: 'Ethics Approval', seq: 2, status: 'COMPLETED' },
      { title: 'CTRI Mandatory Registration', stage: 'CTRI Registration', seq: 3, status: 'ACTIVE' },
      { title: 'Multi-Site Initiation & Activation', stage: 'Site Activation', seq: 4, status: 'PENDING' },
      { title: 'Patient Recruitment & Screening Phase', stage: 'Patient Recruitment', seq: 5, status: 'PENDING' },
      { title: 'Intervention / Treatment Administration', stage: 'Treatment', seq: 6, status: 'PENDING' },
      { title: 'Clinical Data Collection & Monitoring', stage: 'Data Collection', seq: 7, status: 'PENDING' },
      { title: 'Biostatistical Analysis', stage: 'Analysis', seq: 8, status: 'PENDING' },
      { title: 'Trial Closeout & CSR Submission', stage: 'Closeout', seq: 9, status: 'PENDING' },
    ];

    for (const [idx, m] of defaultMilestones.entries()) {
      await prisma.trialMilestone.create({
        data: {
          trialId: newTrial.id,
          title: m.title,
          stage: m.stage,
          sequence: m.seq,
          status: m.status,
          plannedDate: new Date(new Date(startDate).getTime() + idx * 30 * 24 * 60 * 60 * 1000),
          completedDate: m.status === 'COMPLETED' ? new Date() : null,
        },
      });
    }

    // Attach sites if provided
    if (siteIds && siteIds.length > 0) {
      for (const sId of siteIds) {
        await prisma.trialSite.create({
          data: {
            trialId: newTrial.id,
            siteId: sId,
            targetEnrollment: Math.round(Number(targetParticipants) / siteIds.length),
            currentEnrollment: 0,
            sitePi: principalInvestigator,
          },
        });
      }
    }

    broadcastEvent('trial_created', { trialId: newTrial.trialId, title: newTrial.title });

    res.status(201).json({
      success: true,
      message: `Clinical trial ${newTrial.trialId} successfully created.`,
      data: newTrial,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTrial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    delete updateData.id;
    delete updateData.createdAt;

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.expectedEndDate) updateData.expectedEndDate = new Date(updateData.expectedEndDate);
    if (updateData.targetParticipants) updateData.targetParticipants = Number(updateData.targetParticipants);
    if (updateData.currentEnrolled !== undefined) updateData.currentEnrolled = Number(updateData.currentEnrolled);
    if (updateData.dataQualityScore !== undefined) updateData.dataQualityScore = Number(updateData.dataQualityScore);
    if (updateData.complianceScore !== undefined) updateData.complianceScore = Number(updateData.complianceScore);

    const updated = await prisma.trial.update({
      where: { id },
      data: updateData,
    });

    broadcastEvent('trial_updated', { trialId: updated.trialId, id: updated.id });

    res.status(200).json({
      success: true,
      message: `Trial ${updated.trialId} updated successfully.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTrial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trial = await prisma.trial.delete({
      where: { id },
    });

    broadcastEvent('trial_deleted', { trialId: trial.trialId });

    res.status(200).json({
      success: true,
      message: `Trial ${trial.trialId} and associated records successfully removed.`,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMilestone = async (req, res, next) => {
  try {
    const { milestoneId } = req.params;
    const { status, notes, completedDate } = req.body;

    const milestone = await prisma.trialMilestone.update({
      where: { id: milestoneId },
      data: {
        status,
        notes,
        completedDate: status === 'COMPLETED' ? (completedDate ? new Date(completedDate) : new Date()) : null,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Milestone updated successfully.',
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
};

const { exportTrialToFHIR, exportTrialToCDISC } = require('../services/interoperabilityService');

/**
 * GET /api/trials/:id/export/fhir
 * Export HL7 FHIR ResearchStudy & ResearchSubject resources
 */
exports.exportTrialFHIR = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trial = await prisma.trial.findFirst({
      where: {
        OR: [{ id }, { trialId: id.toUpperCase() }],
      },
      include: {
        trialSites: { include: { site: true } },
        ctriRegistration: true,
        ethicsApproval: true,
        patients: {
          take: 50,
          orderBy: { enrollmentDate: 'asc' },
        },
      },
    });

    if (!trial) {
      return res.status(404).json({
        success: false,
        message: `Clinical trial with identifier "${id}" was not found.`,
      });
    }

    const fhirBundle = exportTrialToFHIR(trial, trial.patients);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="FHIR-ResearchStudy-${trial.trialId || id}.json"`);
    res.status(200).json(fhirBundle);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/trials/:id/export/cdisc
 * Export CDISC SDTM domains (DM, AE, DS, SV)
 */
exports.exportTrialCDISC = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trial = await prisma.trial.findFirst({
      where: {
        OR: [{ id }, { trialId: id.toUpperCase() }],
      },
      include: {
        trialSites: { include: { site: true } },
        ctriRegistration: true,
        ethicsApproval: true,
        patients: {
          take: 50,
          include: { site: true },
          orderBy: { enrollmentDate: 'asc' },
        },
        safetyEvents: {
          orderBy: { onsetDate: 'asc' },
        },
        milestones: {
          orderBy: { sequence: 'asc' },
        },
      },
    });

    if (!trial) {
      return res.status(404).json({
        success: false,
        message: `Clinical trial with identifier "${id}" was not found.`,
      });
    }

    const cdiscExport = exportTrialToCDISC(
      trial,
      trial.patients,
      trial.safetyEvents,
      trial.milestones
    );

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="CDISC-SDTM-${trial.trialId || id}.json"`);
    res.status(200).json(cdiscExport);
  } catch (error) {
    next(error);
  }
};


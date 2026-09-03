const prisma = require('../config/db');
const aiService = require('../services/aiService');
const { broadcastEvent } = require('../sockets/socketHandler');

exports.getSafetyOverview = async (req, res, next) => {
  try {
    const { severity, status, trialId, search } = req.query;

    const where = {};
    if (severity && severity !== 'ALL') where.severity = severity;
    if (status && status !== 'ALL') where.status = status;
    if (trialId && trialId !== 'ALL') where.trialId = trialId;

    if (search && search.trim() !== '') {
      where.OR = [
        { eventCode: { contains: search } },
        { eventType: { contains: search } },
        { description: { contains: search } },
        { syntheticPatientId: { contains: search } },
      ];
    }

    const [events, allEvents] = await Promise.all([
      prisma.safetyEvent.findMany({
        where,
        orderBy: { onsetDate: 'desc' },
        include: {
          trial: {
            select: { id: true, trialId: true, title: true, treatment: true },
          },
        },
      }),
      prisma.safetyEvent.findMany({
        select: { severity: true, status: true, eventType: true, trialId: true },
      }),
    ]);

    const totalEvents = allEvents.length;
    const seriousEvents = allEvents.filter((e) => e.severity === 'Serious' || e.severity === 'Severe').length;
    const underReview = allEvents.filter((e) => e.status === 'Under Review' || e.status === 'Investigating').length;
    const resolved = allEvents.filter((e) => e.status === 'Resolved').length;

    // Severity breakdown
    const severityCount = { Mild: 0, Moderate: 0, Severe: 0, Serious: 0 };
    allEvents.forEach((e) => {
      if (severityCount[e.severity] !== undefined) {
        severityCount[e.severity]++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalEvents,
          seriousEvents,
          underReview,
          resolved,
        },
        severityBreakdown: Object.entries(severityCount).map(([name, count]) => ({ name, count })),
        events,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.logSafetyEvent = async (req, res, next) => {
  try {
    const {
      trialId,
      syntheticPatientId,
      eventType,
      severity = 'Mild',
      description,
      onsetDate,
      causalityAssessment = 'Possible',
      reporterName,
      correctiveAction,
    } = req.body;

    if (!trialId || !eventType || !description || !onsetDate) {
      return res.status(400).json({
        success: false,
        message: 'Trial, Event Type, Description, and Onset Date are required.',
      });
    }

    const count = await prisma.safetyEvent.count();
    const eventCode = `SAE-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const newEvent = await prisma.safetyEvent.create({
      data: {
        eventCode,
        trialId,
        syntheticPatientId: syntheticPatientId || `SYNTH-PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        eventType,
        severity,
        description,
        onsetDate: new Date(onsetDate),
        reportedDate: new Date(),
        status: 'Under Review',
        causalityAssessment,
        reporterName: reporterName || req.user.name,
        correctiveAction,
      },
      include: {
        trial: {
          select: { trialId: true, title: true },
        },
      },
    });

    // If Severe or Serious, create automated high-priority alert
    if (severity === 'Serious' || severity === 'Severe') {
      const alert = await prisma.alert.create({
        data: {
          trialId: newEvent.trialId,
          type: 'Safety',
          severity: 'High',
          message: `🚨 ${severity.toUpperCase()} Adverse Event Logged: ${newEvent.eventCode} (${newEvent.eventType}) on ${newEvent.trial.trialId}`,
          details: description,
        },
      });

      broadcastEvent('new_alert', alert);
    }

    // Broadcast real-time safety update
    broadcastEvent('new_safety_event', newEvent);
    broadcastEvent('dashboard_update', { reason: 'safety_event_logged' });

    res.status(201).json({
      success: true,
      message: `Safety event ${newEvent.eventCode} logged successfully. Real-time broadcast dispatched.`,
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSafetyEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, outcome, correctiveAction, resolutionDate } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (outcome) updateData.outcome = outcome;
    if (correctiveAction) updateData.correctiveAction = correctiveAction;
    if (status === 'Resolved') {
      updateData.resolutionDate = resolutionDate ? new Date(resolutionDate) : new Date();
    }

    const updated = await prisma.safetyEvent.update({
      where: { id },
      data: updateData,
      include: {
        trial: { select: { trialId: true, title: true } },
      },
    });

    broadcastEvent('safety_event_updated', updated);

    res.status(200).json({
      success: true,
      message: `Safety event ${updated.eventCode} status updated to ${updated.status}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateSafetyReport = async (req, res, next) => {
  try {
    const [events, trials] = await Promise.all([
      prisma.safetyEvent.findMany({
        orderBy: { onsetDate: 'desc' },
      }),
      prisma.trial.findMany({
        select: { id: true, trialId: true, title: true, treatment: true },
      }),
    ]);

    const report = await aiService.generateSafetySummary(events, trials);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

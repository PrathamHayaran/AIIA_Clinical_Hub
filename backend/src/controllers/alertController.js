const prisma = require('../config/db');
const alertEngine = require('../services/alertEngine');
const { broadcastEvent } = require('../sockets/socketHandler');

exports.getAllAlerts = async (req, res, next) => {
  try {
    const { severity, type, isResolved } = req.query;

    const where = {};
    if (severity && severity !== 'ALL') where.severity = severity;
    if (type && type !== 'ALL') where.type = type;
    if (isResolved !== undefined) where.isResolved = isResolved === 'true';

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        trial: {
          select: { id: true, trialId: true, title: true, status: true },
        },
      },
    });

    const counts = {
      total: alerts.length,
      high: alerts.filter((a) => a.severity === 'High' && !a.isResolved).length,
      warning: alerts.filter((a) => a.severity === 'Warning' && !a.isResolved).length,
      attention: alerts.filter((a) => a.severity === 'Attention' && !a.isResolved).length,
      resolved: alerts.filter((a) => a.isResolved).length,
    };

    res.status(200).json({
      success: true,
      data: {
        counts,
        alerts,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.resolveAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await prisma.alert.update({
      where: { id },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy: req.user.name,
      },
      include: {
        trial: { select: { trialId: true } },
      },
    });

    broadcastEvent('alert_resolved', alert);
    broadcastEvent('dashboard_update', { reason: 'alert_resolved' });

    res.status(200).json({
      success: true,
      message: 'Alert resolved successfully.',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

exports.triggerAlertScan = async (req, res, next) => {
  try {
    const generated = await alertEngine.evaluateAllTrials();

    res.status(200).json({
      success: true,
      message: `Alert scan complete. ${generated.length} new alerts created.`,
      data: generated,
    });
  } catch (error) {
    next(error);
  }
};

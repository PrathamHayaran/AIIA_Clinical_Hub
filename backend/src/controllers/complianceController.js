const prisma = require('../config/db');

exports.getComplianceOverview = async (req, res, next) => {
  try {
    const [trials, ethicsApprovals, ctriRegistrations, complianceRecords] = await Promise.all([
      prisma.trial.findMany({
        select: {
          id: true,
          trialId: true,
          title: true,
          complianceScore: true,
          status: true,
        },
      }),
      prisma.ethicsApproval.findMany({
        include: {
          trial: { select: { id: true, trialId: true, title: true, status: true } },
        },
        orderBy: { expiryDate: 'asc' },
      }),
      prisma.cTRIRegistration.findMany({
        include: {
          trial: { select: { id: true, trialId: true, title: true } },
        },
        orderBy: { nextUpdateDue: 'asc' },
      }),
      prisma.complianceRecord.findMany({
        include: {
          trial: { select: { id: true, trialId: true } },
        },
        orderBy: { dueDate: 'asc' },
      }),
    ]);

    // Calculate Overall Compliance Score
    const totalScore = trials.reduce((acc, t) => acc + (t.complianceScore || 90), 0);
    const overallScore = trials.length > 0 ? Math.round(totalScore / trials.length) : 92;

    let complianceRating = 'Excellent';
    if (overallScore < 75) complianceRating = 'Action Required';
    else if (overallScore < 85) complianceRating = 'Good';
    else if (overallScore < 95) complianceRating = 'Very Good';

    // Enrich ethics records with days to expiry
    const enrichedEthics = ethicsApprovals.map((e) => {
      const daysLeft = Math.round((new Date(e.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return {
        ...e,
        daysLeft,
        isUrgent: daysLeft <= 14,
        isExpired: daysLeft <= 0,
      };
    });

    // Enrich CTRI records with days to next update
    const enrichedCtri = ctriRegistrations.map((c) => {
      const daysLeft = Math.round((new Date(c.nextUpdateDue) - new Date()) / (1000 * 60 * 60 * 24));
      return {
        ...c,
        daysLeft,
        isDueSoon: daysLeft <= 10,
      };
    });

    // Checklists breakdown
    const gcpCompliantCount = complianceRecords.filter((r) => r.status === 'Compliant').length;
    const gcpPendingCount = complianceRecords.filter((r) => r.status !== 'Compliant').length;

    res.status(200).json({
      success: true,
      data: {
        score: overallScore,
        rating: complianceRating,
        totalTrackedTrials: trials.length,
        ethics: enrichedEthics,
        ctri: enrichedCtri,
        checklists: complianceRecords,
        summary: {
          totalEthicsApprovals: ethicsApprovals.length,
          expiringEthics: enrichedEthics.filter((e) => e.isUrgent && !e.isExpired).length,
          expiredEthics: enrichedEthics.filter((e) => e.isExpired).length,
          ctriUpdateDue: enrichedCtri.filter((c) => c.isDueSoon).length,
          gcpComplianceRate: `${Math.round((gcpCompliantCount / Math.max(1, complianceRecords.length)) * 100)}%`,
          pendingAuditQueries: gcpPendingCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComplianceRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, score, notes, completedDate } = req.body;

    const updated = await prisma.complianceRecord.update({
      where: { id },
      data: {
        status,
        score: score ? Number(score) : undefined,
        notes,
        completedDate: status === 'Compliant' ? (completedDate ? new Date(completedDate) : new Date()) : null,
        verifiedBy: req.user.name,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Compliance record updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEthicsApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { expiryDate, status, renewalRequested, renewalDate } = req.body;

    const updateData = {};
    if (expiryDate) updateData.expiryDate = new Date(expiryDate);
    if (status) updateData.status = status;
    if (renewalRequested !== undefined) updateData.renewalRequested = renewalRequested;
    if (renewalDate) updateData.renewalDate = new Date(renewalDate);

    const updated = await prisma.ethicsApproval.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Ethics approval status updated.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCTRIRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nextUpdateDue, status } = req.body;

    const updateData = { lastUpdatedDate: new Date() };
    if (nextUpdateDue) updateData.nextUpdateDue = new Date(nextUpdateDue);
    if (status) updateData.status = status;

    const updated = await prisma.cTRIRegistration.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'CTRI registry record updated.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

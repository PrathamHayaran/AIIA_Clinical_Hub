const prisma = require('../config/db');

/**
 * Patient Authorization Middleware
 * Ensures the authenticated user has role === 'PATIENT'
 * and attaches their authorized Patient record to req.patient.
 */
const patientGuard = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Active user session required.',
      });
    }

    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to authorized clinical trial participants only.',
      });
    }

    // Resolve the linked Patient record
    const patient = await prisma.patient.findFirst({
      where: { userId: req.user.id },
      include: {
        trial: {
          select: {
            id: true,
            trialId: true,
            title: true,
            shortDescription: true,
            treatment: true,
            ayurvedicDiscipline: true,
            indication: true,
            phase: true,
            studyType: true,
            principalInvestigator: true,
            status: true,
            startDate: true,
            expectedEndDate: true,
          },
        },
        site: {
          select: {
            id: true,
            siteCode: true,
            name: true,
            city: true,
            state: true,
            principalInvestigator: true,
            contactEmail: true,
            contactPhone: true,
          },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'No active clinical trial enrollment record associated with this participant account.',
      });
    }

    req.patient = patient;
    req.patientId = patient.id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = patientGuard;

const prisma = require('../config/db');

exports.getAllSites = async (req, res, next) => {
  try {
    const sites = await prisma.researchSite.findMany({
      orderBy: { performanceScore: 'desc' },
      include: {
        trialSites: {
          include: {
            trial: {
              select: { id: true, trialId: true, title: true, status: true, phase: true },
            },
          },
        },
        _count: {
          select: {
            patients: true,
            trialSites: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: sites.map((s) => ({
        ...s,
        activeTrialsCount: s.trialSites.filter((ts) => ts.trial.status === 'Active' || ts.trial.status === 'Recruiting').length,
        totalEnrolled: s._count.patients,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.getSiteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const site = await prisma.researchSite.findFirst({
      where: {
        OR: [{ id }, { siteCode: id.toUpperCase() }],
      },
      include: {
        trialSites: {
          include: {
            trial: true,
          },
        },
        patients: {
          take: 50,
          orderBy: { enrollmentDate: 'desc' },
        },
      },
    });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Research site not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: site,
    });
  } catch (error) {
    next(error);
  }
};

exports.createSite = async (req, res, next) => {
  try {
    const {
      siteCode,
      name,
      city,
      state,
      principalInvestigator,
      contactEmail,
      contactPhone,
      capacity = 150,
    } = req.body;

    if (!siteCode || !name || !city || !state || !principalInvestigator) {
      return res.status(400).json({
        success: false,
        message: 'Site Code, Name, Location, and PI are required.',
      });
    }

    const site = await prisma.researchSite.create({
      data: {
        siteCode: siteCode.toUpperCase().trim(),
        name,
        city,
        state,
        principalInvestigator,
        contactEmail: contactEmail || `${city.toLowerCase()}@aiia.gov.in`,
        contactPhone: contactPhone || '+91-11-00000000',
        capacity: Number(capacity),
        performanceScore: 85,
        recruitmentRate: 80,
        dataQualityRate: 90,
        complianceRate: 95,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Research site added successfully.',
      data: site,
    });
  } catch (error) {
    next(error);
  }
};

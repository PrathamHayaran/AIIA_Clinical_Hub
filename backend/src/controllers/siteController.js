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
        activeTrialsCount: s.trialSites.filter((ts) => ts.trial && (ts.trial.status === 'Active' || ts.trial.status === 'Recruiting')).length,
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
    let {
      siteCode,
      name,
      city,
      state,
      principalInvestigator,
      contactEmail,
      contactPhone,
      capacity = 150,
      performanceScore = 85,
      recruitmentRate = 80,
      dataQualityRate = 90,
      complianceRate = 95,
    } = req.body;

    if (!name || !city || !state || !principalInvestigator) {
      return res.status(400).json({
        success: false,
        message: 'Institute Name, City, State, and Principal Investigator (PI) are required.',
      });
    }

    // Auto-generate siteCode if not provided
    if (!siteCode || !siteCode.trim()) {
      const cityClean = city.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'CTR';
      const count = await prisma.researchSite.count({
        where: {
          siteCode: {
            startsWith: `SITE-${cityClean}`,
          },
        },
      });
      siteCode = `SITE-${cityClean}-${String(count + 1).padStart(2, '0')}`;
    } else {
      siteCode = siteCode.toUpperCase().trim();
    }

    // Check if siteCode already exists
    const existing = await prisma.researchSite.findUnique({
      where: { siteCode },
    });
    if (existing) {
      siteCode = `${siteCode}-${Math.floor(10 + Math.random() * 90)}`;
    }

    const perfScore = Number(performanceScore) || 85;
    const recruitRate = Number(recruitmentRate) || 80;
    const dqRate = Number(dataQualityRate) || 90;
    const compRate = Number(complianceRate) || 95;
    const bedCapacity = Number(capacity) || 150;

    const site = await prisma.researchSite.create({
      data: {
        siteCode,
        name: name.trim(),
        city: city.trim(),
        state: state.trim(),
        principalInvestigator: principalInvestigator.trim(),
        contactEmail: contactEmail ? contactEmail.trim() : `${city.toLowerCase().replace(/[^a-z0-9]/g, '')}.research@aiia.gov.in`,
        contactPhone: contactPhone ? contactPhone.trim() : '+91-11-29997601',
        capacity: bedCapacity,
        performanceScore: Math.min(100, Math.max(0, perfScore)),
        recruitmentRate: Math.min(100, Math.max(0, recruitRate)),
        dataQualityRate: Math.min(100, Math.max(0, dqRate)),
        complianceRate: Math.min(100, Math.max(0, compRate)),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Ayurvedic research center successfully registered.',
      data: {
        ...site,
        activeTrialsCount: 0,
        totalEnrolled: 0,
        trialSites: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      city,
      state,
      principalInvestigator,
      contactEmail,
      contactPhone,
      capacity,
      performanceScore,
      recruitmentRate,
      dataQualityRate,
      complianceRate,
    } = req.body;

    const existing = await prisma.researchSite.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Research site not found.' });
    }

    const updated = await prisma.researchSite.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(city && { city: city.trim() }),
        ...(state && { state: state.trim() }),
        ...(principalInvestigator && { principalInvestigator: principalInvestigator.trim() }),
        ...(contactEmail && { contactEmail: contactEmail.trim() }),
        ...(contactPhone && { contactPhone: contactPhone.trim() }),
        ...(capacity !== undefined && { capacity: Number(capacity) }),
        ...(performanceScore !== undefined && { performanceScore: Number(performanceScore) }),
        ...(recruitmentRate !== undefined && { recruitmentRate: Number(recruitmentRate) }),
        ...(dataQualityRate !== undefined && { dataQualityRate: Number(dataQualityRate) }),
        ...(complianceRate !== undefined && { complianceRate: Number(complianceRate) }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Research site updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const site = await prisma.researchSite.findUnique({
      where: { id },
      include: {
        _count: {
          select: { trialSites: true, patients: true },
        },
      },
    });

    if (!site) {
      return res.status(404).json({ success: false, message: 'Research site not found.' });
    }

    if (site._count.trialSites > 0 || site._count.patients > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete center '${site.name}' because it is linked to ${site._count.trialSites} trial(s) and ${site._count.patients} patient record(s).`,
      });
    }

    await prisma.researchSite.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Research center removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};


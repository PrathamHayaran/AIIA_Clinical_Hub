const prisma = require('../config/db');

exports.getRecruitmentOverview = async (req, res, next) => {
  try {
    const trials = await prisma.trial.findMany({
      select: {
        id: true,
        trialId: true,
        title: true,
        treatment: true,
        targetParticipants: true,
        currentEnrolled: true,
        completedParticipants: true,
        droppedParticipants: true,
        status: true,
      },
    });

    const totalTarget = trials.reduce((acc, t) => acc + t.targetParticipants, 0);
    const totalEnrolled = trials.reduce((acc, t) => acc + t.currentEnrolled, 0);
    const totalCompleted = trials.reduce((acc, t) => acc + t.completedParticipants, 0);
    const totalDropped = trials.reduce((acc, t) => acc + t.droppedParticipants, 0);
    const remaining = Math.max(0, totalTarget - totalEnrolled);
    const progressPct = totalTarget > 0 ? Number(((totalEnrolled / totalTarget) * 100).toFixed(1)) : 0;
    const dropoutRate = totalEnrolled > 0 ? Number(((totalDropped / totalEnrolled) * 100).toFixed(1)) : 0;

    // Site Comparison
    const sites = await prisma.researchSite.findMany({
      select: {
        id: true,
        siteCode: true,
        name: true,
        city: true,
        recruitmentRate: true,
        performanceScore: true,
        capacity: true,
      },
      orderBy: { recruitmentRate: 'desc' },
    });

    // Monthly Enrollment History aggregation
    const monthlyRecords = await prisma.recruitmentRecord.findMany({
      orderBy: { monthYear: 'asc' },
    });

    const monthlyMap = {};
    monthlyRecords.forEach((r) => {
      if (!monthlyMap[r.monthYear]) {
        monthlyMap[r.monthYear] = { monthYear: r.monthYear, planned: 0, actual: 0 };
      }
      monthlyMap[r.monthYear].planned += r.plannedCount;
      monthlyMap[r.monthYear].actual += r.actualCount;
    });
    const enrollmentTimeline = Object.values(monthlyMap);

    // Dosha Prakriti Demographic Distribution (Synthetic Ayurvedic Insights)
    const patients = await prisma.patient.findMany({
      select: { doshaPrakriti: true, gender: true, age: true },
    });

    const doshaDistribution = {};
    const genderDistribution = { Male: 0, Female: 0, Other: 0 };

    patients.forEach((p) => {
      doshaDistribution[p.doshaPrakriti] = (doshaDistribution[p.doshaPrakriti] || 0) + 1;
      if (genderDistribution[p.gender] !== undefined) {
        genderDistribution[p.gender]++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          target: totalTarget,
          enrolled: totalEnrolled,
          remaining,
          completed: totalCompleted,
          dropped: totalDropped,
          progress: progressPct,
          dropoutRate,
        },
        siteComparison: sites.map((s) => ({
          id: s.id,
          siteCode: s.siteCode,
          name: s.name,
          city: s.city,
          rate: `${s.recruitmentRate}%`,
          percentage: s.recruitmentRate,
          performanceScore: s.performanceScore,
        })),
        enrollmentTimeline,
        demographics: {
          dosha: Object.entries(doshaDistribution).map(([name, count]) => ({ name, count })),
          gender: Object.entries(genderDistribution).map(([name, count]) => ({ name, count })),
          averageAge: patients.length > 0 ? Math.round(patients.reduce((a, b) => a + b.age, 0) / patients.length) : 42,
        },
        trialsList: trials,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrialRecruitment = async (req, res, next) => {
  try {
    const { trialId } = req.params;

    const trial = await prisma.trial.findFirst({
      where: {
        OR: [{ id: trialId }, { trialId: trialId.toUpperCase() }],
      },
      include: {
        trialSites: {
          include: {
            site: true,
          },
        },
        recruitmentRecords: {
          orderBy: { monthYear: 'asc' },
        },
        _count: {
          select: { patients: true },
        },
      },
    });

    if (!trial) {
      return res.status(404).json({
        success: false,
        message: 'Trial not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: trial,
    });
  } catch (error) {
    next(error);
  }
};

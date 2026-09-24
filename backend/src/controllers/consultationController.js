const prisma = require('../config/db');

/**
 * 1. GET /api/consultations/patients
 * Returns all trial participants with conversation metadata, unread counts, and latest messages for staff.
 */
exports.getConsultationPatients = async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        trial: {
          select: { id: true, trialId: true, title: true, treatment: true, phase: true },
        },
        site: {
          select: { id: true, siteCode: true, name: true, city: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user: {
          select: { id: true, name: true, email: true, avatar: true, uniqueId: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Compute unread count and latest message for each patient
    const results = await Promise.all(
      patients.map(async (p) => {
        const unreadCount = await prisma.patientStudyMessage.count({
          where: {
            patientId: p.id,
            senderRole: 'PATIENT',
            isRead: false,
          },
        });

        const totalMessages = await prisma.patientStudyMessage.count({
          where: { patientId: p.id },
        });

        const lastMsg = p.messages[0] || null;

        return {
          id: p.id,
          syntheticPatientId: p.syntheticPatientId,
          patientDisplayId: p.user?.uniqueId || `AIIA-PAT-${p.syntheticPatientId?.split('-')[2] || '1001'}`,
          name: p.user?.name || `Participant ${p.syntheticPatientId}`,
          email: p.user?.email || 'participant@aiia.demo',
          avatar: p.user?.avatar || null,
          age: p.age,
          gender: p.gender,
          doshaPrakriti: p.doshaPrakriti,
          status: p.status,
          adherenceRate: p.adherenceRate || 88,
          trial: p.trial,
          site: p.site,
          unreadCount,
          totalMessages,
          lastMessage: lastMsg
            ? {
                text: lastMsg.message,
                senderRole: lastMsg.senderRole,
                senderName: lastMsg.senderName,
                createdAt: lastMsg.createdAt,
              }
            : null,
        };
      })
    );

    // Sort by:
    // 1. Patients with active messages or unread inquiries FIRST
    // 2. Unread inquiries count descending
    // 3. Most recent message timestamp descending
    // 4. Fallback alphabetical by ID
    results.sort((a, b) => {
      const aHasMsgs = (a.totalMessages > 0 || a.unreadCount > 0) ? 1 : 0;
      const bHasMsgs = (b.totalMessages > 0 || b.unreadCount > 0) ? 1 : 0;
      if (aHasMsgs !== bHasMsgs) return bHasMsgs - aHasMsgs;

      if (a.unreadCount !== b.unreadCount) return b.unreadCount - a.unreadCount;

      const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;

      return a.syntheticPatientId.localeCompare(b.syntheticPatientId);
    });

    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. GET /api/consultations/patient/:patientId
 * Returns full message thread with a specific patient + patient clinical summary context.
 */
exports.getPatientThread = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        trial: true,
        site: true,
        user: { select: { id: true, name: true, email: true, avatar: true, uniqueId: true } },
        visits: {
          where: { status: { in: ['UPCOMING', 'SCHEDULED'] } },
          orderBy: { scheduledDate: 'asc' },
          take: 1,
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    // Mark all incoming messages from PATIENT as read
    await prisma.patientStudyMessage.updateMany({
      where: { patientId, senderRole: 'PATIENT', isRead: false },
      data: { isRead: true },
    });

    // Fetch message history
    const messages = await prisma.patientStudyMessage.findMany({
      where: { patientId },
      orderBy: { createdAt: 'asc' },
    });

    // Fetch recent safety reports count
    const safetyReportsCount = await prisma.safetyEvent.count({
      where: { syntheticPatientId: patient.syntheticPatientId },
    });

    res.status(200).json({
      success: true,
      data: {
        patient: {
          id: patient.id,
          syntheticPatientId: patient.syntheticPatientId,
          patientDisplayId: patient.user?.uniqueId || `AIIA-PAT-1001`,
          name: patient.user?.name || `Participant ${patient.syntheticPatientId}`,
          email: patient.user?.email || 'patient@aiia.demo',
          avatar: patient.user?.avatar,
          age: patient.age,
          gender: patient.gender,
          doshaPrakriti: patient.doshaPrakriti,
          status: patient.status,
          adherenceRate: patient.adherenceRate || 88,
          phone: patient.phone,
          emergencyContact: patient.emergencyContact,
          enrolledDate: patient.enrollmentDate,
        },
        trial: patient.trial,
        site: patient.site,
        nextVisit: patient.visits[0] || null,
        safetyReportsCount,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. POST /api/consultations/patient/:patientId
 * Staff sends a message or clinical response to the patient.
 */
exports.sendMessageToPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { message, subject } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { user: true, trial: true },
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const staffSenderName = req.user.name || 'Study Team Clinician';

    // 1. Create PatientStudyMessage
    const studyMessage = await prisma.patientStudyMessage.create({
      data: {
        patientId: patient.id,
        senderRole: 'STUDY_TEAM',
        senderName: staffSenderName,
        subject: subject ? subject.trim() : 'Study Team Guidance',
        message: message.trim(),
        isRead: false,
      },
    });

    // 2. Create notification for the patient if user account exists
    if (patient.userId) {
      await prisma.notification.create({
        data: {
          userId: patient.userId,
          title: `💬 Message from ${staffSenderName}`,
          message: message.trim().slice(0, 120),
          type: 'info',
          link: '/patient/study-team',
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message delivered to participant portal.',
      data: studyMessage,
    });
  } catch (error) {
    next(error);
  }
};

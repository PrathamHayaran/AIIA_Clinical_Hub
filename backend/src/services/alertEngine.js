const prisma = require('../config/db');
const { calculateTrialRisk } = require('./riskScoringService');

class AlertEngine {
  constructor() {
    this.io = null;
  }

  setSocketIO(ioInstance) {
    this.io = ioInstance;
  }

  async evaluateAllTrials() {
    try {
      const trials = await prisma.trial.findMany({
        where: {
          status: { not: 'Completed' },
        },
        include: {
          milestones: true,
          safetyEvents: true,
          ethicsApproval: true,
          ctriRegistration: true,
          alerts: { where: { isResolved: false } },
        },
      });

      const generatedAlerts = [];

      for (const trial of trials) {
        const riskAnalysis = calculateTrialRisk(trial, {
          milestones: trial.milestones,
          safetyEvents: trial.safetyEvents,
          ethicsApproval: trial.ethicsApproval,
          ctriRegistration: trial.ctriRegistration,
        });

        // Update trial risk score in database if different
        if (trial.riskScore !== riskAnalysis.score || trial.riskCategory !== riskAnalysis.category) {
          await prisma.trial.update({
            where: { id: trial.id },
            data: {
              riskScore: riskAnalysis.score,
              riskCategory: riskAnalysis.category,
            },
          });
        }

        // Check for Ethics Expiry Alert
        if (trial.ethicsApproval) {
          const daysToExpiry = Math.round(
            (new Date(trial.ethicsApproval.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
          );

          if (daysToExpiry <= 14) {
            const existingEthicsAlert = trial.alerts.find((a) => a.type === 'Ethics');
            if (!existingEthicsAlert) {
              const alert = await prisma.alert.create({
                data: {
                  trialId: trial.id,
                  type: 'Ethics',
                  severity: daysToExpiry <= 5 ? 'Warning' : 'Attention',
                  message: `${trial.trialId} IEC Ethics Approval expires in ${daysToExpiry} days.`,
                  details: `Ethics clearance certificate expires on ${new Date(
                    trial.ethicsApproval.expiryDate
                  ).toLocaleDateString()}. Renewal dossier required.`,
                },
              });
              generatedAlerts.push(alert);
            }
          }
        }

        // Check for CTRI Update Due Alert
        if (trial.ctriRegistration && trial.ctriRegistration.status === 'Update_Due') {
          const existingCtriAlert = trial.alerts.find((a) => a.type === 'CTRI');
          if (!existingCtriAlert) {
            const alert = await prisma.alert.create({
              data: {
                trialId: trial.id,
                type: 'CTRI',
                severity: 'Attention',
                message: `${trial.trialId} CTRI 6-month progress filing update is due.`,
                details: `CTRI registration ${trial.ctriRegistration.ctriNumber} requires enrollment telemetry update.`,
              },
            });
            generatedAlerts.push(alert);
          }
        }

        // Check for Serious Safety Event Alert
        const unresolvedSAE = trial.safetyEvents.find(
          (e) => (e.severity === 'Serious' || e.severity === 'Severe') && e.status !== 'Resolved'
        );
        if (unresolvedSAE) {
          const existingSafetyAlert = trial.alerts.find(
            (a) => a.type === 'Safety' && a.message.includes(unresolvedSAE.eventCode)
          );
          if (!existingSafetyAlert) {
            const alert = await prisma.alert.create({
              data: {
                trialId: trial.id,
                type: 'Safety',
                severity: 'High',
                message: `Serious Adverse Event logged on ${trial.trialId} (${unresolvedSAE.eventCode}: ${unresolvedSAE.eventType}).`,
                details: unresolvedSAE.description,
              },
            });
            generatedAlerts.push(alert);
          }
        }
      }

      if (generatedAlerts.length > 0 && this.io) {
        this.io.emit('new_alerts', generatedAlerts);
        this.io.emit('dashboard_update', { timestamp: new Date() });
      }

      return generatedAlerts;
    } catch (error) {
      console.error('Error running AlertEngine evaluation:', error);
      return [];
    }
  }
}

const alertEngine = new AlertEngine();
module.exports = alertEngine;

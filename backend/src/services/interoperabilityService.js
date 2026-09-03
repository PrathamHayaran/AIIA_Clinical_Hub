/**
 * Interoperability Service for AIIA Clinical Trial Hub
 * Generates standards-compliant representations:
 * 1. HL7 FHIR (ResearchStudy & ResearchSubject JSON resources)
 * 2. CDISC SDTM (DM, AE, DS, SV domains)
 * 
 * Note: All data mapped is synthetic demonstration data.
 */

/**
 * Generate HL7 FHIR ResearchStudy and ResearchSubject Bundle
 */
function exportTrialToFHIR(trial, patients = []) {
  const fhirStatusMap = {
    Active: 'active',
    Recruiting: 'active',
    Completed: 'completed',
    Delayed: 'temporarily-closed-to-accrual',
    Suspended: 'suspended',
  };

  const researchStudy = {
    resourceType: 'ResearchStudy',
    id: trial.trialId || trial.id,
    meta: {
      versionId: '1',
      lastUpdated: new Date().toISOString(),
      profile: ['http://hl7.org/fhir/StructureDefinition/ResearchStudy'],
    },
    text: {
      status: 'generated',
      div: `<div xmlns="http://www.w3.org/1999/xhtml"><h3>${trial.title}</h3><p><strong>Treatment:</strong> ${trial.treatment}</p><p><strong>Status:</strong> ${trial.status}</p></div>`,
    },
    identifier: [
      {
        use: 'official',
        system: 'http://aiia.gov.in/trials',
        value: trial.trialId,
      },
      ...(trial.ctriRegistration
        ? [
            {
              use: 'secondary',
              system: 'http://ctri.nic.in',
              value: trial.ctriRegistration.ctriNumber,
            },
          ]
        : []),
    ],
    title: trial.title,
    status: fhirStatusMap[trial.status] || 'active',
    primaryPurposeType: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/research-study-prim-purp-type',
          code: 'treatment',
          display: 'Treatment',
        },
      ],
      text: 'Ayurvedic Clinical Efficacy & Safety Evaluation',
    },
    phase: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/research-study-phase',
          code: trial.phase ? trial.phase.toLowerCase().replace(/\s+/g, '-') : 'phase-2',
          display: trial.phase || 'Phase II',
        },
      ],
      text: trial.phase || 'Phase II',
    },
    category: [
      {
        coding: [
          {
            system: 'http://aiia.gov.in/ayush-disciplines',
            code: trial.ayurvedicDiscipline,
            display: trial.ayurvedicDiscipline,
          },
        ],
        text: trial.ayurvedicDiscipline,
      },
    ],
    condition: [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            display: trial.indication,
          },
        ],
        text: trial.indication,
      },
    ],
    focus: [
      {
        coding: [
          {
            system: 'http://aiia.gov.in/ayurvedic-formulations',
            display: trial.treatment,
          },
        ],
        text: trial.treatment,
      },
    ],
    principalInvestigator: {
      display: trial.principalInvestigator,
    },
    period: {
      start: trial.startDate ? new Date(trial.startDate).toISOString().split('T')[0] : null,
      end: trial.expectedEndDate ? new Date(trial.expectedEndDate).toISOString().split('T')[0] : null,
    },
    enrollment: [
      {
        display: `Target: ${trial.targetParticipants}, Enrolled: ${trial.currentEnrolled}, Completed: ${trial.completedParticipants}`,
      },
    ],
    site: (trial.trialSites || []).map((ts) => ({
      display: ts.site?.name || 'AIIA Research Site',
      identifier: {
        system: 'http://aiia.gov.in/sites',
        value: ts.site?.siteCode || 'SITE-01',
      },
    })),
    extension: [
      {
        url: 'http://aiia.gov.in/fhir/StructureDefinition/trial-risk-score',
        valueInteger: trial.riskScore || 15,
      },
      {
        url: 'http://aiia.gov.in/fhir/StructureDefinition/trial-compliance-score',
        valueInteger: trial.complianceScore || 90,
      },
      {
        url: 'http://aiia.gov.in/fhir/StructureDefinition/data-policy',
        valueString: 'Synthetic demonstration data for SIH prototype',
      },
    ],
  };

  // Map synthetic patients to FHIR ResearchSubject resources
  const researchSubjects = (patients || []).slice(0, 50).map((p) => ({
    resourceType: 'ResearchSubject',
    id: p.syntheticPatientId || p.id,
    identifier: [
      {
        system: 'http://aiia.gov.in/patients/synthetic',
        value: p.syntheticPatientId,
      },
    ],
    status: p.status === 'Completed' ? 'completed' : p.status === 'Dropped' ? 'withdrawn' : 'on-study',
    study: {
      reference: `ResearchStudy/${trial.trialId}`,
      display: trial.title,
    },
    individual: {
      display: `Synthetic Participant (${p.gender || 'Unknown'}, Age: ${p.age || 'N/A'})`,
    },
    extension: [
      {
        url: 'http://aiia.gov.in/fhir/StructureDefinition/dosha-prakriti',
        valueString: p.doshaPrakriti || 'Tridoshic',
      },
      {
        url: 'http://aiia.gov.in/fhir/StructureDefinition/data-completeness',
        valueInteger: p.dataCompleteness || 100,
      },
    ],
  }));

  return {
    resourceType: 'Bundle',
    type: 'collection',
    meta: {
      lastUpdated: new Date().toISOString(),
      disclaimer: 'SYNTHETIC DEMONSTRATION DATA ONLY. Fictional prototype generated for SIH AIIA Clinical Trial Hub.',
    },
    total: 1 + researchSubjects.length,
    entry: [
      { resource: researchStudy },
      ...researchSubjects.map((rs) => ({ resource: rs })),
    ],
  };
}

/**
 * Generate CDISC SDTM Domain Structure
 */
function exportTrialToCDISC(trial, patients = [], safetyEvents = [], milestones = []) {
  const trialId = trial.trialId || 'AYU-001';

  // 1. Demographics (DM) Domain
  const DM = (patients || []).map((p, idx) => ({
    STUDYID: trialId,
    DOMAIN: 'DM',
    USUBJID: `${trialId}-${p.syntheticPatientId || `SYNTH-${1000 + idx}`}`,
    SUBJID: p.syntheticPatientId || `SYNTH-${1000 + idx}`,
    SITEID: p.site?.siteCode || 'SITE-DEL-01',
    AGE: p.age || 45,
    AGEU: 'YEARS',
    SEX: p.gender === 'Male' ? 'M' : p.gender === 'Female' ? 'F' : 'U',
    RACE: 'ASIAN (INDIAN)',
    ETHNIC: 'NOT HISPANIC OR LATINO',
    ARMCD: 'TRT',
    ARM: trial.treatment || 'Ayurvedic Test Formulation',
    DOSHA: p.doshaPrakriti || 'Tridoshic',
    RFSTDTC: p.enrollmentDate ? new Date(p.enrollmentDate).toISOString().split('T')[0] : '2024-03-01',
  }));

  // 2. Adverse Events (AE) Domain
  const AE = (safetyEvents || []).map((se, idx) => ({
    STUDYID: trialId,
    DOMAIN: 'AE',
    USUBJID: `${trialId}-${se.syntheticPatientId || `SYNTH-${1000 + idx}`}`,
    AESEQ: idx + 1,
    AETERM: se.eventType || 'Adverse Event',
    AEDECOD: se.eventType || 'MedDRA Term',
    AESEV: (se.severity || 'Mild').toUpperCase(),
    AESER: se.severity === 'Serious' || se.severity === 'Severe' ? 'Y' : 'N',
    AEREL: (se.causalityAssessment || 'POSSIBLE').toUpperCase(),
    AESTDTC: se.onsetDate ? new Date(se.onsetDate).toISOString().split('T')[0] : '2024-06-01',
    AEENDTC: se.resolutionDate ? new Date(se.resolutionDate).toISOString().split('T')[0] : null,
    AEOUT: (se.outcome || 'RESOLVED').toUpperCase(),
    AESTAT: se.status || 'Resolved',
  }));

  // 3. Disposition (DS) Domain
  const DS = (patients || []).map((p, idx) => ({
    STUDYID: trialId,
    DOMAIN: 'DS',
    USUBJID: `${trialId}-${p.syntheticPatientId || `SYNTH-${1000 + idx}`}`,
    DSSEQ: 1,
    DSCAT: 'PROTOCOL MILESTONE DISPOSITION',
    DSDECOD: (p.status || 'ENROLLED').toUpperCase(),
    DSTERM: p.status === 'Completed' ? 'COMPLETED PROTOCOL INVESTIGATION' : p.status === 'Dropped' ? 'LOST TO FOLLOW-UP' : 'ACTIVE ON STUDY INTERVENTION',
    DSTDTC: new Date().toISOString().split('T')[0],
  }));

  // 4. Subject Visits / Milestone Protocol Schedule (SV) Domain
  const SV = (milestones || []).map((m) => ({
    STUDYID: trialId,
    DOMAIN: 'SV',
    VISITNUM: m.sequence || 1,
    VISIT: m.title || 'Protocol Stage',
    SVSTDTC: m.plannedDate ? new Date(m.plannedDate).toISOString().split('T')[0] : null,
    SVENDTC: m.completedDate ? new Date(m.completedDate).toISOString().split('T')[0] : null,
    SVSTATUS: m.status || 'PENDING',
    SVNOTES: m.stage || 'Clinical Stage',
  }));

  return {
    standard: 'CDISC SDTM v3.3 / CDASH v1.1 Implementation Guide',
    generatedAt: new Date().toISOString(),
    study: {
      studyId: trialId,
      studyTitle: trial.title,
      phase: trial.phase,
      indication: trial.indication,
      treatment: trial.treatment,
      principalInvestigator: trial.principalInvestigator,
      ctriNumber: trial.ctriRegistration?.ctriNumber || 'CTRI-PENDING',
      iecReference: trial.ethicsApproval?.documentRef || 'IEC-APPROVED',
    },
    metadata: {
      disclaimer: 'SYNTHETIC DEMONSTRATION DATA ONLY. Fictional prototype generated for SIH AIIA Clinical Trial Hub.',
      totalDomains: 4,
      recordsCount: {
        DM: DM.length,
        AE: AE.length,
        DS: DS.length,
        SV: SV.length,
      },
    },
    domains: {
      DM, // Demographics
      AE, // Adverse Events
      DS, // Disposition
      SV, // Subject Visits / Milestones
    },
  };
}

module.exports = {
  exportTrialToFHIR,
  exportTrialToCDISC,
};

# AIIA Clinical Trial Hub - Database Architecture

## Entity Relationship Overview

```
User (RBAC: ADMIN, RESEARCHER, SAFETY_OFFICER, COMPLIANCE_OFFICER, MANAGEMENT)
  │
  ├── createdTrials ──> Trial
                          │
                          ├── 1:N ──> TrialMilestone (Protocol -> Closeout)
                          ├── 1:N ──> TrialSite ──> ResearchSite (Multi-center)
                          ├── 1:N ──> Patient (Synthetic de-identified cohort)
                          ├── 1:N ──> RecruitmentRecord (Velocity over time)
                          ├── 1:N ──> SafetyEvent (Pharmacovigilance)
                          ├── 1:N ──> ComplianceRecord (GCP & Audit logs)
                          ├── 1:1 ──> EthicsApproval (IEC Clearance & Expiry)
                          ├── 1:1 ──> CTRIRegistration (Regulatory filings)
                          ├── 1:N ──> Alert (Rule-engine generated)
                          └── 1:N ──> AIAnalysis (Diagnostic historical snapshots)
```

## Schema Entities

### 1. `Trial`
Represents an Ayurvedic clinical trial protocol.
- Key fields: `trialId`, `treatment`, `ayurvedicDiscipline`, `phase`, `principalInvestigator`, `targetParticipants`, `currentEnrolled`, `riskScore`, `riskCategory`, `complianceScore`, `dataQualityScore`, `safetyScore`.

### 2. `ResearchSite`
Represents premier Ayurvedic research centers (AIIA New Delhi, NIA Jaipur, ITRA Jamnagar, AIIA Goa, BHU Varanasi, RARI Mumbai, etc.).
- Tracks operational metrics: `capacity`, `performanceScore`, `recruitmentRate`, `dataQualityRate`, `complianceRate`.

### 3. `Patient`
Synthetic, de-identified patient record. Contains **zero PII** (no names, phone numbers, or addresses).
- Tracks `age`, `gender`, `doshaPrakriti` (*Vata*, *Pitta*, *Kapha*, *Vata-Pitta*, etc.), `status`, `hasAdverseEvent`, `dataCompleteness`.

### 4. `SafetyEvent`
Pharmacovigilance registry tracking adverse events with severity grades: `Mild`, `Moderate`, `Severe`, `Serious` (SAE), `causalityAssessment`, and resolution workflows.

### 5. `EthicsApproval` & `CTRIRegistration`
Regulatory tracking entities monitoring IEC protocol clearance validity, expiration countdowns, and Clinical Trials Registry - India (CTRI) progress filing obligations.

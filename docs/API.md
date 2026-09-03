# AIIA Clinical Trial Hub - REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require a Bearer token in the `Authorization` header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/login`
Authenticates a clinical research user.
- **Body**:
  ```json
  {
    "email": "admin@aiia.demo",
    "password": "Demo@AIIA2025"
  }
  ```
- **Response**: `200 OK` (returns JWT token and user profile)

### `POST /auth/quick-demo`
Instant 1-click role switcher for hackathon testing.
- **Body**: `{ "role": "SAFETY_OFFICER" }` (`ADMIN`, `RESEARCHER`, `SAFETY_OFFICER`, `COMPLIANCE_OFFICER`, `MANAGEMENT`)
- **Response**: `200 OK`

### `GET /auth/me`
Fetches the active authenticated user profile.

---

## 2. Clinical Trials Endpoints (`/trials`)

### `GET /trials`
Retrieves paginated clinical trial catalog.
- **Query Params**: `search`, `phase`, `status`, `riskCategory`, `sortBy`, `sortOrder`, `page`, `limit`.

### `GET /trials/:id`
Retrieves comprehensive protocol details:
- 9-stage milestone progression
- Live AI risk & health score analysis
- Linked research centers & synthetic patient counts
- Pharmacovigilance safety events
- IEC Ethics approval & CTRI regulatory state

### `POST /trials`
Creates a new clinical trial protocol (Roles: `ADMIN`, `RESEARCHER`).

### `PUT /trials/:id`
Updates trial metadata, status, or participant metrics.

### `DELETE /trials/:id`
Deletes a trial (Role: `ADMIN`).

### `PUT /trials/milestones/:milestoneId`
Updates milestone status (`COMPLETED`, `ACTIVE`, `PENDING`, `DELAYED`).

---

## 3. Interoperability & Standard Export Endpoints

### `GET /trials/:id/export/fhir`
Exports an **HL7 FHIR R4/R5 `ResearchStudy` and `ResearchSubject` Bundle** JSON.
- **Headers**: `Content-Disposition: attachment; filename="FHIR-ResearchStudy-AYU-002.json"`
- **Response**: `200 OK` (FHIR Bundle collection)

### `GET /trials/:id/export/cdisc`
Exports a **CDISC SDTM v3.3 Standard Dataset** JSON.
- **Domains Included**:
  - `DM`: Demographics (USUBJID, AGE, SEX, ARM, DOSHA, RFSTDTC)
  - `AE`: Adverse Events (AETERM, AESEV, AESER, AEREL, AESTDTC, AEOUT)
  - `DS`: Disposition (DSDECOD, DSTERM, DSTDTC)
  - `SV`: Subject Visits & Milestones (VISITNUM, VISIT, SVSTDTC, SVSTATUS)
- **Response**: `200 OK`

---

## 4. Intelligence & Decision Support Endpoints (`/intelligence`)

### `GET /intelligence/trial/:id/health`
Calculates multidimensional 0–100 Trial Health Score:
- Composite Score & Category (`Healthy`, `Watchlist`, `At-Risk`, `Critical`)
- Breakdown across Recruitment (25%), Safety (20%), Compliance (20%), Data Quality (15%), Site Performance (10%), and Milestones (10%).

### `GET /intelligence/trial/:id/prediction`
Calculates empirical recruitment velocity, forecasted completion date, predicted delay in days, delay probability (%), and monthly trajectory curves.

### `GET /intelligence/trial/:id/root-cause?metric=recruitment`
Delivers structured evidence-grounded root-cause analysis for any operational parameter.

### `GET /intelligence/trial/:id/site-risk`
Calculates the percentage risk contribution for each participating site in the trial.

### `GET /intelligence/portfolio`
Calculates portfolio health index across all 25 active trials.

### `GET /intelligence/sites`
Returns network intelligence rankings across all 8 apex research institutes.

---

## 5. What-If Scenario Simulation Endpoints (`/scenarios`)

### `POST /scenarios/simulate`
Runs a non-destructive hypothetical intervention simulation.
- **Body**:
  ```json
  {
    "trialId": "AYU-002",
    "scenarioParams": {
      "additionalSites": 2,
      "siteVelocityBoostPct": 15,
      "timelineExtensionDays": 0,
      "resolveSafetyBacklog": false
    }
  }
  ```
- **Response**: `200 OK` (Current vs Simulated metrics and deltas for Risk, Health, and Delay).

### `GET /scenarios/recommend/:trialId`
Evaluates canonical intervention scenarios (A, B, C, D) and outputs the **Rank #1 Recommended Scenario**.

---

## 6. AI Action Center Endpoints (`/action-center`)

### `GET /action-center`
Generates prioritized operational task queues (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) with problem statement, why it matters, and recommended action.

### `POST /action-center/:id/complete`
Acknowledges and resolves an action center item.

---

## 7. AI Research Copilot & Briefings (`/ai`)

### `POST /ai/copilot`
Submits structured queries to the AI Copilot for risk diagnosis, compliance deadlines, site velocity, or formulation comparisons.

### `POST /ai/why`
Explains the causal factors behind any trial metric.

### `POST /ai/briefing`
Generates an Executive Management Briefing across the clinical portfolio.

---

## 8. Pharmacovigilance & Safety Endpoints (`/safety`)

### `GET /safety`
Retrieves adverse events with filtering by `severity`, `status`, and `trialId`.

### `POST /safety`
Logs a new adverse event. Broadcasts live WebSocket alert if severity is `Severe` or `Serious`.

### `GET /safety/report`
Generates an AI Pharmacovigilance Executive Summary Dossier.

---

## 9. Regulatory & Ethics Endpoints (`/compliance`)

### `GET /compliance`
Retrieves IEC ethics approval expiration tracking, CTRI 6-month filing schedules, and GCP compliance audit scores.

---

## 10. Patient Recruitment & Demographics (`/recruitment`)

### `GET /recruitment`
Returns aggregate recruitment pacing, multi-site capacity utilization, and Ayurvedic Dosha Prakriti (*Vata*, *Pitta*, *Kapha*) demographic phenotyping.

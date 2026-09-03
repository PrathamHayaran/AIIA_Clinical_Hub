# 🌿 AIIA Clinical Trial Hub (CTMS 2.0 & Intelligence Platform)

### Real-Time, Cloud-Based, GCP-Compliant Clinical Trial Management & Intelligence System for Ayurvedic Research
**All India Institute of Ayurveda (AIIA) • Ministry of Ayush, Government of India**  
*Smart India Hackathon (SIH) Prototype System*

---

> [!IMPORTANT]
> **SYNTHETIC DEMONSTRATION DATA POLICY**:  
> All clinical trial records, patient demographics, pharmacovigilance reports, ethics approvals, CTRI registrations, and research telemetry in this platform are **100% synthetic demonstration data** created specifically for the SIH prototype. No real patient health information (PHI), confidential institutional data, or live hospital records are stored or accessed. This system is a functional operational decision-support prototype and does not perform clinical diagnosis or replace qualified medical personnel.

---

## 1. Executive Summary & Problem Statement

Ayurvedic clinical research across India faces severe operational bottlenecks:
1. **Institutional Data Silos**: Research centers (New Delhi, Jaipur, Jamnagar, Goa, Varanasi, Mumbai, Bengaluru, Lucknow) operate independently without unified real-time oversight.
2. **Passive Trial Registries**: Conventional registries record data after-the-fact without proactive warning of timeline slips or recruitment deficits.
3. **Regulatory Non-Compliance Risk**: Missed Institutional Ethics Committee (IEC) annual renewal deadlines or statutory 6-month CTRI progress updates risk formal study suspensions under the **New Drugs and Clinical Trials (NDCT) Rules 2019**.
4. **Delayed Pharmacovigilance Signals**: Adverse drug reactions take weeks to reach Data Safety Monitoring Boards (DSMB).

**The Solution:** The **AIIA Clinical Trial Hub** transforms clinical research management into an **AI-Powered Clinical Trial Intelligence & Decision Support Platform**:
- **Role-Based Command Center**: Role-specific KPI telemetry for Admin, Investigators, Safety Officers, Compliance Officers, and Ayush Ministry Executives.
- **Multidimensional Health Scoring (`0–100`)**: Evaluates trial vitality across Recruitment, Safety, Compliance, Data Quality, Site Capacity, and Milestone Velocity.
- **Predictive Trajectory & Delay Forecasting**: Calculates empirical recruitment velocities, projected completion dates, and delay probabilities with monthly trajectory curves.
- **"Why?" AI Root Cause Explainability Engine**: Structured diagnostics delivering direct answers, empirical evidence, and actionable interventions with confidence scores.
- **What-If Trial Scenario Simulator**: Non-destructive hypothetical intervention modeling (+Sites, Velocity Boost, Timeline Extensions) with rank #1 scenario recommendations.
- **AI Action Center**: Prioritizes operational tasks into Critical, High, Medium, and Low queues.
- **Interoperability Standard Exports**: Instant JSON exports for **HL7 FHIR** (`ResearchStudy` & `ResearchSubject`) and **CDISC SDTM** (DM, AE, DS, SV domains).
- **Continuous Alert Engine & Real-Time Sync**: Instant WebSocket synchronization via Socket.IO with live latency telemetry.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REACT SPA FRONTEND (Vite / Port 5173)                   │
│  - Dashboard Command Center (Role Tailored)   - Trial Portfolio Catalog     │
│  - Trial Dossier & Milestone Pipeline         - Patient Recruitment Hub     │
│  - Pharmacovigilance & Safety (PV) Hub        - Regulatory & Ethics Hub     │
│  - AI Action Center & Telemetry Alerts        - AI Research Copilot         │
│  - 3D Botanical Canopy & Tridosha Engine      - Modals (Why?, Scenario)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    REST API (HTTP/JSON) & WebSockets (Socket.IO)
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    EXPRESS BACKEND SERVER (Node.js / Port 5000)             │
│  ├── Security: JWT + Helmet + CORS + Rate Limiting + RBAC Guard             │
│  ├── Continuous Alert & Automated Rule Engine                               │
│  ├── Socket.IO Real-time Synchronization Broadcaster                        │
│  └── Intelligence & Decision Support Layer                                  │
│       ├── Health Scoring Service (0–100 Multidimensional Vitality)          │
│       ├── Prediction Service (Velocity, Delay Days, Trajectory Curve)       │
│       ├── Root Cause Engine (Empirical Evidence-Grounded Diagnostics)       │
│       ├── Scenario Simulator & Recommendation Engine (What-If Analysis)     │
│       ├── Action Center Priority Engine (Critical/High/Med/Low)             │
│       ├── Site Risk Contribution & Research Network Intelligence            │
│       ├── Interoperability Engine (HL7 FHIR & CDISC SDTM Exports)           │
│       └── AI Executive Briefing & Formulation Knowledge Service             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                Prisma ORM Client
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  SYNTHETIC CLINICAL DATABASE (SQLite / dev.db)               │
│  - 25+ Ayurvedic Trials (AYU-001 to AYU-025 across 8 AYUSH disciplines)     │
│  - 8 Premier Research Institutes (AIIA, NIA, ITRA, BHU, RARI, CARI, etc.)   │
│  - 500+ Synthetic Patient Records with Dosha Prakriti Phenotyping           │
│  - 32 Pharmacovigilance Events (7 Serious Adverse Events)                   │
│  - 25 IEC Ethics Approvals & 25 CTRI Registrations                          │
│  - 225 Clinical Milestones across 9-Stage Regulatory Pipelines              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend Client (`frontend/`)
- **Core**: React 18 with Vite
- **Styling**: Tailwind CSS + Custom Sage & Peach Organic Palette (`#608c7d`, `#f4a28c`, `#edf2ef`)
- **State & Routing**: React Context API (`AuthContext`, `NotificationContext`) + React Router v6
- **Visuals & Charts**: Recharts, Lucide React Icons, Framer Motion
- **3D Graphics**: Three.js (3D Interactive Tridosha Balance Orbit, Botanical Canopy, Falling Leaves)
- **Real-Time Client**: Socket.IO Client with automatic reconnection and live latency tracking

### Backend Microservice (`backend/`)
- **Runtime**: Node.js & Express.js RESTful API
- **Database & ORM**: SQLite (`dev.db`) with Prisma ORM `^5.22.0`
- **Security**: JWT authentication, bcryptjs password hashing, Helmet HTTP security headers, CORS, Rate Limiting, RBAC middleware
- **Real-Time Stream**: Socket.IO WebSockets with heartbeat telemetry
- **Engines**: HealthScoringService, PredictionService, RootCauseService, ScenarioService, ActionCenterService, NetworkIntelligenceService, InteroperabilityService, AlertEngine

---

## 4. Role-Based Personas & Demo Accounts

The platform includes **1-click evaluator login cards** on the login screen for instant switching between all 5 roles:

| Role | Demo User | Email | Password | Primary Permissions & Responsibilities |
|---|---|---|---|---|
| **ADMIN** | Dr. Tanuja Nesari | `admin@aiia.demo` | `Demo@AIIA2025` | Global command center, protocol creation/deletion, system settings |
| **RESEARCHER** | Dr. Anand Kumar | `researcher@aiia.demo` | `Demo@AIIA2025` | Trial execution, milestone progression, site management, screening triage |
| **SAFETY_OFFICER** | Dr. Priyadarshini Rao | `safety@aiia.demo` | `Demo@AIIA2025` | Pharmacovigilance, AE/SAE logging, causality audits, safety dossiers |
| **COMPLIANCE_OFFICER**| Adv. Rajeshwar Sharma| `compliance@aiia.demo`| `Demo@AIIA2025` | IEC ethics approvals, CTRI filings, Schedule Y / NDCT audit readiness |
| **MANAGEMENT** | Prof. Vaidya K. S. Dhiman | `management@aiia.demo`| `Demo@AIIA2025` | Portfolio health, ₹42.5 Cr budget utilization, executive briefings |

---

## 5. Core System Capabilities

### 1. 🏥 Trial Health Scoring Engine (`0–100`)
Composite vitality score computed from 6 empirical dimensions:
- **Recruitment Health (25%)**: Enrollment pace vs elapsed study timeline.
- **Safety Health (20%)**: Absence of unresolved Serious Adverse Events (SAEs).
- **Compliance Health (20%)**: IEC clearance validity horizon and CTRI update timeliness.
- **Data Quality Health (15%)**: Electronic Case Report Form (eCRF) completion & query resolution.
- **Site Performance Health (10%)**: Aggregate intake velocity across participating centers.
- **Milestone Velocity Health (10%)**: Ratio of on-schedule vs delayed milestones.

### 2. 🔮 Predictive Delay & Trajectory Forecasting
- Dynamically determines weekly recruitment velocity (`patients/wk`).
- Forecasts completion dates, projected timeline delay (days), and delay probability percentage.
- Plots monthly recruitment curves (`Target Quota` vs `Actual Enrolled` vs `AI Forecast`).

### 3. 🔍 "Why?" AI Root Cause Explainability Engine
- Interactive `[Why?]` trigger buttons on every trial metric.
- Delivers evidence-grounded diagnostics: **Direct Answer**, **Empirical Evidence**, **Underlying Root Causes**, **Recommended Interventions**, and **Confidence Index (85%–95%)**.

### 4. 🧪 What-If Trial Scenario Simulator & Recommendation Engine
- Non-destructive hypothetical intervention modeling:
  - **Additional Research Sites**: `+1` to `+4` centers.
  - **Site Velocity Boost**: `+5%` to `+40%` outreach acceleration.
  - **Timeline Extension**: `+15` to `+90` days regulatory amendment.
- Calculates delta comparisons for **Risk Score**, **Trial Health**, and **Projected Delay**.
- Automatically evaluates canonical scenarios (A, B, C, D) and outputs the **Rank #1 Recommended Scenario**.

### 5. 🚨 AI Action Center Prioritization
- Triages operational tasks into **CRITICAL**, **HIGH**, **MEDIUM**, and **LOW** priority cards with:
  - **Problem Statement**
  - **Why It Matters** (Operational risk rationale)
  - **Recommended Operational Action**
  - 1-click **Open Protocol** and **Acknowledge** actions.

### 6. 🌐 Interoperability Standard Export Layer (CDISC & FHIR)
- **HL7 FHIR R4/R5**: `GET /api/trials/:id/export/fhir` exports complete `ResearchStudy` and `ResearchSubject` JSON bundles.
- **CDISC SDTM v3.3**: `GET /api/trials/:id/export/cdisc` exports structured domains (**DM** - Demographics, **AE** - Adverse Events, **DS** - Disposition, **SV** - Subject Visits).

### 7. ⚡ Live WebSocket Synchronization & Heartbeat Telemetry
- Socket.IO connection broadcasts live safety events, alerts, and dashboard updates.
- Real-time navbar heartbeat indicator displays connection status (`LIVE SYNC`, `RECONNECTING`, `OFFLINE`) and live latency telemetry (`<5ms`).

---

## 6. Installation & Local Setup

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Step 1: Clone Repository
```bash
git clone https://github.com/your-repo/aiia-clinical-trial-hub.git
cd aiia-clinical-trial-hub
```

### Step 2: Backend Setup
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
npm start
```
*Backend server runs on `http://localhost:5000`.*

### Step 3: Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
*Frontend application opens on `http://localhost:5173`.*

---

## 7. Verification & Automated Testing

Run the automated verification test suites in `backend/`:

```bash
cd backend

# Run the complete end-to-end full stack verification
node verify_full_system.js

# Run the intelligence and decision support test suite
node verify_intelligence_system.js
```

Both test suites validate:
- REST API health & response codes
- Authentication for all 5 demo roles
- 0–100 Health score calculations
- Predictive delay & trajectory curves
- AI Root-cause explainability
- What-If scenario simulations
- AI Action Center prioritization
- Interoperability exports (FHIR & CDISC)
- Real-time Socket.IO synchronization

---

## 8. Hackathon Judge Demonstration Flow

Follow this 10-step walkthrough for evaluating the platform:

1. **Step 1 — Login**: Open `http://localhost:5173/login` and click **"1-Click Login: Management (Prof. Vaidya K. S. Dhiman)"**.
2. **Step 2 — Executive Command Center**: View the tailored Management Dashboard with national portfolio KPIs (25 Trials, 3,740 / 4,350 Cohort, ₹42.5 Cr budget utilization).
3. **Step 3 — Inspect High-Risk Trial**: Navigate to [Trials Catalog](http://localhost:5173/trials) and open **AYU-002** (*Bio-Enhanced Curcumin in Knee Osteoarthritis*).
4. **Step 4 — Review Dossier & KPIs**: Observe the **Risk Score (88/100 • Critical)**, **Trial Health (52/100 • At-Risk)**, and **AI Forecast (+18d Delay, 78% prob)**.
5. **Step 5 — "Why?" Explainability**: Click the **`[Why?]`** button on Recruitment or Delay to open the AI Root Cause Diagnostic modal with empirical evidence and confidence scores.
6. **Step 6 — What-If Simulator**: Click **`[SIMULATE SCENARIOS]`**, adjust sliders (+2 Research Sites, +15% Velocity), and view the **Current vs Simulated Outcome** comparison and the **Rank #1 Recommended Scenario**.
7. **Step 7 — Interoperability Exports**: Click **`[FHIR JSON]`** and **`[CDISC SDTM]`** in the header to download valid HL7 FHIR and CDISC SDTM standard JSON datasets.
8. **Step 8 — AI Action Center**: Open [Alerts & Action Center](http://localhost:5173/alerts) to inspect prioritized operational queues (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) with "Why It Matters" and "Recommended Action".
9. **Step 9 — Role Switching**: Switch to **Compliance Officer** to inspect IEC ethics expiration horizons (<15 days) and CTRI 6-month filing schedules, or switch to **Safety Officer** to inspect pharmacovigilance adverse event signals.
10. **Step 10 — AI Research Copilot**: Open [AI Copilot](http://localhost:5173/ai-copilot) and query: *"Which intervention gives the best outcome for AYU-002?"* or click *"Brief Me — Executive Management Summary"*.

---

## 9. Regulatory & Legal Disclaimer

*The AIIA Clinical Trial Hub is a conceptual and technical prototype developed for academic and demonstration purposes. Regulatory terminology (GCP, Schedule Y, NDCT Rules 2019, CTRI, CDISC SDTM, HL7 FHIR) represents workflow implementations within the prototype and does not constitute formal legal or regulatory certification. All patient and trial data is fictional.*

---

**Developed for All India Institute of Ayurveda (AIIA) & Smart India Hackathon**

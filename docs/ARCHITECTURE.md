# AIIA Clinical Trial Hub - System Architecture & Data Flow

## 1. Architectural Philosophy
The **AIIA Clinical Trial Hub** is built with clean decoupled layers:
1. **Frontend Layer**: Standalone Single Page Application (SPA) utilizing React 18, Vite, Tailwind CSS, Recharts, Framer Motion, Three.js, and Socket.IO-Client.
2. **Backend REST & WebSocket Layer**: Node.js & Express microservice with Prisma ORM, JWT security, Role-Based Access Control (RBAC), Continuous Alert Engine, and WebSocket broadcaster.
3. **Intelligence & Decision Support Layer**:
   - `healthScoringService.js`: Computes 0–100 multidimensional Trial Health Score.
   - `predictionService.js`: Predicts weekly intake velocity, forecasted completion, and delay probabilities.
   - `rootCauseService.js`: Provides structured evidence-grounded root-cause analysis for "Why?" explainability.
   - `scenarioService.js`: Powers the What-If Simulator and Scenario Recommendation Engine (Scenarios A, B, C, D).
   - `actionCenterService.js`: Generates prioritized actions (Critical, High, Medium, Low).
   - `networkIntelligenceService.js`: Evaluates site performance across 8 institutes and computes per-trial site risk contributions.
   - `interoperabilityService.js`: Exports HL7 FHIR (ResearchStudy/ResearchSubject) and CDISC SDTM (DM, AE, DS, SV) standard datasets.
   - `aiService.js`: AI Copilot with executive briefings, scenario reasoning, and formulation analytics.
4. **Synthetic Data Layer**: SQLite (`dev.db`) managed via Prisma ORM with strictly synthetic de-identified demonstration data.

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

## 2. Security & Compliance Model
- **No Direct Database Access**: Frontend never communicates directly with the database.
- **De-Identified Data Only**: All patient records use synthetic identifiers (`SYNTH-AYU-002-0007`) with zero personal identifiable information (PII).
- **Audit Trails**: Critical operations (safety event logging, status escalations, compliance verifications) record investigator identities and timestamps.
- **Demo Mode**: Explicitly indicated throughout the interface to prevent confusion with production regulatory environments.

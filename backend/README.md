# AIIA Clinical Trial Hub - Backend API Server

Production-ready backend for the **All India Institute of Ayurveda (AIIA)** Clinical Trial Management System (CTMS).

## Key Features
- **Strict Separation**: Operates completely decoupled from the frontend, serving data exclusively through REST endpoints and WebSockets.
- **Role-Based Access Control (RBAC)**: Supports `ADMIN`, `RESEARCHER`, `SAFETY_OFFICER`, `COMPLIANCE_OFFICER`, and `MANAGEMENT` roles.
- **AI Research Copilot Layer**: Formats safe, de-identified structured clinical telemetry for LLM processing with rich causal reasoning and risk factor breakdowns.
- **Continuous Rule & Alert Engine**: Automatically computes real-time 0–100 trial risk scores and alerts on recruitment lags, ethics expirations, and safety events.
- **Real-Time WebSocket Broadcasts**: Instant client dashboard and toast updates on adverse event creation or alert resolutions.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Push database schema & generate Prisma Client
npx prisma db push

# 3. Seed synthetic Ayurvedic clinical trials dataset
npm run prisma:seed

# 4. Start backend server (Port 5000)
npm run dev
```

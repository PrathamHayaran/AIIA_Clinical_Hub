# AIIA Clinical Trial Hub - Database Management

This directory contains database schemas, reference SQL DDL, and migration scripts.

## Database Providers
- **SQLite (Default for Instant Local Hackathon Setup)**: Pre-configured with zero installation hurdles at `backend/prisma/dev.db`.
- **PostgreSQL (Production Deployment)**: Reference schema file available in `database/schema/schema.sql`. To switch to PostgreSQL, simply update `DATABASE_URL` in `backend/.env` and adjust the provider in `backend/prisma/schema.prisma`.

## Seed Data Summary
- **Trials**: 25 diverse Ayurvedic formulations (*Ashwagandha, Curcumin, Guduchi, Triphala, Brahmi, Shilajit, Punarnava, Arjuna, Shatavari, Guggulu, etc.*).
- **Sites**: 8 premier Ayurvedic institutes (*AIIA New Delhi, NIA Jaipur, ITRA Jamnagar, AIIA Goa, BHU Varanasi, RARI Mumbai, CARI Bengaluru, CCRAS Lucknow*).
- **Patients**: 600+ synthetic de-identified records with Dosha Prakriti profiles.
- **Safety**: 32 adverse events with complete pharmacovigilance causality audits.

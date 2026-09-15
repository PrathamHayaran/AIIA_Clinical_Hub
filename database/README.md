# AIIA Clinical Trial Hub - Database Management

This directory contains database schemas, reference SQL DDL, and migration scripts.

## Database Configuration
- **PostgreSQL (Primary Database Engine)**: Configured in `backend/prisma/schema.prisma` (`provider = "postgresql"`). Works with cloud PostgreSQL (Supabase, Neon, Railway, Render, AWS RDS) or local PostgreSQL instances.
- **Connection Format**: Set `DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"` in `backend/.env`.

## Seed Data Summary
- **Trials**: 25 diverse Ayurvedic formulations (*Ashwagandha, Curcumin, Guduchi, Triphala, Brahmi, Shilajit, Punarnava, Arjuna, Shatavari, Guggulu, etc.*).
- **Sites**: 8 premier Ayurvedic institutes (*AIIA New Delhi, NIA Jaipur, ITRA Jamnagar, AIIA Goa, BHU Varanasi, RARI Mumbai, CARI Bengaluru, CCRAS Lucknow*).
- **Patients**: 600+ synthetic de-identified records with Dosha Prakriti profiles.
- **Safety**: 32 adverse events with complete pharmacovigilance causality audits.

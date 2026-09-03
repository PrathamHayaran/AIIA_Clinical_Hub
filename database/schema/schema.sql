-- =============================================================================
-- ALL INDIA INSTITUTE OF AYURVEDA (AIIA) - CLINICAL TRIAL HUB
-- PostgreSQL Database Schema Reference DDL
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & RBAC
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'RESEARCHER', 'SAFETY_OFFICER', 'COMPLIANCE_OFFICER', 'MANAGEMENT')),
    department VARCHAR(255) DEFAULT 'Clinical Research',
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Research Sites
CREATE TABLE IF NOT EXISTS research_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    principal_investigator VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 200,
    performance_score INT DEFAULT 85,
    recruitment_rate INT DEFAULT 80,
    data_quality_rate INT DEFAULT 90,
    compliance_rate INT DEFAULT 95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Clinical Trials
CREATE TABLE IF NOT EXISTS trials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trial_id VARCHAR(50) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    treatment VARCHAR(255) NOT NULL,
    ayurvedic_discipline VARCHAR(100) NOT NULL,
    indication VARCHAR(255) NOT NULL,
    phase VARCHAR(50) NOT NULL,
    study_type VARCHAR(255) NOT NULL,
    principal_investigator VARCHAR(255) NOT NULL,
    target_participants INT DEFAULT 100,
    current_enrolled INT DEFAULT 0,
    completed_participants INT DEFAULT 0,
    dropped_participants INT DEFAULT 0,
    start_date DATE NOT NULL,
    expected_end_date DATE NOT NULL,
    actual_end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    risk_score INT DEFAULT 15,
    risk_category VARCHAR(50) DEFAULT 'Low',
    compliance_score INT DEFAULT 90,
    data_quality_score INT DEFAULT 95,
    safety_score INT DEFAULT 98,
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Trial Milestones
CREATE TABLE IF NOT EXISTS trial_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trial_id UUID NOT NULL REFERENCES trials(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    sequence INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING',
    planned_date DATE NOT NULL,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Trial Site Mapping
CREATE TABLE IF NOT EXISTS trial_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trial_id UUID NOT NULL REFERENCES trials(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES research_sites(id) ON DELETE CASCADE,
    target_enrollment INT DEFAULT 50,
    current_enrollment INT DEFAULT 0,
    site_pi VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    activation_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(trial_id, site_id)
);

-- 6. Synthetic Patients
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    synthetic_patient_id VARCHAR(100) UNIQUE NOT NULL,
    trial_id UUID NOT NULL REFERENCES trials(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES research_sites(id) ON DELETE CASCADE,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dosha_prakriti VARCHAR(50) NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Enrolled',
    has_adverse_event BOOLEAN DEFAULT FALSE,
    data_completeness INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Pharmacovigilance Safety Events
CREATE TABLE IF NOT EXISTS safety_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_code VARCHAR(50) UNIQUE NOT NULL,
    trial_id UUID NOT NULL REFERENCES trials(id) ON DELETE CASCADE,
    synthetic_patient_id VARCHAR(100),
    event_type VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('Mild', 'Moderate', 'Severe', 'Serious')),
    description TEXT NOT NULL,
    onset_date DATE NOT NULL,
    reported_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Under Review',
    outcome VARCHAR(100),
    causality_assessment VARCHAR(100),
    reporter_name VARCHAR(255) NOT NULL,
    corrective_action TEXT,
    resolution_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Ethics Committee Approvals
CREATE TABLE IF NOT EXISTS ethics_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trial_id UUID UNIQUE NOT NULL REFERENCES trials(id) ON DELETE CASCADE,
    committee_name VARCHAR(255) NOT NULL,
    protocol_number VARCHAR(100) NOT NULL,
    approval_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Approved',
    renewal_requested BOOLEAN DEFAULT FALSE,
    renewal_date DATE,
    document_ref VARCHAR(255) DEFAULT 'IEC/AIIA/2024/PROT-089',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. CTRI Registrations
CREATE TABLE IF NOT EXISTS ctri_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trial_id UUID UNIQUE NOT NULL REFERENCES trials(id) ON DELETE CASCADE,
    ctri_number VARCHAR(100) NOT NULL,
    registration_date DATE NOT NULL,
    last_updated_date DATE NOT NULL,
    next_update_due DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Registered',
    url VARCHAR(500) DEFAULT 'https://ctri.nic.in',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Automated Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trial_id UUID REFERENCES trials(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('High', 'Warning', 'Attention', 'Info')),
    message TEXT NOT NULL,
    details TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

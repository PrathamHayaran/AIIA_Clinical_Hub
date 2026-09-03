import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import {
  MapPin,
  FlaskConical,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Compass,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  Bot,
  Users,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Award,
  Stethoscope,
  Briefcase,
} from 'lucide-react';
import { AyurvedicTridosha3D } from '../components/3d/AyurvedicTridosha3D';
import { HerbalLeaf3D } from '../components/3d/HerbalLeaf3D';
import { BotanicalCornerBranch3D } from '../components/3d/BotanicalCornerBranch3D';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lastUpdate } = useNotification();

  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab1, setActiveTab1] = useState('Now');
  const [activeTab2, setActiveTab2] = useState('Active');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchDashboard();
  }, [lastUpdate]);

  const kpis = dashboardData?.kpis || {};
  const role = user?.role || 'ADMIN';

  const currentDate = new Date();
  const dayNum = currentDate.getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  /* =========================================================================
     ROLE CONFIGURATION: Data & Metrics tailored per role
     ========================================================================= */
  const roleConfigs = {
    ADMIN: {
      roleTitle: 'AIIA Central Command Center',
      subTitle: 'All India Institute of Ayurveda • Ministry of Ayush, New Delhi',
      pillLabel: 'Protocols',
      pillValue: kpis.totalTrials || 25,
      pillIcon: FlaskConical,
      totalMetricTitle: 'Active Cohort:',
      totalMetricValue: kpis.totalParticipants ? `${kpis.totalParticipants.toLocaleString()} Patients` : '3,740 / 4,350 (86%)',
      equalizer1Title: 'Recruitment Velocity:',
      equalizer1Main: '86 %',
      equalizer1Sub: '• 3,740 / 4,350',
      equalizer1Bars: [
        { label: 'DEL', h: '92%', active: true },
        { label: 'JAM', h: '85%' },
        { label: 'VAR', h: '88%' },
        { label: 'JAI', h: '78%' },
        { label: 'UDU', h: '82%' },
        { label: 'KOL', h: '75%' },
        { label: 'BLR', h: '70%' },
      ],
      equalizer2Title: 'GCP Compliance & Quality:',
      equalizer2Main: '94 %',
      equalizer2Sub: '• Audit Ready',
      equalizer2Bars: [
        { label: 'IEC', h: '98%', active: true },
        { label: 'CTRI', h: '95%' },
        { label: 'eCRF', h: '92%' },
        { label: 'PV', h: '90%' },
        { label: 'DSMB', h: '88%' },
        { label: 'AUD', h: '94%' },
        { label: 'CSR', h: '85%' },
      ],
      journeyTitle: 'Protocol Velocity:',
      journeyMain: '86%',
      journeySub: 'Quota',
      journeyBadge: '20/25 Active',
      col1Title: 'Active Protocols:',
      col1Link: '/trials',
      col1Cards: [
        { id: 'AYU-002', title: 'AYU-002 • Knee Osteoarthritis', sub: 'Curcumin BCM-95 vs Celecoxib', badge: '88/100 • Critical', badgeType: 'danger' },
        { id: 'AYU-001', title: 'AYU-001 • Diabetic Neuropathy', sub: 'Standardized Ashwagandha Extract', badge: '22/100 • Low Risk', badgeType: 'success' },
        { id: 'AYU-005', title: 'AYU-005 • Metabolic Syndrome', sub: 'Triphala Guggulu Lipid Cohort', badge: '64/100 • High Risk', badgeType: 'warning' },
      ],
      col2Title: 'Research Centers:',
      photo1: { title: 'AIIA Main Campus', sub1: 'New Delhi • Apex Center', sub2: '12 Active Protocols • 200 Beds', img: '/assets/aiia_campus.jpg', link: '/sites' },
      photo2: { title: 'IPGTRA Jamnagar', sub: '6 Protocols • Gujarat Institute', img: '/assets/ipgtra_campus.jpg', link: '/sites' },
      photo3: { title: 'BHU Varanasi', sub: 'Faculty of Ayurveda', img: '/assets/aiia_campus.jpg', link: '/trials' },
      ctaText: 'Run AI Risk Diagnosis',
      ctaLink: '/ai-copilot',
    },

    RESEARCHER: {
      roleTitle: 'Investigator Workspace',
      subTitle: `Department of ${user?.department || 'Kayachikitsa'} • Lead Investigator`,
      pillLabel: 'My Cohort',
      pillValue: '128 / 150',
      pillIcon: Stethoscope,
      totalMetricTitle: 'Protocol Enrollment:',
      totalMetricValue: '128 / 150 (85% Target Met)',
      equalizer1Title: 'Cohort Velocity:',
      equalizer1Main: '85 %',
      equalizer1Sub: '• 3 Study Arms',
      equalizer1Bars: [
        { label: 'Arm A', h: '90%', active: true },
        { label: 'Arm B', h: '84%' },
        { label: 'Arm C', h: '82%' },
        { label: 'Screen', h: '95%' },
        { label: 'FUP-1', h: '88%' },
        { label: 'FUP-2', h: '80%' },
        { label: 'Close', h: '75%' },
      ],
      equalizer2Title: 'eCRF Completeness:',
      equalizer2Main: '96 %',
      equalizer2Sub: '• 124 Verified',
      equalizer2Bars: [
        { label: 'Base', h: '98%', active: true },
        { label: 'Wk 2', h: '95%' },
        { label: 'Wk 4', h: '92%' },
        { label: 'Wk 8', h: '90%' },
        { label: 'Wk 12', h: '88%' },
        { label: 'Lab', h: '94%' },
        { label: 'Lock', h: '86%' },
      ],
      journeyTitle: 'Milestone Progress:',
      journeyMain: '7 / 9',
      journeySub: 'Stages',
      journeyBadge: 'On Schedule',
      col1Title: 'My Assigned Protocols:',
      col1Link: '/trials',
      col1Cards: [
        { id: 'AYU-001', title: 'AYU-001 • Diabetic Neuropathy', sub: 'Target: 150 | Enrolled: 128 (85%)', badge: '22/100 • Low Risk', badgeType: 'success' },
        { id: 'AYU-003', title: 'AYU-003 • Generalized Anxiety', sub: 'Target: 120 | Enrolled: 110 (92%)', badge: '18/100 • Optimal', badgeType: 'success' },
        { id: 'AYU-007', title: 'AYU-007 • Rheumatoid Arthritis', sub: 'Target: 80 | Enrolled: 62 (78%)', badge: '45/100 • Medium', badgeType: 'warning' },
      ],
      col2Title: 'Clinical Facilities:',
      photo1: { title: 'AIIA Kayachikitsa Ward', sub1: 'Clinical Inpatient Center', sub2: '45 Patients on Active Regimen', img: '/assets/aiia_campus.jpg', link: '/sites' },
      photo2: { title: 'AIIA Central Diagnostic Bio-Lab', sub: '128 Serum Samples Processed', img: '/assets/ipgtra_campus.jpg', link: '/sites' },
      photo3: { title: 'Pharmacology Unit', sub: 'Dosha Bio-Markers Room', img: '/assets/aiia_campus.jpg', link: '/recruitment' },
      ctaText: 'Run AI Protocol Diagnosis',
      ctaLink: '/ai-copilot',
    },

    SAFETY_OFFICER: {
      roleTitle: 'Pharmacovigilance & Drug Safety Unit',
      subTitle: 'AIIA ADR Monitoring Center • National Pharmacovigilance Program (PvPI)',
      pillLabel: 'Incidents',
      pillValue: kpis.safetyEventsCount || 32,
      pillIcon: ShieldAlert,
      totalMetricTitle: 'Safety Resolution Rate:',
      totalMetricValue: '25 / 32 Resolved (78%)',
      equalizer1Title: 'Severity Spectrum:',
      equalizer1Main: '32 Logged',
      equalizer1Sub: '• 7 Serious SAEs',
      equalizer1Bars: [
        { label: 'Mild', h: '70%' },
        { label: 'Mod', h: '60%' },
        { label: 'Sev', h: '40%' },
        { label: 'SAE', h: '95%', active: true },
        { label: 'GI', h: '65%' },
        { label: 'Skin', h: '50%' },
        { label: 'LFT', h: '85%' },
      ],
      equalizer2Title: 'Causality Confidence:',
      equalizer2Main: '92 %',
      equalizer2Sub: '• DSMB Audited',
      equalizer2Bars: [
        { label: 'Prob', h: '85%', active: true },
        { label: 'Poss', h: '90%' },
        { label: 'Unlik', h: '45%' },
        { label: 'None', h: '35%' },
        { label: 'DSMB', h: '92%' },
        { label: 'ICMR', h: '88%' },
        { label: 'Close', h: '80%' },
      ],
      journeyTitle: 'SAE Resolution Window:',
      journeyMain: '100%',
      journeySub: 'In Time',
      journeyBadge: '<14d Statutory',
      col1Title: 'High-Priority Safety Alerts:',
      col1Link: '/safety',
      col1Cards: [
        { id: 'AYU-002', title: 'SAE-2025-001 • Elevated ALT/AST', sub: 'AYU-002 Curcumin Cohort • Day 28', badge: 'Serious SAE • Review', badgeType: 'danger' },
        { id: 'AYU-004', title: 'SAE-2025-004 • Acute Rash Flare', sub: 'AYU-004 Rasaushadhi Cohort • Day 14', badge: 'Severe • Resolved', badgeType: 'warning' },
        { id: 'AYU-001', title: 'AE-2025-018 • Mild Gastric Upset', sub: 'AYU-001 Ashwagandha • Self-limiting', badge: 'Mild • Resolved', badgeType: 'success' },
      ],
      col2Title: 'Investigational Formulations:',
      photo1: { title: 'Bio-Enhanced Curcumin BCM-95', sub1: 'Batch B-8821 • High Surveillance', sub2: 'Hepatic Function Panel Active', img: '/assets/aiia_campus.jpg', link: '/safety' },
      photo2: { title: 'Standardized Withanolide Extract', sub: 'Batch W-4402 • Clean Profile', img: '/assets/ipgtra_campus.jpg', link: '/safety' },
      photo3: { title: 'Purified Guggulipid', sub: 'Lipid Safety Profile Checked', img: '/assets/aiia_campus.jpg', link: '/safety' },
      ctaText: 'Generate PV Safety Dossier',
      ctaLink: '/safety',
    },

    COMPLIANCE_OFFICER: {
      roleTitle: 'Regulatory Compliance & Ethics Secretariat',
      subTitle: 'Institutional Ethics Committee (IEC-AIIA) & CTRI Statutory Secretariat',
      pillLabel: 'GCP Score',
      pillValue: `${kpis.complianceRate || 91}%`,
      pillIcon: ShieldCheck,
      totalMetricTitle: 'Statutory Filings:',
      totalMetricValue: '25 Protocols Registered • 1 Renewal Due',
      equalizer1Title: 'IEC Ethics Approvals:',
      equalizer1Main: '22 Valid',
      equalizer1Sub: '• 1 Expiry <15d',
      equalizer1Bars: [
        { label: 'AIIA', h: '95%', active: true },
        { label: 'IPGT', h: '90%' },
        { label: 'BHU', h: '88%' },
        { label: 'NIA', h: '85%' },
        { label: 'SDM', h: '80%' },
        { label: 'RAV', h: '78%' },
        { label: 'CCRA', h: '92%' },
      ],
      equalizer2Title: 'CTRI 6-Month Filings:',
      equalizer2Main: '96 %',
      equalizer2Sub: '• 23/25 Compliant',
      equalizer2Bars: [
        { label: 'Reg', h: '98%', active: true },
        { label: 'Upd', h: '92%' },
        { label: 'Pub', h: '88%' },
        { label: 'GCP', h: '95%' },
        { label: 'ICMR', h: '94%' },
        { label: 'Aud', h: '90%' },
        { label: 'Arch', h: '86%' },
      ],
      journeyTitle: 'Schedule Y Audit Readiness:',
      journeyMain: '94%',
      journeySub: 'Score',
      journeyBadge: 'Fully Compliant',
      col1Title: 'Clearance Deadlines & Audits:',
      col1Link: '/compliance',
      col1Cards: [
        { id: 'AYU-002', title: 'IEC-AIIA-2024-089 • Protocol AYU-002', sub: 'Ethics Clearance Renewal Due', badge: 'Expires in 12d', badgeType: 'danger' },
        { id: 'AYU-003', title: 'CTRI/2024/09/072412 • 6-Month Filing', sub: 'Bi-annual Progress Report', badge: 'Due in 18d', badgeType: 'warning' },
        { id: 'AYU-001', title: 'GCP-AUD-2025-04 • Site Inspection', sub: 'SITE-DEL-01 On-Site Audit', badge: 'Passed 98%', badgeType: 'success' },
      ],
      col2Title: 'Accredited Review Boards:',
      photo1: { title: 'IEC Secretariat Boardroom', sub1: 'AIIA New Delhi • Apex Panel', sub2: 'Next Hearing: Thursday 2:00 PM', img: '/assets/aiia_campus.jpg', link: '/compliance' },
      photo2: { title: 'IPGTRA Ethics Board', sub: 'Gujarat Committee Panel', img: '/assets/ipgtra_campus.jpg', link: '/compliance' },
      photo3: { title: 'BHU Institutional Panel', sub: 'Varanasi Ethics Registry', img: '/assets/aiia_campus.jpg', link: '/compliance' },
      ctaText: 'Run Automated Compliance Scan',
      ctaLink: '/compliance',
    },

    MANAGEMENT: {
      roleTitle: 'Ministry of Ayush • Executive Directorate',
      subTitle: 'National Ayurvedic Clinical Trial Governance & Multi-Center Strategy',
      pillLabel: 'Research Fund',
      pillValue: '₹42.5 Cr',
      pillIcon: Briefcase,
      totalMetricTitle: 'National Clinical Portfolio:',
      totalMetricValue: '25 Active Trials • 8 Centers • 4,350 Cohort',
      equalizer1Title: 'Resource Utilization:',
      equalizer1Main: '82 %',
      equalizer1Sub: '• ₹42.5 Cr Budget',
      equalizer1Bars: [
        { label: 'DEL', h: '95%', active: true },
        { label: 'JAM', h: '88%' },
        { label: 'VAR', h: '85%' },
        { label: 'JAI', h: '80%' },
        { label: 'UDU', h: '78%' },
        { label: 'KOL', h: '72%' },
        { label: 'BLR', h: '70%' },
      ],
      equalizer2Title: 'Formulatory Integration:',
      equalizer2Main: '68 %',
      equalizer2Sub: '• 4 Approaching PMS',
      equalizer2Bars: [
        { label: 'Ortho', h: '90%', active: true },
        { label: 'Metab', h: '88%' },
        { label: 'Neuro', h: '82%' },
        { label: 'Immune', h: '85%' },
        { label: 'Cardio', h: '75%' },
        { label: 'Skin', h: '70%' },
        { label: 'Geri', h: '65%' },
      ],
      journeyTitle: 'Commercialization Readiness:',
      journeyMain: '4 / 25',
      journeySub: 'Trials',
      journeyBadge: 'Phase III Exit',
      col1Title: 'National Flagship Protocols:',
      col1Link: '/trials',
      col1Cards: [
        { id: 'AYU-002', title: 'AYU-002 • Curcumin BCM-95', sub: 'Phase III • ₹3.8 Cr • 4 Research Centers', badge: '88/100 • Critical', badgeType: 'danger' },
        { id: 'AYU-001', title: 'AYU-001 • Ashwagandha WS-35', sub: 'Phase II • ₹2.4 Cr • 3 Research Centers', badge: '22/100 • Low Risk', badgeType: 'success' },
        { id: 'AYU-005', title: 'AYU-005 • Triphala Guggulu', sub: 'Phase III • ₹4.1 Cr • 5 Research Centers', badge: '64/100 • High Risk', badgeType: 'warning' },
      ],
      col2Title: 'Apex Institutes Network:',
      photo1: { title: 'AIIA Apex Center New Delhi', sub1: 'National Coordinating Hub', sub2: '12 Trials • ₹18.2 Cr Allocation', img: '/assets/aiia_campus.jpg', link: '/sites' },
      photo2: { title: 'IPGTRA Jamnagar (INI)', sub: '6 Flagship Protocols • ₹9.5 Cr', img: '/assets/ipgtra_campus.jpg', link: '/sites' },
      photo3: { title: 'Faculty of Ayurveda, BHU', sub: 'Varanasi Academic Center', img: '/assets/aiia_campus.jpg', link: '/sites' },
      ctaText: 'Generate Executive Ministry Dossier',
      ctaLink: '/analytics',
    },
  };

  const currentConfig = roleConfigs[role] || roleConfigs.ADMIN;
  const PillIcon = currentConfig.pillIcon;

  return (
    <div className="space-y-8 pb-16 font-sans bg-[#edf2ef]">
      {/* 1. Top Wide Hero Curved Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[34px] p-6 sm:p-8 md:p-10 text-white shadow-soft-xl overflow-visible">
        {/* Docked 3D Botanical Herbal Branch in Top Corner */}
        <div className="absolute top-0 right-16 sm:right-32 w-28 h-28 pointer-events-none opacity-85 z-0">
          <BotanicalCornerBranch3D className="w-28 h-28" leafColor="#b2d8c7" stemColor="#3d6356" accentColor="#f4a28c" />
        </div>

        {/* Ambient Subtle Organic Lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Banner Top Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative z-10">
          
          {/* Left Telemetry Tab + Location & Area Info */}
          <div className="flex items-start gap-4">
            {/* Protruding Telemetry Pill Tab */}
            <div className="hidden sm:flex flex-col items-center justify-center p-3 px-3.5 rounded-[22px] bg-white/15 backdrop-blur-md border border-white/20 shadow-sm shrink-0">
              <PillIcon className="w-5 h-5 text-white mb-1" />
              <span className="text-[10px] text-white/80 font-medium leading-none">{currentConfig.pillLabel}</span>
              <span className="text-xl font-extrabold text-white mt-1 leading-none font-display">
                {currentConfig.pillValue}
              </span>
            </div>

            {/* Location & Statistics */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-white">
                <MapPin className="w-5 h-5 text-[#f4a28c] shrink-0" />
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                  {currentConfig.roleTitle}
                </h1>
              </div>
              <p className="text-xs text-white/70 font-medium pl-6">
                {currentConfig.subTitle}
              </p>

              {/* Metric Row */}
              <div className="pt-2 pl-6 flex items-center gap-4 text-xs">
                <div>
                  <span className="text-white/60 text-[11px] block">{currentConfig.totalMetricTitle}</span>
                  <strong className="text-base text-white font-extrabold font-display">
                    {currentConfig.totalMetricValue}
                  </strong>
                </div>
                
                {/* Mini Network Outline Vector */}
                <div className="w-8 h-8 opacity-60">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                    <circle cx="50" cy="50" r="40" strokeDasharray="6 4" />
                    <circle cx="50" cy="50" r="10" fill="currentColor" />
                    <circle cx="25" cy="35" r="5" fill="currentColor" />
                    <circle cx="75" cy="35" r="5" fill="currentColor" />
                    <circle cx="50" cy="85" r="5" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right User Greeting + Live Date Widget */}
          <div className="flex items-center lg:items-end justify-between lg:justify-end gap-6 shrink-0">
            {/* User Profile Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-white/70 block">Welcome,</span>
                <span className="text-sm sm:text-base font-bold text-white font-display">
                  {user?.name || 'Dr. Tanuja Nesari'}
                </span>
                {user?.uniqueId && (
                  <span className="block text-[10px] font-mono text-white/80 font-bold">
                    {user.uniqueId}
                  </span>
                )}
              </div>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40 shadow-sm"
              />
            </div>

            {/* Date Widget: Live Day and Month */}
            <div className="flex items-baseline gap-1.5 pl-4 border-l border-white/20">
              <span className="text-4xl sm:text-5xl font-black text-white font-display tracking-tighter leading-none">
                {dayNum}
              </span>
              <div className="text-left leading-tight">
                <span className="text-[10px] text-white/70 block font-medium">Today is</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">{monthName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Overlapping Cards intersecting bottom edge */}
        <div className="flex flex-col lg:flex-row items-stretch gap-5 mt-8 -mb-16 sm:-mb-20 relative z-20">
          
          {/* Dual Split Card (Peach + Sage) with Role-specific Sliders */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 rounded-[28px] overflow-hidden shadow-soft-xl">
            {/* Left Half (Peach): Metric 1 */}
            <div className="bg-[#f4a28c] p-5 sm:p-6 text-white flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-white/90 font-medium">{currentConfig.equalizer1Title}</span>
                  <div className="text-xl sm:text-2xl font-extrabold font-display">
                    {currentConfig.equalizer1Main} <span className="text-xs font-normal opacity-80">{currentConfig.equalizer1Sub}</span>
                  </div>
                </div>
                {/* Wave icon */}
                <div className="w-6 h-6 opacity-80">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 12 Q6 4 12 12 T22 12" />
                  </svg>
                </div>
              </div>

              {/* 7 Vertical Level Sliders */}
              <div className="flex items-end justify-between gap-2 pt-2 h-20">
                {currentConfig.equalizer1Bars.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full h-full flex items-end justify-center">
                      <div
                        className={`w-1.5 rounded-full transition-all ${
                          item.active
                            ? 'w-3.5 bg-white/90 shadow-md ring-2 ring-white/40'
                            : 'bg-white/40'
                        }`}
                        style={{ height: item.h }}
                      />
                    </div>
                    <span className="text-[8px] font-mono font-bold text-white/80 truncate w-full text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Half (Sage): Metric 2 */}
            <div className="bg-[#4e7c6e] p-5 sm:p-6 text-white flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-white/90 font-medium">{currentConfig.equalizer2Title}</span>
                  <div className="text-xl sm:text-2xl font-extrabold font-display">
                    {currentConfig.equalizer2Main} <span className="text-xs font-normal opacity-80">{currentConfig.equalizer2Sub}</span>
                  </div>
                </div>
                {/* Wave icon */}
                <div className="w-6 h-6 opacity-80">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 12 Q6 4 12 12 T22 12" />
                  </svg>
                </div>
              </div>

              {/* 7 Vertical Level Sliders with diamond nodes */}
              <div className="flex items-end justify-between gap-2 pt-2 h-20">
                {currentConfig.equalizer2Bars.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full h-full flex items-end justify-center relative">
                      <div
                        className="w-1 bg-[#f4a28c] rounded-full"
                        style={{ height: item.h }}
                      />
                      {item.active && (
                        <div className="absolute top-0 w-2.5 h-2.5 bg-white rotate-45 rounded-xs shadow-sm" />
                      )}
                    </div>
                    <span className="text-[8px] font-mono font-bold text-white/80 truncate w-full text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Journey Status Card */}
          <div className="w-full lg:w-64 bg-white rounded-[28px] p-5 text-slate-800 shadow-soft-xl flex flex-col justify-between shrink-0">
            <div>
              <span className="text-xs font-bold text-slate-700 block font-display">{currentConfig.journeyTitle}</span>
              
              {/* Dotted curve trail with peach pin */}
              <div className="my-3 h-14 relative flex items-center justify-center">
                <svg viewBox="0 0 160 40" className="w-full h-full">
                  <path
                    d="M 10 30 Q 50 5, 90 25 T 150 15"
                    fill="none"
                    stroke="#5e8b7e"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <circle cx="150" cy="15" r="4" fill="#f4a28c" />
                </svg>
                <div className="absolute right-2 top-0 p-1 bg-[#f4a28c] text-white rounded-full shadow-sm">
                  <MapPin className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-extrabold text-slate-900 font-display">{currentConfig.journeyMain}</span>
                <span className="text-xs font-bold text-slate-500 ml-1">{currentConfig.journeySub}</span>
              </div>
              <span className="text-[10px] text-[#608c7d] font-bold">{currentConfig.journeyBadge}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Spacing spacer for overlapping cards */}
      <div className="h-10 sm:h-14" />

      {/* 2. Bottom Grid (3 Columns matching screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Column 1: Role Active Items */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight font-display">
              {currentConfig.col1Title}
            </h2>
            <button
              onClick={() => navigate(currentConfig.col1Link)}
              className="text-xs font-bold text-[#608c7d] hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {currentConfig.col1Cards.map((c) => {
              const badgeColors = {
                danger: 'bg-[#fdede8] text-[#9d442e]',
                warning: 'bg-[#fff5e6] text-[#b45309]',
                success: 'bg-[#e4ede9] text-[#2b423b]',
              };
              const iconColors = {
                danger: 'bg-[#fdede8] text-[#e11d48]',
                warning: 'bg-[#fef8f4] text-amber-500',
                success: 'bg-[#f4f8f6] text-[#608c7d]',
              };

              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/trials/${c.id}`)}
                  className="bg-white rounded-[24px] p-4 flex items-center justify-between shadow-soft-lg hover:shadow-soft-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className={`p-2.5 rounded-2xl shrink-0 ${iconColors[c.badgeType]}`}>
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 font-display truncate group-hover:text-[#608c7d] transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium truncate">{c.sub}</p>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-[18px] text-[11px] font-mono font-bold shrink-0 shadow-xs ${badgeColors[c.badgeType]}`}>
                    {c.badge}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Research Facilities & Centers */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight font-display">
              {currentConfig.col2Title}
            </h2>

            {/* Avatar Stack */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Team:</span>
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&auto=format&fit=crop&q=80"
                  alt="PI"
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=60&auto=format&fit=crop&q=80"
                  alt="PI"
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1594824813589-4b71f9f25752?w=60&auto=format&fit=crop&q=80"
                  alt="PI"
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                />
                <div className="w-6 h-6 rounded-full bg-[#608c7d] text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                  +
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Photo 1 (Large Photo Card) */}
            <div
              onClick={() => navigate(currentConfig.photo1.link)}
              className="relative h-60 sm:h-64 rounded-[28px] overflow-hidden shadow-soft-xl cursor-pointer group"
            >
              <img
                src={currentConfig.photo1.img}
                alt={currentConfig.photo1.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-between text-white">
                <div className="flex items-center gap-1 text-xs text-white/90">
                  <MapPin className="w-3.5 h-3.5 text-[#f4a28c]" />
                  <span className="font-bold font-display">{currentConfig.photo1.title}</span>
                </div>

                <div>
                  <p className="text-xs font-bold text-white font-display">{currentConfig.photo1.sub1}</p>
                  <p className="text-[11px] text-white/80 font-medium">{currentConfig.photo1.sub2}</p>
                </div>
              </div>
            </div>

            {/* Right Stack: Photo 2 + Photo 3 */}
            <div className="flex flex-col gap-4">
              {/* Photo 2 */}
              <div
                onClick={() => navigate(currentConfig.photo2.link)}
                className="relative h-28 rounded-[24px] overflow-hidden shadow-soft-lg cursor-pointer group"
              >
                <img
                  src={currentConfig.photo2.img}
                  alt={currentConfig.photo2.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#f4a28c]" />
                    <span className="font-bold font-display">{currentConfig.photo2.title}</span>
                  </div>
                  <p className="text-[10px] text-white/80">{currentConfig.photo2.sub}</p>
                </div>
              </div>

              {/* Photo 3 Split Card */}
              <div className="h-28 rounded-[24px] overflow-hidden shadow-soft-lg grid grid-cols-12 bg-white">
                <div className="col-span-7 relative h-full">
                  <img
                    src={currentConfig.photo3.img}
                    alt={currentConfig.photo3.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3.5 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin className="w-3 h-3 text-[#f4a28c]" />
                      <span className="font-bold font-display">{currentConfig.photo3.title}</span>
                    </div>
                    <p className="text-[10px] text-white/80 truncate">{currentConfig.photo3.sub}</p>
                  </div>
                </div>

                <div
                  onClick={() => navigate(currentConfig.photo3.link)}
                  title="Quick Action"
                  className="col-span-5 bg-[#f4a28c] hover:bg-[#e26b4e] flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Telemetry & Safety Intelligence Widget Stack */}
        <div className="lg:col-span-3 space-y-4">
          {/* Card 1: Safety / Incident Telemetry */}
          <div className="bg-white rounded-[28px] p-5 shadow-soft-lg space-y-3.5">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-[#fdede8] text-[#f4a28c] rounded-2xl flex flex-col items-center">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span className="text-[9px] font-bold mt-0.5 text-rose-700 uppercase">PV Unit</span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-display">
                  {kpis.safetyEventsCount || 32}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-display">Incidents Logged</span>
                <p className="text-xs font-bold text-rose-600 font-display">7 Serious SAEs</p>
              </div>
            </div>

            {/* Time Selector Tabs */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
              {['Today', '7 Days', '30 Days'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab1(t)}
                  className={`transition-colors ${
                    activeTab1 === t ? 'text-slate-900 font-bold' : 'hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Regulatory Compliance & Horizon */}
          <div className="bg-white rounded-[28px] p-5 shadow-soft-lg space-y-3.5">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-[#e4ede9] text-[#2b423b] rounded-2xl flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-[#608c7d]" />
                <span className="text-[9px] font-bold mt-0.5 text-[#2b423b] uppercase">ICMR/GCP</span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-display">
                  {kpis.complianceRate || 91}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-display">Compliance Rate</span>
                <p className="text-xs font-bold text-[#f4a28c] font-display">1 Expiry &lt;15d</p>
              </div>
            </div>

            {/* Time Selector Tabs */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
              {['Active', 'Pending', 'Expiring'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab2(t)}
                  className={`transition-colors ${
                    activeTab2 === t ? 'text-slate-900 font-bold' : 'hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Card: 3D Interactive Tridosha Balance Orbit + Peach CTA */}
          <div className="bg-white rounded-[28px] p-4 shadow-soft-lg flex flex-col items-center space-y-2 text-center">
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-display">3D Bio-Matrix</span>
              <span className="text-[9px] font-bold text-[#608c7d] bg-[#f4f8f6] px-2 py-0.5 rounded-full">Interactive</span>
            </div>

            {/* 3D Interactive Tridosha Sphere */}
            <div className="w-full h-32 flex items-center justify-center">
              <AyurvedicTridosha3D className="w-full h-32" interactive={true} />
            </div>

            {/* Peach Pill Button */}
            <button
              onClick={() => navigate(currentConfig.ctaLink)}
              className="w-full py-3 px-4 bg-[#f4a28c] hover:bg-[#e26b4e] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-[22px] shadow-peach-glow transition-all"
            >
              {currentConfig.ctaText}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

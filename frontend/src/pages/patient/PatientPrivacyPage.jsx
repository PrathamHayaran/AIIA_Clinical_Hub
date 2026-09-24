import React from 'react';
import { 
  ShieldCheck, Lock, EyeOff, Award, FileText, 
  HelpCircle, CheckCircle2, Building, Mail, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientPrivacyPage() {
  const privacyPillars = [
    {
      title: 'Pseudonymization & De-Identification',
      desc: 'Your personal identifiers (name, personal phone) are isolated from clinical trial datasets. Researchers analyze your biological and questionnaire responses solely through coded Subject IDs (e.g. SYNTH-DEL-1001).',
      icon: EyeOff,
    },
    {
      title: 'End-to-End Encryption',
      desc: 'All health records, adherence logs, and communications transmitted via the INTELLIX portal use 256-bit TLS encryption in transit and AES-256 encryption at rest.',
      icon: Lock,
    },
    {
      title: 'Independent Ethical Oversight',
      desc: 'This trial protocol is under continuous audit by the AIIA Institutional Ethics Committee (IEC-AIIA-2025-0812) to protect participant rights, safety, and confidentiality.',
      icon: ShieldCheck,
    },
    {
      title: 'Voluntary Consent & Withdrawal',
      desc: 'You retain full ownership of your participation rights and can request withdrawal of consent at any time without compromising ongoing standard hospital care.',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Privacy, Security & Data Protection</h1>
        <p className="text-stone-600 text-sm mt-1">
          Learn how the All India Institute of Ayurveda safeguards your clinical trial information and personal health data.
        </p>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-stone-900 via-sage-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-teal-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            DPDPA & GCP Compliant Research Infrastructure
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight !text-white text-white">
            Your Clinical Data is Protected by Law
          </h2>
          <p className="text-teal-100 text-sm leading-relaxed max-w-2xl">
            In accordance with the <strong className="text-white">Digital Personal Data Protection Act (DPDPA 2023)</strong> and the <strong className="text-white">ICMR Ethical Guidelines for Biomedical Research</strong>, your personal records are strictly confidential and protected by role-based access security.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {privacyPillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">{p.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Participant Rights Checklist */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Your Rights as a Research Participant
        </h3>

        <div className="space-y-3 text-xs text-stone-700 divide-y divide-stone-100">
          <div className="pt-2">
            <strong className="text-stone-900 block mb-0.5">1. Right to Information</strong>
            <span>You have the right to know the purpose, potential risks, benefits, and scientific nature of all study procedures before and throughout your participation.</span>
          </div>

          <div className="pt-3">
            <strong className="text-stone-900 block mb-0.5">2. Right to Access Lab Results</strong>
            <span>You may request a copy of your routine clinical biochemistry, hematology, and safety lab panels conducted during trial visits.</span>
          </div>

          <div className="pt-3">
            <strong className="text-stone-900 block mb-0.5">3. Right to Confidentiality in Publications</strong>
            <span>Any scientific papers, clinical registry submissions, or regulatory filings arising from this trial will contain aggregate, strictly anonymized statistical data.</span>
          </div>

          <div className="pt-3">
            <strong className="text-stone-900 block mb-0.5">4. Right to Unconditional Withdrawal</strong>
            <span>You may revoke your consent at any time through this portal or by notifying your study coordinator.</span>
          </div>
        </div>
      </div>

      {/* Ethics & Data Protection Office Contacts */}
      <div className="bg-sage-50/80 rounded-2xl p-6 border border-sage-200 text-xs text-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-stone-900 text-sm">Institutional Ethics Committee (IEC) Secretariat</h4>
          <p className="text-stone-600">All India Institute of Ayurveda, Sarita Vihar, New Delhi 110076</p>
          <p className="text-stone-500">Email: <a href="mailto:iec@aiia.gov.in" className="text-teal-700 underline font-medium">iec@aiia.gov.in</a></p>
        </div>

        <Link
          to="/patient/documents"
          className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap"
        >
          View Signed Consent Form
        </Link>
      </div>

    </div>
  );
}

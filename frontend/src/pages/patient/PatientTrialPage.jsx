import React, { useState, useEffect } from 'react';
import { 
  Compass, ShieldCheck, UserCheck, Building2, FileCheck, CheckCircle2, 
  Calendar, Award, AlertCircle, Clock, FileText, ArrowRight, HeartPulse, Sparkles
} from 'lucide-react';
import patientApi from '../../services/patientApi';

export default function PatientTrialPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trialData, setTrialData] = useState(null);

  useEffect(() => {
    fetchTrialDetails();
  }, []);

  const fetchTrialDetails = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getTrial();
      setTrialData(res);
    } catch (err) {
      console.error('Failed to load trial details:', err);
      setError(err.message || 'Unable to load study details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading study protocol information...</p>
      </div>
    );
  }

  if (error || !trialData) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Could Not Load Study Details</h3>
        <p className="text-sm text-red-700 mb-4">{error || 'Please check your connection and retry.'}</p>
        <button 
          onClick={fetchTrialDetails}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const trial = trialData?.trial || {};
  const center = trialData?.center || trialData?.site || {};
  const patient = trialData?.patient || trialData?.participation || {};

  const studyMilestones = [
    {
      phase: 'Screening Visit (Week -2)',
      desc: 'Informed consent signed, eligibility criteria checked, baseline blood biochemistry and vital signs recorded.',
      status: 'Completed',
      done: true,
    },
    {
      phase: 'Baseline Randomization (Day 0)',
      desc: 'Inclusion confirmed, baseline Hamilton Anxiety Scale (HAM-A) recorded, first study medication kit dispensed.',
      status: 'Completed',
      done: true,
    },
    {
      phase: 'Interim Check 1 (Week 2)',
      desc: 'Safety assessment, vital signs check, preliminary tolerability review, and medication adherence count.',
      status: 'Completed',
      done: true,
    },
    {
      phase: 'Mid-Point Evaluation (Week 4)',
      desc: 'Comprehensive clinical evaluation, mid-study blood safety panel, second bottle dispensation.',
      status: 'Completed',
      done: true,
    },
    {
      phase: 'Follow-up Evaluation (Week 8)',
      desc: 'Symptom scoring, sleep quality index (PSQI) evaluation, adherence verification and clinical review.',
      status: 'Current Visit',
      done: false,
      current: true,
    },
    {
      phase: 'Final Trial Closeout (Week 12)',
      desc: 'Final efficacy assessment, safety blood panel, return of unused capsules, closeout certificate issued.',
      status: 'Scheduled',
      done: false,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-sage-100 text-sage-800 text-xs font-bold rounded-full border border-sage-200">
                Protocol: {trial.trialId || 'AYU-001'}
              </span>
              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                {trial.phase || 'Phase II Clinical Trial'}
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Status: {trial.status || 'Active'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {trial.title || 'Evaluating Efficacy of Standardized Ashwagandha in GAD'}
            </h1>
            <p className="text-stone-600 text-sm max-w-3xl leading-relaxed">
              {trial.description || 'A randomized, double-blind, clinical investigation evaluating the therapeutic efficacy, neuroprotective safety profile, and quality-of-life outcomes of standardized Ayurvedic botanical formulation in human participants.'}
            </p>
          </div>

          <div className="bg-sage-50/80 p-5 rounded-2xl border border-sage-200/80 shrink-0 text-center min-w-[200px]">
            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Your Enrolled ID</p>
            <p className="text-xl font-mono font-black text-sage-900">{patient.patientDisplayId || patient.patientId || patient.id || 'AIIA-PAT-1001'}</p>
            <p className="text-xs text-stone-500 mt-2">
              Enrolled on {patient.enrolledDate || patient.enrollmentDate ? new Date(patient.enrolledDate || patient.enrollmentDate).toLocaleDateString() : 'Aug 14, 2025'}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Study Overview & Purpose */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Plain English Summary */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              About This Research Study
            </h2>
            
            <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
              <p>
                This clinical trial is conducted under strict ethical oversight by the <strong>Institutional Ethics Committee (IEC)</strong> of the All India Institute of Ayurveda in compliance with the <strong>GCP (Good Clinical Practice)</strong> guidelines and the <strong>New Drugs and Clinical Trials Rules (2019)</strong>.
              </p>
              <p>
                The primary purpose of this study is to scientifically substantiate the anti-stress, anxiolytic, and neuro-modulatory properties of standardized <em>Withania somnifera</em> (Ashwagandha WS-35 extract) in comparison to placebo control.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-xs font-bold text-stone-400 uppercase">Therapeutic Area</span>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">Ayurvedic Neuropsychiatry (Manovaha Srotas)</p>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-xs font-bold text-stone-400 uppercase">Study Duration</span>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">12 Weeks Active Treatment + 4 Wks Follow-up</p>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-xs font-bold text-stone-400 uppercase">Investigational Product</span>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">Ashwagandha WS-35 (500mg Capsules)</p>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-xs font-bold text-stone-400 uppercase">Dosing Schedule</span>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">1 capsule twice daily after meals</p>
              </div>
            </div>
          </div>

          {/* Schedule of Assessments Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Schedule of Study Visits
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              A breakdown of what to expect at each stage of your participation.
            </p>

            <div className="space-y-4">
              {studyMilestones.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border transition flex items-start gap-4 ${
                    step.current 
                      ? 'border-teal-500 bg-teal-50/40 shadow-xs ring-1 ring-teal-400' 
                      : step.done 
                        ? 'border-emerald-200 bg-emerald-50/30' 
                        : 'border-stone-200 bg-stone-50/40 opacity-75'
                  }`}
                >
                  <div className="mt-0.5">
                    {step.done ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : step.current ? (
                      <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs animate-pulse">
                        {idx + 1}
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <h3 className={`text-sm font-bold ${step.current ? 'text-teal-900' : 'text-stone-800'}`}>
                        {step.phase}
                      </h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        step.done 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : step.current 
                            ? 'bg-teal-600 text-white' 
                            : 'bg-stone-200 text-stone-600'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Ethics, Approvals, & Research Center */}
        <div className="space-y-6">
          
          {/* Research Center Details */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Trial Site Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-stone-400 uppercase">Site Name</span>
                <p className="font-semibold text-stone-800 text-sm">{center?.name || 'All India Institute of Ayurveda'}</p>
              </div>

              <div>
                <span className="font-bold text-stone-400 uppercase">Location & Address</span>
                <p className="text-stone-700">{center?.location || 'Gautampuri, Sarita Vihar, Mathura Road, New Delhi, Delhi 110076'}</p>
              </div>

              <div>
                <span className="font-bold text-stone-400 uppercase">Principal Investigator</span>
                <p className="font-semibold text-stone-800">{center?.principalInvestigator || 'Dr. Priya Nair, MD (Ayu)'}</p>
                <p className="text-stone-500">Department of Kayachikitsa & Clinical Research</p>
              </div>

              <div>
                <span className="font-bold text-stone-400 uppercase">Site Coordinator Desk</span>
                <p className="font-mono text-stone-800">+91-11-26950401 / Ext. 304</p>
              </div>
            </div>
          </div>

          {/* Ethics & Regulatory Registry Card */}
          <div className="bg-gradient-to-b from-sage-50/60 to-white rounded-2xl p-6 border border-sage-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sage-700" />
              Ethical & Regulatory Clearances
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-sage-200/80 space-y-1">
                <span className="font-bold text-stone-500 uppercase text-[10px]">Institutional Ethics Committee (IEC)</span>
                <p className="font-bold text-stone-900 text-xs">AIIA Institutional Ethics Committee</p>
                <p className="font-mono text-sage-800 font-semibold text-[11px]">Approval: IEC-AIIA-2025-0812</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-sage-200/80 space-y-1">
                <span className="font-bold text-stone-500 uppercase text-[10px]">Clinical Trial Registry of India</span>
                <p className="font-bold text-stone-900 text-xs">CTRI Registered Study</p>
                <p className="font-mono text-teal-800 font-semibold text-[11px]">Reg: CTRI/2025/08/045819</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-sage-200/80 space-y-1">
                <span className="font-bold text-stone-500 uppercase text-[10px]">Ayush Ministry Good Clinical Practices</span>
                <p className="font-bold text-emerald-800 text-xs">Certified GCP-Compliant Protocol</p>
              </div>
            </div>
          </div>

          {/* Voluntary Rights Note */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-950">
              <Award className="w-4 h-4 text-amber-700" />
              Participant Rights
            </h4>
            <p className="leading-relaxed">
              Your participation in this study is entirely voluntary. You may withdraw your consent at any time without penalty or loss of standard medical care benefits at AIIA.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

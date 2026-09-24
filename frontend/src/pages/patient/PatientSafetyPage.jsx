import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  AlertTriangle, ShieldCheck, HeartPulse, Clock, Calendar, 
  CheckCircle2, AlertCircle, PhoneCall, Plus, FileWarning, Info, Send, X
} from 'lucide-react';
import patientApi from '../../services/patientApi';

export default function PatientSafetyPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [eventType, setEventType] = useState('MILD_SYMPTOM');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('MILD');
  const [onsetDate, setOnsetDate] = useState(new Date().toISOString().split('T')[0]);
  const [actionTaken, setActionTaken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  // Open modal automatically if url has ?report=true or ?open=true
  useEffect(() => {
    if (searchParams.get('report') === 'true' || searchParams.get('open') === 'true') {
      setShowModal(true);
    }
  }, [searchParams]);

  // Handle ESC key and background scroll locking when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getSafetyReports();
      setReports(res.safetyReports || res.reports || []);
    } catch (err) {
      console.error('Failed to load safety reports:', err);
      setError(err.message || 'Unable to load safety records.');
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a description of the symptom or side effect.');
      return;
    }

    try {
      setSubmitting(true);
      setSuccessMsg(null);
      await patientApi.submitSafetyReport({
        eventType,
        description: description.trim(),
        severity,
        onsetDate,
        actionTaken: actionTaken.trim() || undefined,
      });

      setSuccessMsg('Your health observation has been submitted directly to the Clinical Safety & Pharmacovigilance Team. Our study doctor will review it promptly.');
      setDescription('');
      setActionTaken('');
      setShowModal(false);
      
      // Refresh list
      const res = await patientApi.getSafetyReports();
      setReports(res.safetyReports || res.reports || []);
    } catch (err) {
      alert('Error submitting safety report: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading safety & health logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* 1. Header & Primary CTA */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Health & Safety Self-Reporting</h1>
            <p className="text-stone-600 text-sm mt-1">
              Directly report any symptoms, discomfort, or side effects experienced during your clinical trial participation.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-[#e26b4e] hover:bg-[#cf583c] active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-[#e26b4e]/30 transition-all flex items-center gap-2 self-start border border-[#e26b4e]"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Report New Symptom / Side Effect</span>
          </button>
        </div>

        {/* Critical Emergency Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-red-950">Experiencing a Medical Emergency?</h3>
              <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                If you experience chest pain, severe shortness of breath, sudden swelling, or acute distress, call National Emergency <strong>112</strong> or AIIA Emergency <strong>102</strong> immediately. Do not wait for online portal responses.
              </p>
            </div>
          </div>

          <a 
            href="tel:112"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap text-center self-end sm:self-center"
          >
            Call Emergency (112)
          </a>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm flex items-start gap-3 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Report Submitted Successfully</p>
            <p className="text-xs text-emerald-800 mt-0.5">{successMsg}</p>
          </div>
          <button 
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Pop-up Modal Dialog for Reporting New Side Effect */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden flex flex-col my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#e26b4e]/10 text-[#e26b4e] flex items-center justify-center">
                  <FileWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="modal-headline" className="font-bold text-stone-900 text-lg sm:text-xl">
                    Report Symptom / Side Effect
                  </h3>
                  <p className="text-xs text-stone-500">
                    Directly synced with AIIA Clinical Pharmacovigilance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[11px] font-mono font-bold text-stone-400 bg-stone-200/60 px-2.5 py-1 rounded-full">
                  Protocol AYU-001
                </span>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleReportSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto max-h-[75vh]">
              
              {/* Emergency Warning Callout inside Modal */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  For acute life-threatening emergencies (e.g. chest pain, severe shortness of breath), call <strong>112</strong> immediately.
                </span>
              </div>

              {/* Observation Type & Severity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Health Observation Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-[#e26b4e] focus:border-[#e26b4e] outline-none bg-white"
                  >
                    <option value="MILD_SYMPTOM">Mild Symptom (Transient nausea, headache, dry mouth)</option>
                    <option value="DIGESTIVE_CHANGE">Digestive / Bowel Habit Change</option>
                    <option value="SKIN_REACTION">Skin Rash / Allergic Reaction</option>
                    <option value="SLEEP_MOOD">Sleep or Mood Disturbance</option>
                    <option value="OTHER_DISCOMFORT">Other Unspecified Discomfort</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Severity Level <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'MILD', label: 'Mild', color: 'border-emerald-300 text-emerald-800 bg-emerald-50/60 ring-2 ring-emerald-500' },
                      { val: 'MODERATE', label: 'Moderate', color: 'border-amber-300 text-amber-800 bg-amber-50/60 ring-2 ring-amber-500' },
                      { val: 'SEVERE', label: 'Severe', color: 'border-red-300 text-red-800 bg-red-50/60 ring-2 ring-red-500' },
                    ].map((s) => {
                      const active = severity === s.val;
                      return (
                        <button
                          key={s.val}
                          type="button"
                          onClick={() => setSeverity(s.val)}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition text-center ${
                            active ? s.color : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Onset Date & Action Taken */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Date of First Onset <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={onsetDate}
                    onChange={(e) => setOnsetDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#e26b4e] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Action Taken So Far (Optional)
                  </label>
                  <input
                    type="text"
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    placeholder="e.g. Drank warm water, rested, skipped a dose"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#e26b4e] outline-none"
                  />
                </div>
              </div>

              {/* Detailed Symptom Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Detailed Description of Symptoms & Experiences <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you felt, how long it lasted, whether it occurred after taking your dose, and any other relevant observations..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#e26b4e] outline-none resize-none"
                  required
                />
              </div>

              {/* Modal Footer / Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-stone-600 hover:text-stone-800 text-sm font-semibold rounded-xl hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#e26b4e] hover:bg-[#cf583c] active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-[#e26b4e]/30 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-white" />
                  {submitting ? 'Submitting...' : 'Transmit Report to Study Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Safety Reports History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Your Past Health & Safety Reports</h2>
            <p className="text-xs text-stone-500">Every submission is logged and reviewed by the AIIA Pharmacovigilance Officer</p>
          </div>
          <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
            {reports.length} Total Reports
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50 space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-stone-800 text-sm">No Safety Issues Reported</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              You have not recorded any adverse side effects during your trial participation. Continue taking your study doses as instructed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => {
              const isResolved = r.status === 'RESOLVED' || r.status === 'CLOSED';
              const isUnderReview = r.status === 'UNDER_REVIEW' || r.status === 'INVESTIGATING';

              return (
                <div key={r.id} className="p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition space-y-3 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${
                        r.severity === 'SEVERE' ? 'bg-red-500' : r.severity === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>
                      <h3 className="font-bold text-stone-800 text-base">{r.eventType?.replace(/_/g, ' ') || 'Health Report'}</h3>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        r.severity === 'SEVERE' ? 'bg-red-100 text-red-800' : r.severity === 'MODERATE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.severity} Severity
                      </span>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                      isResolved ? 'bg-emerald-100 text-emerald-800' : isUnderReview ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      ● Status: {r.status}
                    </span>
                  </div>

                  <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                    {r.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 pt-1">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Reported: {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                      {r.onsetDate && (
                        <span>Onset: {new Date(r.onsetDate).toLocaleDateString()}</span>
                      )}
                      {r.actionTaken && (
                        <span>Action: {r.actionTaken}</span>
                      )}
                    </div>

                    <span className="font-mono text-[11px] text-stone-400">Ref: {r.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Safety & Help Desk Footer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sage-50 to-teal-50 border border-sage-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-stone-900 text-sm">24/7 AIIA Clinical Pharmacovigilance Unit</h4>
          <p className="text-xs text-stone-600">Have a safety question before taking your next capsule? Speak with our on-call study clinician.</p>
        </div>
        <a 
          href="tel:+911126950401"
          className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 whitespace-nowrap"
        >
          <PhoneCall className="w-4 h-4" />
          Call +91-11-26950401 (Ext. 304)
        </a>
      </div>

    </div>
  );
}

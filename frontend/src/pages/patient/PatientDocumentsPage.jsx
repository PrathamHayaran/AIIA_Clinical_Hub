import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, ShieldCheck, AlertCircle, Eye, 
  CheckCircle2, AlertTriangle, FileCheck, ArrowRight, X, Clock
} from 'lucide-react';
import patientApi from '../../services/patientApi';

export default function PatientDocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getDocuments();
      setDocuments(res.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError(err.message || 'Unable to load study documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    try {
      setWithdrawing(true);
      await patientApi.requestConsentWithdrawal(withdrawReason);
      setWithdrawSuccess('Your consent withdrawal request has been submitted to the Principal Investigator and Institutional Ethics Committee. A study coordinator will contact you within 24 hours to conduct a safe trial closeout visit.');
      setShowWithdrawModal(false);
      setWithdrawReason('');
    } catch (err) {
      alert('Error submitting withdrawal: ' + err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading trial documents & consent records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Trial Documents & Informed Consent</h1>
        <p className="text-stone-600 text-sm mt-1">
          Access your signed informed consent records, patient information sheets, and study dietary guidelines.
        </p>
      </div>

      {withdrawSuccess && (
        <div className="p-5 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Consent Withdrawal Request In Review</span>
          </div>
          <p className="leading-relaxed text-xs">{withdrawSuccess}</p>
        </div>
      )}

      {/* Informed Consent Status Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Verified Electronic Consent (eICF)
            </div>

            <h2 className="text-2xl font-bold tracking-tight !text-white text-white">
              Informed Consent Form: Active & Verified
            </h2>
            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
              Your electronic consent was signed prior to enrollment and validated by the AIIA Institutional Ethics Committee (IEC-AIIA-2025-0812).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold text-xs rounded-xl border border-red-400/30 transition text-center"
            >
              Request Consent Withdrawal
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                <FileText className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 text-base">{doc.title}</h3>
                </div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {doc.docType?.replace(/_/g, ' ') || 'Document'}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  {doc.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-mono text-[11px]">
                v{doc.version || '1.0'} • Added {new Date(doc.createdAt).toLocaleDateString()}
              </span>

              <a
                href={doc.fileUrl || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading official document: "${doc.title}" (PDF)`);
                }}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Participant Rights Summary Box */}
      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 text-xs text-stone-700 space-y-3">
        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          Ethical Information & Participant Rights
        </h4>
        <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
          <li>You are entitled to a full copy of the signed Informed Consent Form at any time.</li>
          <li>Withdrawal of consent does not affect any ongoing non-trial healthcare you receive at AIIA.</li>
          <li>All collected data up to the date of withdrawal will remain strictly de-identified in scientific publications.</li>
        </ul>
      </div>

      {/* Withdrawal Dialog Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5 text-red-600 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Request Consent Withdrawal</span>
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Participation in this clinical trial is entirely voluntary. You have the unconditional right to discontinue your participation at any time without giving a reason and without losing any standard hospital privileges.
            </p>

            <form onSubmit={handleWithdrawalRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Reason for Withdrawal (Optional)
                </label>
                <textarea
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  placeholder="e.g. Moving to another city, schedule conflict, or preference to stop treatment"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-red-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawing}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {withdrawing ? 'Submitting...' : 'Confirm Withdrawal Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

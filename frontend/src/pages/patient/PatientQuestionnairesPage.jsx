import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, Clock, AlertCircle, ArrowRight, 
  ChevronRight, Sparkles, Check, HelpCircle, X, Award
} from 'lucide-react';
import patientApi from '../../services/patientApi';

export default function PatientQuestionnairesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  
  // Active taking modal
  const [activeQ, setActiveQ] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getQuestionnaires();
      setQuestionnaires(res.questionnaires || []);
    } catch (err) {
      console.error('Failed to load questionnaires:', err);
      setError(err.message || 'Unable to load study questionnaires.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuestionnaire = (q) => {
    setActiveQ(q);
    setResponses({});
    setSubmitSuccess(null);
  };

  const handleSelectOption = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitResponses = async () => {
    if (!activeQ) return;
    
    // Check if all questions answered
    const questions = activeQ.questions || [];
    const unanswered = questions.filter(q => responses[q.id] === undefined);
    
    if (unanswered.length > 0) {
      alert(`Please answer all questions before submitting (${unanswered.length} remaining).`);
      return;
    }

    try {
      setSubmitting(true);
      await patientApi.submitQuestionnaire(activeQ.id, responses);
      setSubmitSuccess('Questionnaire submitted and verified for your electronic trial record.');
      setActiveQ(null);
      // Refresh list
      const res = await patientApi.getQuestionnaires();
      setQuestionnaires(res.questionnaires || []);
    } catch (err) {
      alert('Failed to submit questionnaire: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading electronic questionnaires (ePRO)...</p>
      </div>
    );
  }

  const pendingList = questionnaires.filter(q => q.status === 'PENDING');
  const completedList = questionnaires.filter(q => q.status === 'COMPLETED');

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Study Questionnaires & Assessments</h1>
        <p className="text-stone-600 text-sm mt-1">
          Electronic Patient-Reported Outcomes (ePRO) questionnaires required for your clinical trial protocol.
        </p>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="font-semibold">{submitSuccess}</p>
        </div>
      )}

      {/* Pending Questionnaires Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending Questionnaires ({pendingList.length})
          </h2>
          <span className="text-xs font-medium text-stone-500">Required before your next clinical evaluation</span>
        </div>

        {pendingList.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-stone-800 text-base">You are all caught up!</h3>
            <p className="text-xs text-stone-500">There are no pending questionnaires for your current trial visit window.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pendingList.map((q) => (
              <div 
                key={q.id}
                className="bg-white rounded-2xl p-6 border-2 border-amber-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-100 text-amber-900">
                      Pending Action
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      {q.questions ? `${q.questions.length} Items` : 'Assessment'}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base">{q.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{q.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    Due: {q.dueDate ? new Date(q.dueDate).toLocaleDateString() : 'This week'}
                  </div>

                  <button
                    onClick={() => handleStartQuestionnaire(q)}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    Start Questionnaire <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Questionnaires Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Completed Questionnaires ({completedList.length})
          </h2>
          <span className="text-xs font-mono text-stone-400">Electronic Research Records</span>
        </div>

        {completedList.length === 0 ? (
          <p className="text-sm text-stone-500 py-4 text-center">No completed questionnaires recorded yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {completedList.map((q) => (
              <div key={q.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-800 text-sm">{q.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{q.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-stone-500 self-end sm:self-center">
                  {q.score !== null && q.score !== undefined && (
                    <span className="font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                      Total Score: {q.score}
                    </span>
                  )}
                  {q.completedAt && (
                    <span className="text-stone-400">
                      Submitted on {new Date(q.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Taking Modal */}
      {activeQ && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-teal-800 to-sage-800 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-teal-200 uppercase tracking-wider block">Electronic Assessment Form</span>
                <h3 className="text-xl font-bold text-white">{activeQ.title}</h3>
              </div>
              <button 
                onClick={() => setActiveQ(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions List (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
              <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
                {activeQ.description || 'Please answer each question honestly based on how you have felt over the last 7 days.'}
              </p>

              {(activeQ.questions || []).map((q, idx) => (
                <div key={q.id || idx} className="space-y-2.5 p-4 rounded-xl border border-stone-200 bg-stone-50/40">
                  <h4 className="font-bold text-sm text-stone-900">
                    <span className="text-teal-700 mr-1.5">{idx + 1}.</span> {q.questionText}
                  </h4>

                  <div className="space-y-1.5 pt-1">
                    {(q.options || []).map((opt) => (
                      <label 
                        key={opt.value}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition text-xs ${
                          responses[q.id] === opt.value
                            ? 'border-teal-600 bg-teal-50 font-bold text-teal-900'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          value={opt.value}
                          checked={responses[q.id] === opt.value}
                          onChange={() => handleSelectOption(q.id, opt.value)}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">
                {Object.keys(responses).length} of {(activeQ.questions || []).length} answered
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveQ(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 text-xs font-semibold"
                >
                  Save for Later
                </button>
                <button
                  onClick={handleSubmitResponses}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Questionnaire'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

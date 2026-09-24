import React, { useState, useEffect } from 'react';
import { 
  Pill, CheckCircle2, XCircle, AlertCircle, Clock, Calendar, 
  Sparkles, Info, ShieldAlert, Award, ChevronRight, Check, Plus,
  Trash2, Edit3, Flame, RefreshCw
} from 'lucide-react';
import patientApi from '../../services/patientApi';

export default function PatientTreatmentPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adherenceData, setAdherenceData] = useState(null);

  // Form state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [morningDose, setMorningDose] = useState(true);
  const [eveningDose, setEveningDose] = useState(true);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  useEffect(() => {
    fetchAdherenceData();
  }, []);

  // When selectedDate or adherenceData changes, pre-fill form if a log already exists for this date
  useEffect(() => {
    if (adherenceData?.logs) {
      const existing = adherenceData.logs.find(l => {
        const logDateStr = new Date(l.date).toISOString().split('T')[0];
        return logDateStr === selectedDate;
      });

      if (existing) {
        setMorningDose(existing.morningDose ?? (existing.status === 'TAKEN' || existing.isFull));
        setEveningDose(existing.eveningDose ?? (existing.status === 'TAKEN' || existing.isFull));
        setNotes(existing.notes || '');
        setIsEditingExisting(true);
      } else {
        // Default to both checked for a fresh date
        setMorningDose(true);
        setEveningDose(true);
        setNotes('');
        setIsEditingExisting(false);
      }
    }
  }, [selectedDate, adherenceData]);

  const fetchAdherenceData = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getAdherence();
      setAdherenceData(res);
    } catch (err) {
      console.error('Failed to load adherence:', err);
      setError(err.message || 'Unable to load adherence records.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset) => {
    if (preset === 'BOTH') {
      setMorningDose(true);
      setEveningDose(true);
    } else if (preset === 'MORNING') {
      setMorningDose(true);
      setEveningDose(false);
    } else if (preset === 'EVENING') {
      setMorningDose(false);
      setEveningDose(true);
    } else if (preset === 'MISSED') {
      setMorningDose(false);
      setEveningDose(false);
    }
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSuccessMsg(null);
      const res = await patientApi.logAdherence({
        date: selectedDate,
        morningDose,
        eveningDose,
        notes: notes.trim() || undefined,
      });

      setSuccessMsg(res?.message || 'Dose record saved successfully!');
      
      // Refresh data
      const updated = await patientApi.getAdherence();
      setAdherenceData(updated);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Error submitting adherence log: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLog = async (logId, logDateStr, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove the adherence record for ${logDateStr}?`)) {
      return;
    }

    try {
      await patientApi.deleteAdherence(logId);
      const updated = await patientApi.getAdherence();
      setAdherenceData(updated);
      setSuccessMsg(`Log for ${logDateStr} deleted.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Failed to delete log: ' + err.message);
    }
  };

  const handleSelectHistoryRow = (log) => {
    const logDateStr = new Date(log.date).toISOString().split('T')[0];
    setSelectedDate(logDateStr);
    const formElement = document.getElementById('adherence-form-container');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading medication & adherence records...</p>
      </div>
    );
  }

  if (error || !adherenceData) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Could Not Load Medication Data</h3>
        <p className="text-sm text-red-700 mb-4">{error}</p>
        <button onClick={fetchAdherenceData} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl">
          Retry
        </button>
      </div>
    );
  }

  const { logs = [], stats = {} } = adherenceData;
  const streakDays = stats.streakDays || 7;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Treatment & Medication Adherence</h1>
        <p className="text-stone-600 text-sm mt-1">
          Record your daily study capsule intake to ensure clinical trial integrity and safety tracking.
        </p>
      </div>

      {/* Medication Details Card with Adherence Metrics */}
      <div className="bg-gradient-to-r from-sage-900 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-teal-200">
              <Pill className="w-3.5 h-3.5" />
              Investigational Ayurvedic Product (IP)
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight !text-white text-white">
              Standardized Ashwagandha Extract (WS-35)
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed max-w-2xl">
              Strength: <strong className="text-white">500 mg per vegetable capsule</strong> • Standardized withanolide content (&gt;5%). 
              Administered orally twice daily with warm milk or lukewarm water after breakfast and after dinner.
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-sage-200 pt-2">
              <span className="bg-white/10 px-3 py-1 rounded-lg">Kit Code: <strong className="text-white">KIT-WS35-081</strong></span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Storage: <strong className="text-white">Cool & Dry (&lt; 25°C)</strong></span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Batch: <strong className="text-white">AIIA-2025-WS02</strong></span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center space-y-2.5">
            <p className="text-xs uppercase font-bold text-teal-200 tracking-wider">Overall Protocol Adherence</p>
            <div className="text-4xl font-black text-white">{stats.adherenceRate || 95}%</div>
            <p className="text-xs text-teal-100">
              {stats.takenDoses || 40} of {stats.totalExpectedDoses || 42} doses logged on time
            </p>
            
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-500/40">
                ● Compliant (&gt;80%)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-500/40">
                <Flame className="w-3 h-3 text-amber-300" />
                {streakDays} Day Streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Daily Dose Logging Form */}
        <div id="adherence-form-container" className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {isEditingExisting ? 'Update Intake Record' : 'Log Daily Intake'}
              </h3>
            </div>

            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              isEditingExisting ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-teal-700'
            }`}>
              {isEditingExisting ? 'Editing Day' : 'New Entry'}
            </span>
          </div>

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 font-bold text-xs">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmitLog} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Intake Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Selected: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Quick Selection Presets
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('BOTH')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                    morningDose && eveningDose ? 'bg-teal-700 text-white border-teal-700' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Both Taken (AM & PM)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('MISSED')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                    !morningDose && !eveningDose ? 'bg-red-600 text-white border-red-600' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Missed Both Doses
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('MORNING')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                    morningDose && !eveningDose ? 'bg-amber-600 text-white border-amber-600' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Morning Only (AM)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('EVENING')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                    !morningDose && eveningDose ? 'bg-amber-600 text-white border-amber-600' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Evening Only (PM)
                </button>
              </div>
            </div>

            {/* Dose Checkboxes */}
            <div className="space-y-2.5 pt-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Doses Taken on this Date
              </label>

              {/* Morning Dose Toggle */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                morningDose ? 'border-teal-500 bg-teal-50/60 ring-1 ring-teal-500' : 'border-stone-200 bg-stone-50/60 opacity-80'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    morningDose ? 'bg-teal-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    AM
                  </div>
                  <div>
                    <span className="text-sm font-bold text-stone-800 block">Morning Capsule (500mg)</span>
                    <span className="text-xs text-stone-500">Taken post breakfast with warm water/milk</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={morningDose}
                  onChange={(e) => setMorningDose(e.target.checked)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                />
              </label>

              {/* Evening Dose Toggle */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                eveningDose ? 'border-teal-500 bg-teal-50/60 ring-1 ring-teal-500' : 'border-stone-200 bg-stone-50/60 opacity-80'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    eveningDose ? 'bg-teal-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    PM
                  </div>
                  <div>
                    <span className="text-sm font-bold text-stone-800 block">Evening Capsule (500mg)</span>
                    <span className="text-xs text-stone-500">Taken post dinner with warm water/milk</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={eveningDose}
                  onChange={(e) => setEveningDose(e.target.checked)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Notes or Observations (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Taken 30 mins after dinner with warm milk. No adverse sensations."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#608c7d] hover:bg-[#4d7265] text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Saving Intake...' : isEditingExisting ? 'Update Adherence Record' : 'Save Adherence Record'}
            </button>
          </form>

          {/* Clinical Disclaimer */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              Investigational Disclaimer
            </p>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Do not take double doses if you miss a scheduled capsule. Contact your study coordinator if you miss 2 or more consecutive doses.
            </p>
          </div>
        </div>

        {/* Right 2 Cols: Adherence History & Log Table */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-stone-800">Adherence History Timeline</h3>
                <p className="text-xs text-stone-500">Continuous daily log over your clinical trial participation</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                  {logs.length} Days Recorded
                </span>
                <button
                  type="button"
                  onClick={fetchAdherenceData}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition"
                  title="Refresh adherence history"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-stone-100 max-h-[700px] overflow-y-auto pr-1">
              {logs.map((log) => {
                const logDate = new Date(log.date);
                const logDateStr = logDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const isSelectedDate = new Date(selectedDate).toDateString() === logDate.toDateString();

                const isFull = log.isFull ?? (log.status === 'TAKEN' || log.status === 'FULL');
                const isPartial = log.isPartial ?? (log.status === 'PARTIAL');
                const isMissed = log.isMissed ?? (log.status === 'MISSED');

                const amTaken = log.morningDose ?? (isFull || log.status === 'TAKEN');
                const pmTaken = log.eveningDose ?? (isFull || log.status === 'TAKEN');

                return (
                  <div 
                    key={log.id} 
                    onClick={() => handleSelectHistoryRow(log)}
                    className={`py-3.5 px-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition cursor-pointer group ${
                      isSelectedDate ? 'bg-teal-50/70 border border-teal-200 ring-1 ring-teal-300' : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isFull 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : isPartial 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {isFull ? <CheckCircle2 className="w-5 h-5" /> : isPartial ? '½' : <XCircle className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-800 text-sm">
                            {logDateStr}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isFull 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : isPartial 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {isFull ? 'Both Doses Taken' : isPartial ? 'Partial Dose' : 'Missed'}
                          </span>
                          {isSelectedDate && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                              Selected
                            </span>
                          )}
                        </div>
                        {log.notes && (
                          <p className="text-xs text-stone-500 mt-0.5 italic">"{log.notes}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 self-end sm:self-center">
                      <span className={`px-2.5 py-1 rounded-md text-xs transition ${
                        amTaken 
                          ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60' 
                          : 'bg-stone-100 text-stone-400 line-through'
                      }`}>
                        AM Dose
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-xs transition ${
                        pmTaken 
                          ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60' 
                          : 'bg-stone-100 text-stone-400 line-through'
                      }`}>
                        PM Dose
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition pl-1">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleSelectHistoryRow(log); }}
                          className="p-1 rounded-md hover:bg-stone-200 text-stone-600"
                          title="Edit this entry"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteLog(log.id, logDateStr, e)}
                          className="p-1 rounded-md hover:bg-red-100 text-red-600"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}


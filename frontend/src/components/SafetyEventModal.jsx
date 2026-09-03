import React, { useState } from 'react';
import { Modal } from './Modal';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export const SafetyEventModal = ({ isOpen, onClose, onEventLogged, trials = [] }) => {
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    trialId: trials[0]?.id || '',
    syntheticPatientId: '',
    eventType: 'Mild Gastric Distension',
    severity: 'Mild',
    description: '',
    onsetDate: new Date().toISOString().split('T')[0],
    causalityAssessment: 'Possible',
    reporterName: 'Site Clinical Investigator',
    correctiveAction: 'Symptomatic Ayurvedic relief provided.',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.trialId || !formData.eventType || !formData.description) {
      addToast({ title: 'Validation Error', message: 'Please fill all required fields.', type: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/safety', formData);
      if (res.data.success) {
        addToast({
          title: 'Pharmacovigilance Alert',
          message: `Safety event ${res.data.data.eventCode} successfully broadcasted.`,
          type: res.data.data.severity === 'Serious' ? 'danger' : 'success',
        });
        onEventLogged(res.data.data);
        onClose();
      }
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Adverse Event (Pharmacovigilance)" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
            Associated Clinical Trial *
          </label>
          <select
            name="trialId"
            value={formData.trialId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
          >
            {trials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.trialId} — {t.title} ({t.treatment})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Synthetic Participant Code
            </label>
            <input
              type="text"
              name="syntheticPatientId"
              value={formData.syntheticPatientId}
              onChange={handleChange}
              placeholder="e.g. SYNTH-DEL-1045"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Onset Date *
            </label>
            <input
              type="date"
              name="onsetDate"
              value={formData.onsetDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Event Classification *
            </label>
            <input
              type="text"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              placeholder="e.g. Transient Transaminase Elevation"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Severity Level *
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            >
              <option value="Mild">Mild (Self-limiting, minimal discomfort)</option>
              <option value="Moderate">Moderate (Interferes with activity, manageable)</option>
              <option value="Severe">Severe (Incapacitating, required intervention)</option>
              <option value="Serious">Serious (SAE - Potential hospitalization / organ toxicity)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
            Clinical Narrative & Telemetry Details *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Describe clinical presentation, laboratory findings, baseline LFT/KFT, timing relative to dosing..."
            required
            className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Causality Assessment
            </label>
            <select
              name="causalityAssessment"
              value={formData.causalityAssessment}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            >
              <option value="Probable">Probable (Reasonable temporal sequence, known effect)</option>
              <option value="Possible">Possible (Temporal sequence, other factors present)</option>
              <option value="Unlikely">Unlikely (Doubtful temporal relationship)</option>
              <option value="Not Related">Not Related (Clearly attributable to concurrent disease)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Corrective Action Taken
            </label>
            <input
              type="text"
              name="correctiveAction"
              value={formData.correctiveAction}
              onChange={handleChange}
              placeholder="e.g. Dose paused, weekly LFT monitoring, post-prandial administration"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-[#f4f8f6] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold font-display bg-[#f4a28c] hover:bg-[#e26b4e] text-white shadow-peach-glow transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            <span>Log & Broadcast Event</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

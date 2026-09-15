import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { AddSiteModal } from './AddSiteModal';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Loader2, Plus } from 'lucide-react';

export const TrialModal = ({ isOpen, onClose, onTrialCreated, sites = [] }) => {
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(false);
  const [localSites, setLocalSites] = useState(sites);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);

  useEffect(() => {
    setLocalSites(sites);
  }, [sites]);
  const [formData, setFormData] = useState({
    trialId: '',
    title: '',
    treatment: '',
    ayurvedicDiscipline: 'Kayachikitsa',
    indication: '',
    phase: 'Phase III',
    studyType: 'Randomized Double-Blind Placebo-Controlled',
    principalInvestigator: 'Dr. Anand Kumar',
    targetParticipants: 150,
    startDate: new Date().toISOString().split('T')[0],
    expectedEndDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    status: 'Recruiting',
    selectedSites: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSiteToggle = (siteId) => {
    setFormData((prev) => {
      const exists = prev.selectedSites.includes(siteId);
      return {
        ...prev,
        selectedSites: exists
          ? prev.selectedSites.filter((id) => id !== siteId)
          : [...prev.selectedSites, siteId],
      };
    });
  };

  const handleCustomSiteAdded = (newSite) => {
    setLocalSites((prev) => [newSite, ...prev]);
    setFormData((prev) => ({
      ...prev,
      selectedSites: [...prev.selectedSites, newSite.id],
    }));
    addToast({
      title: 'Center Added & Assigned',
      message: `${newSite.name} added and selected for this trial.`,
      type: 'success',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.trialId || !formData.title || !formData.treatment) {
      addToast({ title: 'Validation Error', message: 'Please fill all required fields.', type: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/trials', {
        ...formData,
        siteIds: formData.selectedSites,
      });

      if (res.data.success) {
        addToast({
          title: 'Trial Registered',
          message: `Clinical trial ${res.data.data.trialId} successfully created.`,
          type: 'success',
        });
        onTrialCreated(res.data.data);
        onClose();
      }
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Clinical Trial Protocol" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Trial Identifier (e.g. AYU-026) *
            </label>
            <input
              type="text"
              name="trialId"
              value={formData.trialId}
              onChange={handleChange}
              placeholder="AYU-026"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Ayurvedic Discipline
            </label>
            <select
              name="ayurvedicDiscipline"
              value={formData.ayurvedicDiscipline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            >
              <option value="Kayachikitsa">Kayachikitsa (Internal Medicine)</option>
              <option value="Dravyaguna">Dravyaguna (Pharmacology)</option>
              <option value="Rasayana Tantra">Rasayana Tantra (Rejuvenation)</option>
              <option value="Panchakarma">Panchakarma (Bio-Purification)</option>
              <option value="Shalya Tantra">Shalya Tantra (Surgical Sciences)</option>
              <option value="Shalakya Tantra">Shalakya Tantra (ENT & Ophthalmology)</option>
              <option value="Prasuti & Stri Roga">Prasuti & Stri Roga (Gynecology)</option>
              <option value="Kaumarbhritya">Kaumarbhritya (Pediatrics)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
            Trial Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Clinical Evaluation of Standardized Formulation in..."
            required
            className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Investigational Formulation *
            </label>
            <input
              type="text"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="e.g. Standardized Withanolide Extract WS-35"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Clinical Indication
            </label>
            <input
              type="text"
              name="indication"
              value={formData.indication}
              onChange={handleChange}
              placeholder="e.g. Knee Osteoarthritis (Sandhigata Vata)"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Trial Phase
            </label>
            <select
              name="phase"
              value={formData.phase}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            >
              <option value="Phase I">Phase I (Safety & PK)</option>
              <option value="Phase II">Phase II (Proof of Concept)</option>
              <option value="Phase III">Phase III (Comparative Efficacy)</option>
              <option value="Phase IV">Phase IV (Post-Market PMS)</option>
              <option value="Observational">Observational Registry</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Principal Investigator (PI)
            </label>
            <input
              type="text"
              name="principalInvestigator"
              value={formData.principalInvestigator}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Target Participants
            </label>
            <input
              type="number"
              name="targetParticipants"
              value={formData.targetParticipants}
              onChange={handleChange}
              min="10"
              max="2000"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display">
              Expected End Date
            </label>
            <input
              type="date"
              name="expectedEndDate"
              value={formData.expectedEndDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Site Assignment Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-display">
              Participating Ayurvedic Research Centers ({localSites.length})
            </label>
            <button
              type="button"
              onClick={() => setIsAddSiteOpen(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-[#608c7d] hover:text-[#456c5f] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Research Center</span>
            </button>
          </div>

          {localSites && localSites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 bg-[#f4f8f6] rounded-2xl border border-slate-200/80">
              {localSites.map((s) => {
                const isSelected = formData.selectedSites.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSiteToggle(s.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'bg-[#608c7d] border-[#608c7d] text-white font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{s.name} ({s.city})</span>
                    <span className="text-[10px] font-bold">{isSelected ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 bg-[#f4f8f6] rounded-2xl border border-dashed border-slate-300 text-center">
              <span className="text-xs text-slate-500">No research centers available yet.</span>
              <button
                type="button"
                onClick={() => setIsAddSiteOpen(true)}
                className="ml-2 text-xs font-bold text-[#608c7d] underline"
              >
                Create one now
              </button>
            </div>
          )}
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
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Register Clinical Trial</span>
          </button>
        </div>
      </form>

      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={isAddSiteOpen}
        onClose={() => setIsAddSiteOpen(false)}
        onSiteAdded={handleCustomSiteAdded}
      />
    </Modal>
  );
};


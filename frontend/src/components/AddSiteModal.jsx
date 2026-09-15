import React, { useState } from 'react';
import { Modal } from './Modal';
import api from '../services/api';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  User,
  BedDouble,
  Sliders,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const POPULAR_PRESETS = [
  {
    name: 'North Eastern Institute of Folk Medicine & Ayurveda (NEIAH)',
    city: 'Shillong',
    state: 'Meghalaya',
    siteCode: 'SITE-SHL-01',
    principalInvestigator: 'Prof. Dr. Pranjal Borah, MD (Ayu)',
    contactEmail: 'shillong.trials@neiah.gov.in',
    contactPhone: '+91-364-2538100',
    capacity: 150,
    performanceScore: 88,
    recruitmentRate: 84,
    dataQualityRate: 91,
    complianceRate: 95,
  },
  {
    name: 'Regional Ayurveda Research Institute (RARI Mumbai)',
    city: 'Mumbai',
    state: 'Maharashtra',
    siteCode: 'SITE-MUM-01',
    principalInvestigator: 'Dr. Sunita Kulkarni, MS (Shalya)',
    contactEmail: 'mumbai.ctms@ccras.nic.in',
    contactPhone: '+91-22-24944111',
    capacity: 220,
    performanceScore: 92,
    recruitmentRate: 89,
    dataQualityRate: 94,
    complianceRate: 97,
  },
  {
    name: 'Regional Ayurveda Research Institute (RARI Lucknow)',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    siteCode: 'SITE-LKO-02',
    principalInvestigator: 'Prof. Dr. Akhilesh Mishra, MD (Kayachikitsa)',
    contactEmail: 'lucknow.research@ccras.nic.in',
    contactPhone: '+91-522-2348900',
    capacity: 180,
    performanceScore: 87,
    recruitmentRate: 82,
    dataQualityRate: 90,
    complianceRate: 94,
  },
  {
    name: 'KLE Academy of Higher Education & Research (BMK Ayurveda)',
    city: 'Belagavi',
    state: 'Karnataka',
    siteCode: 'SITE-BLG-01',
    principalInvestigator: 'Dr. Ramesh B. Joshi, MD (Dravyaguna)',
    contactEmail: 'ayurveda.research@kledeemeduniversity.edu.in',
    contactPhone: '+91-831-2473777',
    capacity: 250,
    performanceScore: 90,
    recruitmentRate: 86,
    dataQualityRate: 93,
    complianceRate: 96,
  },
  {
    name: 'SDM College of Ayurveda & Hospital',
    city: 'Udupi',
    state: 'Karnataka',
    siteCode: 'SITE-UDP-01',
    principalInvestigator: 'Prof. Dr. B. Ravishankar, MD (Panchakarma)',
    contactEmail: 'clinical.trials@sdmayurveda.in',
    contactPhone: '+91-820-2520338',
    capacity: 200,
    performanceScore: 89,
    recruitmentRate: 85,
    dataQualityRate: 92,
    complianceRate: 95,
  },
  {
    name: 'Government Ayurveda College & Hospital',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    siteCode: 'SITE-TRV-01',
    principalInvestigator: 'Dr. Mini S. Nair, MD (Ayu)',
    contactEmail: 'research.gactvm@kerala.gov.in',
    contactPhone: '+91-471-2460190',
    capacity: 280,
    performanceScore: 93,
    recruitmentRate: 90,
    dataQualityRate: 95,
    complianceRate: 98,
  },
];

export const AddSiteModal = ({ isOpen, onClose, onSiteAdded }) => {
  const initialForm = {
    name: '',
    siteCode: '',
    city: '',
    state: '',
    principalInvestigator: '',
    contactEmail: '',
    contactPhone: '',
    capacity: 180,
    performanceScore: 88,
    recruitmentRate: 82,
    dataQualityRate: 91,
    complianceRate: 95,
  };

  const [formData, setFormData] = useState(initialForm);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Helper to auto-calculate code suggestion if user hasn't manually entered one
  const handleCityChange = (e) => {
    const cityVal = e.target.value;
    const cleanCity = cityVal.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      city: cityVal,
      siteCode: prev.siteCode && !prev.siteCode.startsWith('SITE-') ? prev.siteCode : (cleanCity ? `SITE-${cleanCity}-01` : ''),
      contactEmail: prev.contactEmail || (cityVal ? `${cityVal.toLowerCase().replace(/[^a-z0-9]/g, '')}.research@aiia.gov.in` : ''),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleApplyPreset = (preset) => {
    setFormData({ ...preset });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please provide the full Research Institute / Center Name.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      setError('City and State are required for site geolocation mapping.');
      return;
    }
    if (!formData.principalInvestigator.trim()) {
      setError('Principal Investigator (PI) name is required for GCP trial governance.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/sites', formData);
      if (res.data.success) {
        setSuccess(true);
        if (onSiteAdded) {
          onSiteAdded(res.data.data);
        }
        setTimeout(() => {
          setSuccess(false);
          setFormData(initialForm);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to create research center:', err);
      setError(err.response?.data?.message || 'Failed to add research center. Please check network/permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Ayurvedic Research Center" maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Preset Pill Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Sparkles className="w-3.5 h-3.5 text-[#f4a28c]" /> Quick Presets (Premier Ayush Institutes)
            </span>
            <span className="text-[10px] text-slate-400 font-medium">1-Click Auto-fill</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f4f8f6] hover:bg-[#608c7d] hover:text-white border border-slate-200/80 text-slate-700 transition-all active:scale-95 text-left"
              >
                + {p.name.split('(')[0].trim()} <span className="opacity-75 font-mono">({p.city})</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-medium text-rose-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-medium text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Research Center registered successfully! Updating clinical trial network...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Institute Name */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-display">
                Institute / Center Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Regional Ayurveda Research Institute (RARI), Patna"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-display">
                City / Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  placeholder="e.g. Mumbai, Patna, Varanasi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
                  required
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-display">
                State / UT <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra, Bihar, Uttar Pradesh"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
                required
              />
            </div>

            {/* Site Code */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-display flex items-center justify-between">
                <span>Unique Site Code</span>
                <span className="text-[10px] text-slate-400 lowercase font-normal">(Auto-generated or custom)</span>
              </label>
              <input
                type="text"
                name="siteCode"
                value={formData.siteCode}
                onChange={handleChange}
                placeholder="e.g. SITE-MUM-01"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
              />
            </div>

            {/* Inpatient Bed Capacity */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-display flex items-center justify-between">
                <span>Inpatient Bed Capacity</span>
                <span className="text-[10px] text-slate-400 font-normal">Active clinical beds</span>
              </label>
              <div className="relative">
                <BedDouble className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  name="capacity"
                  min="10"
                  max="2000"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="150"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
                />
              </div>
            </div>

            {/* Principal Investigator */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-display">
                Principal Investigator (PI) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="principalInvestigator"
                  value={formData.principalInvestigator}
                  onChange={handleChange}
                  placeholder="e.g. Prof. Dr. Rajesh Sharma, MD (Ayurveda)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
                  required
                />
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-display">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="clinical.research@institute.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-display">
                Contact Phone / Desk
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+91-11-29997601"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Advanced Performance & Quality Metrics Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-bold text-[#608c7d] hover:text-[#456c5f] transition-colors font-display"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Baseline Quality Targets ▲' : 'Configure Baseline Performance & Quality Targets ▼'}</span>
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-[#f4f8f6] rounded-2xl border border-slate-200/80 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                    Performance Score: {formData.performanceScore}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    name="performanceScore"
                    value={formData.performanceScore}
                    onChange={handleChange}
                    className="w-full accent-[#608c7d]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                    Recruitment Rate: {formData.recruitmentRate}%
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    name="recruitmentRate"
                    value={formData.recruitmentRate}
                    onChange={handleChange}
                    className="w-full accent-[#608c7d]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                    Data Quality: {formData.dataQualityRate}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    name="dataQualityRate"
                    value={formData.dataQualityRate}
                    onChange={handleChange}
                    className="w-full accent-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                    GCP Compliance: {formData.complianceRate}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    name="complianceRate"
                    value={formData.complianceRate}
                    onChange={handleChange}
                    className="w-full accent-[#f4a28c]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live Card Preview */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-display">
              Card Live Preview
            </span>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#f4f8f6] text-[#608c7d] rounded-xl">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-display">
                      {formData.name || 'Institute Name Here'}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#f4a28c]" />
                      <span>{formData.city || 'City'}, {formData.state || 'State'} ({formData.siteCode || 'SITE-CODE'})</span>
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#f4f8f6] text-[#608c7d] font-bold text-xs rounded-full">
                  {formData.performanceScore}% Perf
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>PI: <strong className="text-slate-800">{formData.principalInvestigator || 'Dr. PI Name'}</strong></span>
                <span>Capacity: <strong className="text-slate-800">{formData.capacity || 150} beds</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              disabled={loading || success}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold font-display bg-[#f4a28c] hover:bg-[#e26b4e] text-white shadow-peach-glow transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Registering...' : 'Register Research Center'}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

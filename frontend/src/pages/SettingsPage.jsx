import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import {
  CheckCircle2,
  RefreshCw,
  User,
  Shield,
  Sliders,
  Camera,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  X,
  Sparkles,
  RotateCcw,
  Bot,
  Key,
  Cpu,
  Zap,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotification();

  const [reSeeding, setReSeeding] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'upload' | 'url'
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [customUrl, setCustomUrl] = useState('');
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Gemini AI Engine State
  const [aiStatus, setAiStatus] = useState({ hasKey: false, model: 'gemini-1.5-flash', mode: 'HEURISTIC_LOCAL' });
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [isSavingAiKey, setIsSavingAiKey] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);

  useEffect(() => {
    fetchAiStatus();
  }, []);

  const fetchAiStatus = async () => {
    try {
      const res = await api.get('/ai/status');
      if (res.data.success && res.data.data) {
        setAiStatus(res.data.data);
        setSelectedModel(res.data.data.model || 'gemini-1.5-flash');
      }
    } catch (err) {
      console.warn('Could not fetch AI status:', err.message);
    }
  };

  const handleSaveGeminiConfig = async (e) => {
    e?.preventDefault();
    try {
      setIsSavingAiKey(true);
      const res = await api.post('/ai/config', {
        apiKey: apiKeyInput.trim(),
        model: selectedModel,
      });
      if (res.data.success) {
        setAiStatus(res.data.data);
        addToast({
          title: 'Gemini AI Configured',
          message: res.data.message,
          type: 'success',
        });
        setApiKeyInput('');
      }
    } catch (err) {
      addToast({ title: 'Configuration Error', message: err.message, type: 'danger' });
    } finally {
      setIsSavingAiKey(false);
    }
  };

  const handleClearGeminiKey = async () => {
    try {
      setIsSavingAiKey(true);
      const res = await api.post('/ai/config', { apiKey: '', model: selectedModel });
      if (res.data.success) {
        setAiStatus(res.data.data);
        addToast({
          title: 'Switched to Built-in Engine',
          message: 'Nadi AI is now running on the local Ayurvedic reasoning heuristic engine.',
          type: 'info',
        });
      }
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    } finally {
      setIsSavingAiKey(false);
    }
  };

  const handleTestAiQuery = async () => {
    try {
      setIsTestingAi(true);
      const res = await api.post('/ai/copilot', { prompt: 'Brief Me — Executive Management Summary' });
      if (res.data.success) {
        addToast({
          title: '✨ AI Query Success',
          message: res.data.data.directAnswer ? `${res.data.data.directAnswer.slice(0, 90)}...` : 'AI Engine responded with high clinical confidence.',
          type: 'success',
        });
      }
    } catch (err) {
      addToast({ title: 'Test Failed', message: err.message, type: 'danger' });
    } finally {
      setIsTestingAi(false);
    }
  };

  const presetAvatars = [
    {
      id: 'p1',
      label: 'Dr. Tanuja (Admin)',
      url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p2',
      label: 'Dr. Anand (Researcher)',
      url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p3',
      label: 'Dr. Priyadarshini (Safety)',
      url: 'https://images.unsplash.com/photo-1594824813589-4b71f9f25752?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p4',
      label: 'Adv. Rajeshwar (Compliance)',
      url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p5',
      label: 'Prof. Dhiman (Management)',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p6',
      label: 'Senior Clinical Scientist',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p7',
      label: 'Principal Investigator',
      url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p8',
      label: 'Ayush Research Fellow',
      url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p9',
      label: 'Clinical Pharmacologist',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const handleOpenPhotoModal = () => {
    setAvatarPreview(user?.avatar || presetAvatars[0].url);
    setIsPhotoModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast({ title: 'File Too Large', message: 'Please upload an image smaller than 5MB.', type: 'danger' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async () => {
    if (!avatarPreview) return;
    try {
      setIsSavingPhoto(true);
      if (updateProfile) {
        await updateProfile({ avatar: avatarPreview });
      }
      addToast({
        title: 'Profile Photo Updated',
        message: 'Your new institutional avatar has been saved across the CTMS platform.',
        type: 'success',
      });
      setIsPhotoModalOpen(false);
    } catch (err) {
      addToast({ title: 'Update Failed', message: err.message, type: 'danger' });
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleResetDefault = async () => {
    const defaultAvatars = {
      ADMIN: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      RESEARCHER: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      SAFETY_OFFICER: 'https://images.unsplash.com/photo-1594824813589-4b71f9f25752?w=300&auto=format&fit=crop&q=80',
      COMPLIANCE_OFFICER: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
      MANAGEMENT: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    };
    const defaultUrl = defaultAvatars[user?.role] || defaultAvatars.ADMIN;
    setAvatarPreview(defaultUrl);
  };

  const handleReSeed = async () => {
    try {
      setReSeeding(true);
      const res = await api.post('/alerts/scan');
      addToast({
        title: 'Telemetry Evaluated',
        message: 'System rules and risk scores re-evaluated against synthetic trial dataset.',
        type: 'success',
      });
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    } finally {
      setReSeeding(false);
    }
  };

  const roleCapabilities = [
    { role: 'ADMIN', desc: 'Full write/read access to trials, sites, users, safety events, and Nadi AI.', current: user?.role === 'ADMIN' },
    { role: 'RESEARCHER', desc: 'Manage assigned clinical trials, patient cohorts, milestones, and run AI diagnosis.', current: user?.role === 'RESEARCHER' },
    { role: 'SAFETY_OFFICER', desc: 'Log adverse events, conduct causality reviews, generate pharmacovigilance reports.', current: user?.role === 'SAFETY_OFFICER' },
    { role: 'COMPLIANCE_OFFICER', desc: 'Track IEC ethics clearance, CTRI 6-month filings, oversee GCP audit checklists.', current: user?.role === 'COMPLIANCE_OFFICER' },
    { role: 'MANAGEMENT', desc: 'Executive dashboard surveillance, cross-site performance analytics (Read-Only).', current: user?.role === 'MANAGEMENT' },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-5xl font-sans bg-[#edf2ef]">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display relative z-10">
          System Preferences & Governance
        </h1>
        <p className="text-xs sm:text-sm text-white/80 font-medium mt-1 relative z-10">
          Investigator profile, role capabilities, system health, and synthetic environment management.
        </p>
      </div>

      {/* 2. Profile Overview Card */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* Interactive Avatar with Hover Camera Button */}
            <div className="relative group shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-[#e4ede9] shadow-soft-md group-hover:opacity-90 transition-opacity"
              />
              <button
                onClick={handleOpenPhotoModal}
                title="Change Profile Photo"
                className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px] cursor-pointer"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
              </button>
              <div
                onClick={handleOpenPhotoModal}
                className="absolute -bottom-1 -right-1 p-1.5 bg-[#f4a28c] text-white rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-[#e26b4e] transition-colors"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">{user?.name}</h2>
                <button
                  onClick={handleOpenPhotoModal}
                  className="px-2.5 py-0.5 bg-[#f4f8f6] hover:bg-[#e4ede9] text-[#608c7d] text-[11px] font-bold rounded-full border border-[#608c7d]/30 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  <span>Edit Photo</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-3 py-0.5 bg-[#608c7d] text-white text-[10px] font-bold uppercase rounded-full">
                  {user?.role}
                </span>
                <span className="text-xs text-slate-600 font-semibold">• {user?.department}</span>
              </div>
            </div>
          </div>

          {/* Unique Institutional ID Badge */}
          <div className="flex flex-col sm:items-end p-3.5 bg-[#f4f8f6] rounded-2xl border border-slate-200/80 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-display">Unique Institutional ID</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {user?.uniqueId || 'AIIA-USR-1000'}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user?.uniqueId || 'AIIA-USR-1000');
                  addToast({ title: 'Copied!', message: 'Unique ID copied to clipboard.', type: 'success' });
                }}
                className="px-2.5 py-1 bg-[#608c7d] hover:bg-[#4e7c6e] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 bg-[#f4f8f6] rounded-2xl">
            <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[10px]">Session Security</span>
            <p className="font-bold text-slate-900">JSON Web Token (JWT) Authenticated</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Expires in 7 days</p>
          </div>

          <div className="p-4 bg-[#f4f8f6] rounded-2xl">
            <span className="text-slate-400 block mb-0.5 font-bold uppercase text-[10px]">Data Privacy Tier</span>
            <p className="font-bold text-slate-900">De-Identified Synthetic Cohort</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero patient PII stored</p>
          </div>
        </div>
      </div>

      {/* Profile Photo Update Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#fdede8] text-[#f4a28c] rounded-2xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                    Change Profile Photo
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select a curated clinician avatar, upload an image, or provide a URL.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Preview Panel */}
            <div className="flex items-center gap-4 p-4 bg-[#f4f8f6] rounded-2xl border border-slate-200/60">
              <div className="relative">
                <img
                  src={avatarPreview || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-soft-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Live Preview</span>
                <p className="text-sm font-bold text-slate-900 truncate font-display">{user?.name}</p>
                <p className="text-xs text-[#608c7d] font-semibold">{user?.role} • {user?.department}</p>
              </div>
              <button
                onClick={handleResetDefault}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                title="Reset to role default"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Clinician Presets</span>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image URL</span>
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'presets' && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                  Select a Clinical Persona Avatar:
                </span>
                <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-none">
                  {presetAvatars.map((p) => {
                    const isSelected = avatarPreview === p.url;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAvatarPreview(p.url)}
                        className={`group relative p-2 rounded-2xl border transition-all flex flex-col items-center text-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#e4ede9] border-[#608c7d] ring-2 ring-[#608c7d]/20 shadow-xs'
                            : 'bg-white border-slate-200/80 hover:bg-[#f4f8f6]'
                        }`}
                      >
                        <div className="relative mb-1.5">
                          <img
                            src={p.url}
                            alt={p.label}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform"
                          />
                          {isSelected && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#608c7d] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 line-clamp-1">
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#608c7d] bg-[#f4f8f6] hover:bg-[#e4ede9]/30 rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                >
                  <div className="p-3 bg-white text-[#608c7d] rounded-2xl shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose image file from device
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports JPG, PNG, WEBP (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Direct Image URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-1 px-4 py-2.5 bg-[#f4f8f6] rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#608c7d]/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrl.trim()) setAvatarPreview(customUrl.trim());
                      }}
                      className="px-4 py-2.5 bg-[#608c7d] hover:bg-[#4e7c6e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={isSavingPhoto || !avatarPreview}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#f4a28c] hover:bg-[#e26b4e] text-white rounded-full text-xs font-bold font-display shadow-peach-glow transition-all disabled:opacity-50 cursor-pointer active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                <span>{isSavingPhoto ? 'Saving...' : 'Save Profile Photo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Role Capabilities Matrix */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
          Role-Based Access Control (RBAC) Architecture
        </h3>

        <div className="space-y-2.5">
          {roleCapabilities.map((rc) => (
            <div
              key={rc.role}
              className={`p-4 rounded-2xl transition-all flex items-start justify-between gap-3 ${
                rc.current
                  ? 'bg-[#e4ede9] border border-[#a3c5b3]'
                  : 'bg-[#f4f8f6] border border-slate-200/60'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-900 font-display">{rc.role}</span>
                  {rc.current && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#608c7d] text-white rounded-full">
                      Your Active Role
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 leading-relaxed text-slate-600 font-medium">{rc.desc}</p>
              </div>

              {rc.current && <CheckCircle2 className="w-5 h-5 text-[#608c7d] shrink-0 mt-0.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Google Gemini AI Engine Configuration Card */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#608c7d] to-[#456c5f] text-white rounded-2xl shadow-sage-glow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
                  Google Gemini AI Engine Integration
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  aiStatus.hasKey
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {aiStatus.hasKey ? '🟢 GEMINI LIVE' : '⚪ BUILT-IN VEDIC ENGINE'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Power Nadi AI with Google Gemini for advanced generative reasoning & empirical trial analysis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestAiQuery}
              disabled={isTestingAi}
              className="px-3.5 py-1.5 bg-[#f4f8f6] hover:bg-[#e4ede9] text-[#608c7d] text-xs font-bold rounded-full border border-[#608c7d]/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Zap className={`w-3.5 h-3.5 ${isTestingAi ? 'animate-spin' : 'text-[#f4a28c]'}`} />
              <span>{isTestingAi ? 'Testing...' : 'Test AI Query'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveGeminiConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* API Key Input */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  <span>Gemini API Key:</span>
                </span>
                {aiStatus.maskedKey && (
                  <span className="text-[10px] font-mono text-emerald-700 font-normal">
                    Active: {aiStatus.maskedKey}
                  </span>
                )}
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={aiStatus.hasKey ? 'Enter new API key to update...' : 'AIzaSy... (Paste your Google Gemini API Key)'}
                className="w-full px-4 py-2.5 bg-[#f4f8f6] rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#608c7d]/30 font-mono"
              />
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>AI Model:</span>
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f4f8f6] rounded-2xl border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#608c7d]/30 cursor-pointer"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Clinical Reasoning)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-500">
              {aiStatus.hasKey ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ Gemini AI active. Queries will be processed by Google's generative models with full database context.
                </span>
              ) : (
                <span>Leave blank to use the high-intelligence built-in Ayurvedic heuristic engine.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {aiStatus.hasKey && (
                <button
                  type="button"
                  onClick={handleClearGeminiKey}
                  disabled={isSavingAiKey}
                  className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Key
                </button>
              )}
              <button
                type="submit"
                disabled={isSavingAiKey || (!apiKeyInput.trim() && selectedModel === aiStatus.model)}
                className="flex items-center gap-2 px-6 py-2 bg-[#608c7d] hover:bg-[#4e7c6e] text-white rounded-full text-xs font-bold font-display shadow-sage-glow transition-all disabled:opacity-50 cursor-pointer active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f4a28c]" />
                <span>{isSavingAiKey ? 'Saving...' : 'Save & Activate Gemini'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 5. Infrastructure Telemetry & Re-Scan */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
          System Infrastructure & Diagnostic Telemetry
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#f4f8f6] rounded-2xl">
            <span className="text-slate-400 block mb-0.5 font-sans font-bold text-[10px] uppercase">Backend REST Microservice:</span>
            <p className="font-bold text-slate-800">http://localhost:5000/api</p>
          </div>

          <div className="p-4 bg-[#f4f8f6] rounded-2xl">
            <span className="text-slate-400 block mb-0.5 font-sans font-bold text-[10px] uppercase">WebSocket Broadcaster:</span>
            <p className="font-bold text-slate-800">ws://localhost:5000 (Socket.IO)</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900 font-display">Re-Scan Trial Risk Engine</p>
            <p className="text-[11px] text-slate-500">Triggers continuous rule evaluation across all 25 trial protocols.</p>
          </div>
          <button
            onClick={handleReSeed}
            disabled={reSeeding}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f4a28c] hover:bg-[#e26b4e] text-white rounded-full font-bold text-xs font-display shadow-peach-glow transition-all active:scale-[0.98]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reSeeding ? 'animate-spin' : ''}`} />
            <span>RE-SCAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};

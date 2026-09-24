import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Phone, ShieldCheck, Heart, Mail, MapPin, 
  CheckCircle2, AlertCircle, Save, Sparkles, Lock, Clock,
  Camera, Upload, Trash2, Edit3, X, Image, RefreshCw, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import patientApi from '../../services/patientApi';

const AVATAR_PRESETS = [
  { id: 'aditi', label: 'Aditi (Current Demo)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80' },
  { id: 'rajesh', label: 'Rajesh', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80' },
  { id: 'sunita', label: 'Sunita', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80' },
  { id: 'vikram', label: 'Vikram', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80' },
  { id: 'meera', label: 'Meera', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80' },
  { id: 'ananya', label: 'Ananya', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80' },
  { id: 'arjun', label: 'Arjun', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80' },
  { id: 'priya', label: 'Priya', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80' },
];

export default function PatientProfilePage() {
  const { user, updateProfile: authUpdateProfile } = useAuth();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  
  // UI states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getOverview();
      setOverview(res);
      const p = res.patient || {};
      setName(p.fullName || user?.name || 'Aditi Sharma');
      setAvatar(p.avatar || user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80');
      setPhone(p.phoneNumber || p.phone || '');
      setEmergencyContactName(p.emergencyContactName || 'Rajesh Sharma');
      setEmergencyContactRelation(p.emergencyContactRelation || 'Spouse');
      setEmergencyContactPhone(p.emergencyContactPhone || p.emergencyContact || '+91-98112-99887');
      setPreferredLanguage(p.preferredLanguage || 'English');
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.message || 'Unable to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          setShowPhotoModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (customPhotoUrl.trim()) {
      setAvatar(customPhotoUrl.trim());
      setCustomPhotoUrl('');
      setShowPhotoModal(false);
    }
  };

  const handleSelectPreset = (url) => {
    setAvatar(url);
    setShowPhotoModal(false);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    setShowPhotoModal(false);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('Full Name cannot be blank.');
      return;
    }

    try {
      setSaving(true);
      setSaveSuccess(null);
      
      const payload = {
        name: name.trim(),
        fullName: name.trim(),
        avatar: avatar || null,
        phoneNumber: phone.trim(),
        phone: phone.trim(),
        emergencyContact: emergencyContactPhone.trim(),
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactRelation: emergencyContactRelation.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        preferredLanguage,
      };

      // 1. Update patient and user endpoints
      await patientApi.updateProfile(payload);
      
      // 2. Synchronize AuthContext state so header/sidebar update immediately
      if (authUpdateProfile) {
        await authUpdateProfile({ name: name.trim(), avatar: avatar || null });
      }

      setSaveSuccess('Your name, profile photo, and contact details have been updated successfully.');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-sm animate-pulse">Loading participant profile...</p>
      </div>
    );
  }

  const { patient, trial, center } = overview || {};

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Participant Profile & Settings</h1>
        <p className="text-stone-600 text-sm mt-1">
          Update your preferred display name, profile avatar, and emergency clinical contacts.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
          <button 
            onClick={() => setSaveSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Profile Overview Top Card with Interactive Avatar & Name Edit */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        
        {/* Avatar with Camera Overlay Trigger */}
        <div className="relative group shrink-0">
          <div 
            onClick={() => setShowPhotoModal(true)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden cursor-pointer shadow-md border-2 border-white ring-2 ring-stone-200 group-hover:ring-teal-500 transition-all flex items-center justify-center bg-gradient-to-tr from-sage-700 to-teal-800 text-white font-bold text-3xl"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <span>{(name || 'A').slice(0, 2).toUpperCase()}</span>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 rounded-3xl backdrop-blur-2xs">
              <Camera className="w-5 h-5 text-white" />
              <span>Change Photo</span>
            </div>
          </div>

          {/* Quick Camera Action Badge */}
          <button
            type="button"
            onClick={() => setShowPhotoModal(true)}
            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-teal-700 hover:bg-teal-800 text-white shadow-md border-2 border-white flex items-center justify-center transition transform active:scale-95"
            title="Edit profile picture"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Name & Quick Metadata */}
        <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sage-100 text-sage-800 border border-sage-200">
              {patient?.patientDisplayId || user?.uniqueId || 'AIIA-PAT-1001'}
            </span>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
              Subject ID: {patient?.id || patient?.syntheticPatientId || 'SYNTH-DEL-1001'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              ● {patient?.status || 'Enrolled'}
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 truncate">{name}</h2>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('full-name-input');
                el?.focus();
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-teal-700 transition"
              title="Edit Full Name"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-500 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>{user?.email || 'patient@aiia.demo'}</span>
            <span>•</span>
            <span>Enrolled on {patient?.enrolledDate || patient?.enrollmentDate ? new Date(patient?.enrolledDate || patient?.enrollmentDate).toLocaleDateString() : 'Jun 12, 2026'}</span>
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={() => setShowPhotoModal(true)}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-stone-500" />
              <span>Change Photo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('full-name-input');
                el?.focus();
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-600" />
              <span>Edit Name</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Study Demographics & Editable Profile / Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Study & Ayurvedic Demographics (Read-only Clinical Record) */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Clinical Study Demographics
            </h3>
            <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">Verified</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Ayurvedic Constitution (Prakriti)</span>
              <span className="font-bold text-stone-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                {patient?.doshaPrakriti || 'Vata-Pitta'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Age / Gender</span>
              <span className="font-bold text-stone-800">{patient?.age || 34} Yrs / {patient?.gender || 'Female'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Enrolled Clinical Protocol</span>
              <span className="font-mono font-bold text-teal-800">{trial?.trialId || 'AYU-001'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Investigational Center</span>
              <span className="font-bold text-stone-800 truncate max-w-[200px]" title={center?.name}>
                {center?.name || 'AIIA New Delhi'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-stone-500 font-medium">Electronic Health ID</span>
              <span className="font-mono text-stone-700">ABHA-7749-2091-8832</span>
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60 text-xs text-stone-600 flex items-start gap-2">
            <Lock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>Clinical demographics and protocol enrollment are locked by AIIA research investigators.</span>
          </div>
        </div>

        {/* Right: Editable Identity, Photo & Contact Form */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Edit Personal & Contact Information
            </h3>
            <p className="text-xs text-stone-500">Changes will synchronize across your trial dashboard and care team</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            
            {/* Full Name Field */}
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="full-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                  required
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Your display name for communications with your research doctor and nurse.</p>
            </div>

            {/* Profile Photo Quick Action Row */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 border border-stone-300 flex items-center justify-center shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-xs text-stone-600">{(name || 'A').slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-xs">Profile Picture</h4>
                  <p className="text-[11px] text-stone-500">{avatar ? 'Custom photo active' : 'Default initials'}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="px-3 py-1.5 bg-white hover:bg-stone-100 text-teal-800 border border-stone-300 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-teal-600" />
                <span>Change</span>
              </button>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Your Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91-98765-43210"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Emergency Contact Name */}
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Emergency Contact Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emergencyContactRelation}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                  placeholder="e.g. Spouse, Parent"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Emergency Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+91-98112-99887"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Preferred Communications Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:ring-2 focus:ring-teal-500 outline-none text-sm bg-white"
              >
                <option value="English">English</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="Sanskrit">संस्कृतम् (Sanskrit)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#608c7d] hover:bg-[#4d7265] active:scale-98 text-white font-bold text-sm rounded-2xl shadow-md shadow-[#608c7d]/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Profile & Contact Details'}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Pop-up Modal for Changing Profile Picture */}
      {showPhotoModal && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setShowPhotoModal(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-stone-200 overflow-hidden flex flex-col my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Update Profile Picture</h3>
                  <p className="text-xs text-stone-500">Upload a photo or select from curated research presets</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              
              {/* Current Active Preview */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-stone-300 flex items-center justify-center bg-gradient-to-tr from-sage-700 to-teal-800 text-white font-bold text-2xl shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(name || 'A').slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <h4 className="font-bold text-stone-800 text-sm">Upload Photo from Computer</h4>
                  <p className="text-xs text-stone-500">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File from Device</span>
                  </button>
                </div>
              </div>

              {/* Curated Preset Avatars Gallery */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Or Choose from Preset Patient Avatars
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((p) => {
                    const isSelected = avatar === p.url;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p.url)}
                        className={`relative group rounded-2xl overflow-hidden aspect-square border-2 transition transform active:scale-95 ${
                          isSelected 
                            ? 'border-teal-600 ring-2 ring-teal-500 ring-offset-2' 
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                        title={p.label}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-teal-900/40 flex items-center justify-center text-white">
                            <Check className="w-5 h-5 drop-shadow-md stroke-[3]" />
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold py-0.5 text-center truncate px-1 opacity-0 group-hover:opacity-100 transition">
                          {p.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Paste Image URL */}
              <form onSubmit={handleApplyCustomUrl} className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Or Paste Public Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition"
                  >
                    Apply URL
                  </button>
                </div>
              </form>

              {/* Actions Footer inside Modal */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo (Use Initials)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}


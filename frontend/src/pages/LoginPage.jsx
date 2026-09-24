import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  UserCheck,
  Building2,
  HeartPulse,
  Users,
  Lock,
  Heart,
  Stethoscope,
  Activity,
  FileCheck
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, quickDemoLogin } = useAuth();
  const { addToast } = useNotification();

  // Portal selection: 'staff' or 'patient'
  const [portalType, setPortalType] = useState('staff');
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  // Staff Login state
  const [email, setEmail] = useState(import.meta.env.DEV ? 'admin@aiia.demo' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? 'Demo@AIIA2025' : '');

  // Patient Login state
  const [patientEmail, setPatientEmail] = useState(import.meta.env.DEV ? 'patient@aiia.demo' : '');
  const [patientPassword, setPatientPassword] = useState(import.meta.env.DEV ? 'Demo@AIIA2025' : '');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Registration form state (Staff or Patient)
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Kayachikitsa (Internal Medicine)',
    trialCode: 'AYU-001',
    doshaPrakriti: 'Vata-Pitta',
  });

  const demoAccessEnabled = import.meta.env.DEV;

  const staffDemoAccounts = [
    { role: 'ADMIN', name: 'Dr. Tanuja Nesari', title: 'Admin', icon: '👑', id: 'AIIA-ADM-1001' },
    { role: 'RESEARCHER', name: 'Dr. Anand Kumar', title: 'Investigator', icon: '🔬', id: 'AIIA-RES-2002' },
    { role: 'SAFETY_OFFICER', name: 'Dr. Priyadarshini Rao', title: 'Safety PV', icon: '🛡️', id: 'AIIA-SAF-3003' },
    { role: 'COMPLIANCE_OFFICER', name: 'Adv. Rajeshwar Sharma', title: 'Compliance', icon: '⚖️', id: 'AIIA-CMP-4004' },
    { role: 'MANAGEMENT', name: 'Prof. Vaidya K. S. Dhiman', title: 'Management', icon: '📈', id: 'AIIA-MGT-5005' },
  ];

  const patientDemoAccounts = [
    { name: 'Aditi Sharma', trial: 'AYU-001', protocol: 'Ashwagandha', icon: '🌸', id: 'AIIA-PAT-1001', subId: 'SYNTH-DEL-1001' },
    { name: 'Rajesh Verma', trial: 'AYU-002', protocol: 'Guduchi', icon: '🌿', id: 'AIIA-PAT-1002', subId: 'SYNTH-JAI-1002' },
    { name: 'Sunita Gupta', trial: 'AYU-003', protocol: 'Shallaki', icon: '🍃', id: 'AIIA-PAT-1003', subId: 'SYNTH-VAR-1003' },
    { name: 'Vikram Mehta', trial: 'AYU-004', protocol: 'Brahmi', icon: '🌱', id: 'AIIA-PAT-1004', subId: 'SYNTH-KOL-1004' },
    { name: 'Meera Joshi', trial: 'AYU-005', protocol: 'Triphala', icon: '🪷', id: 'AIIA-PAT-1005', subId: 'SYNTH-MUM-1005' },
  ];

  const handleStaffLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast({ title: 'Email Required', message: 'Please enter your institutional email.', type: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      addToast({
        title: 'Welcome to AIIA Hub',
        message: `${res.message}`,
        type: 'success',
      });
      if (res.user.role === 'PATIENT') {
        navigate('/patient/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      addToast({ title: 'Authentication Failed', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientLoginSubmit = async (e) => {
    e.preventDefault();
    if (!patientEmail) {
      addToast({ title: 'Email Required', message: 'Please enter your registered participant email.', type: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const res = await login(patientEmail, patientPassword);
      addToast({
        title: 'Welcome to Patient Portal',
        message: `Hello ${res.user.name}, your clinical trial dashboard is ready.`,
        type: 'success',
      });
      navigate('/patient/dashboard');
    } catch (err) {
      addToast({ title: 'Authentication Failed', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      addToast({ title: 'Validation Error', message: 'Please fill all required fields.', type: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const isPatientReg = portalType === 'patient';
      const payload = {
        ...regData,
        role: isPatientReg ? 'PATIENT' : 'RESEARCHER',
      };

      const res = await register(payload);
      addToast({
        title: 'Account Registered!',
        message: `Welcome ${res.user.name}! Your Unique ID is ${res.user.uniqueId}`,
        type: 'success',
      });
      
      if (isPatientReg) {
        navigate('/patient/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      addToast({ title: 'Registration Failed', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStaffLogin = async (role) => {
    try {
      setLoading(true);
      const res = await quickDemoLogin(role);
      addToast({ title: 'Demo Persona Activated', message: res.message, type: 'success' });
      navigate('/dashboard');
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPatientLogin = async () => {
    try {
      setLoading(true);
      const res = await quickDemoLogin('PATIENT');
      addToast({ title: 'Patient Persona Activated', message: `Logged in as Aditi Sharma (SYNTH-DEL-1001)`, type: 'success' });
      navigate('/patient/dashboard');
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen bg-white flex flex-col lg:flex-row overflow-y-auto font-sans selection:bg-[#9ed948] selection:text-slate-900">
      {/* Left Full-Height 3D Scene */}
      <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-full relative bg-[#d8f0b4] shrink-0 overflow-hidden">
        <img
          src="/assets/login_3d_hero.jpg"
          alt="AIIA Clinical Research 3D Scene"
          className="w-full h-full object-cover object-center absolute inset-0 select-none pointer-events-none"
        />

        {/* Top-Left Telemetry Badge */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a3325]/85 backdrop-blur-md border border-white/10 text-[#a3eb4a] text-xs font-mono font-bold shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#9ed948] animate-pulse" />
          <span>INTELLIX • AIIA CLINICAL TRIAL HUB</span>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-6 left-6 right-6 z-10 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs">
          <p className="font-bold font-display text-sm text-white">Ayurvedic Clinical Intelligence & Patient Hub</p>
          <p className="text-white/80 text-[11px] mt-0.5">
            Connecting clinical research teams, ethics committees, and trial participants across India.
          </p>
        </div>
      </div>

      {/* Right Full-Height Form Pane */}
      <div className="w-full lg:w-1/2 min-h-full bg-white flex flex-col justify-between items-center p-6 sm:p-10 md:p-12 lg:p-14 overflow-y-auto">
        {/* Top Brand Logo */}
        <div className="flex items-center gap-2 pt-2 sm:pt-3">
          <div className="w-7 h-7 rounded-lg bg-[#9ed948] flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm leading-none">+</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#1c3322] tracking-tight font-display">
            INTELLIX
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono tracking-wider ml-1">
            AIIA HUB
          </span>
        </div>

        {/* Center Form Section */}
        <div className="w-full max-w-[430px] my-auto py-4 space-y-4 text-center">
          {/* Dual Portal Switcher Tabs */}
          <div className="p-1 bg-[#f4f8f6] rounded-2xl border border-slate-200 flex items-center gap-1 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setPortalType('staff');
                setMode('login');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-display transition-all flex items-center justify-center gap-1.5 ${
                portalType === 'staff'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#3b682b]" />
              <span>STAFF / RESEARCH TEAM</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalType('patient');
                setMode('login');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-display transition-all flex items-center justify-center gap-1.5 ${
                portalType === 'patient'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-[#3b682b]" />
              <span>PATIENT PORTAL</span>
            </button>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a2e21] tracking-tight font-display">
              {portalType === 'patient'
                ? mode === 'login' ? 'Participant Portal' : 'Register Trial Participant'
                : mode === 'login' ? 'Staff Sign In' : 'Create Investigator Account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {portalType === 'patient'
                ? mode === 'login'
                  ? 'Sign in to access your trial schedule, questionnaires, and health records'
                  : 'Register your participant profile and link your Clinical Trial Subject ID'
                : mode === 'login'
                  ? 'Admin • Researcher • Safety • Compliance • Management'
                  : 'Register your investigator profile to receive a Unique Institutional ID'}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* PORTAL 1: PATIENT PORTAL */}
          {/* ========================================================================= */}
          {portalType === 'patient' && (
            <div className="space-y-3 text-left pt-1">
              {mode === 'login' ? (
                <form onSubmit={handlePatientLoginSubmit} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="Participant registered email or ID"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium shadow-sm"
                      required
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium pr-11 shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Main Matching CTA Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1.5 py-3.5 px-6 rounded-2xl bg-[#9ed948] hover:bg-[#8ecb3d] active:scale-[0.99] text-[#1c3322] font-extrabold text-sm tracking-wide transition-all shadow-md shadow-[#9ed948]/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#1c3322]" />
                    ) : (
                      <span>Sign in to Participant Portal</span>
                    )}
                  </button>
                </form>
              ) : (
                /* Patient Registration Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-2.5 text-left pt-1 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                      Participant Full Name *
                    </label>
                    <input
                      type="text"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                      Registered Email Address *
                    </label>
                    <input
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="e.g. aditi.sharma@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium shadow-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                        Enrolled Trial Protocol
                      </label>
                      <select
                        value={regData.trialCode}
                        onChange={(e) => setRegData({ ...regData, trialCode: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#9ed948] shadow-sm"
                      >
                        <option value="AYU-001">AYU-001 (Ashwagandha)</option>
                        <option value="AYU-002">AYU-002 (Guduchi)</option>
                        <option value="AYU-003">AYU-003 (Shallaki)</option>
                        <option value="AYU-004">AYU-004 (Brahmi)</option>
                        <option value="AYU-005">AYU-005 (Triphala)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                        Dosha Prakriti
                      </label>
                      <select
                        value={regData.doshaPrakriti}
                        onChange={(e) => setRegData({ ...regData, doshaPrakriti: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#9ed948] shadow-sm"
                      >
                        <option value="Vata-Pitta">Vata-Pitta</option>
                        <option value="Pitta-Kapha">Pitta-Kapha</option>
                        <option value="Vata-Kapha">Vata-Kapha</option>
                        <option value="Tridoshaja">Tridoshaja</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        placeholder="Create a secure password"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium pr-10 shadow-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#f0f9e1] rounded-xl border border-[#d6efaa] text-[10px] text-[#1c3322] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#72ac23] shrink-0" />
                    <span>A participant ID (e.g. <strong>AIIA-PAT-XXXX</strong>) will automatically be generated.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-6 rounded-2xl bg-[#9ed948] hover:bg-[#8ecb3d] active:scale-[0.99] text-[#1c3322] font-extrabold text-sm tracking-wide transition-all shadow-md shadow-[#9ed948]/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#1c3322]" />
                    ) : (
                      <span>Register Participant Account</span>
                    )}
                  </button>
                </form>
              )}

              {/* Patient 5 Quick Demo Personas (Exact matching grid as staff) */}
              {mode === 'login' && demoAccessEnabled && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Participant Quick Demo Personas</span>
                    <span className="text-[#3b682b] font-bold">1-Click</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {patientDemoAccounts.map((acc, idx) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={handleQuickPatientLogin}
                        title={`Login as ${acc.name} (${acc.subId} • ${acc.trial})`}
                        className="p-1.5 rounded-xl bg-[#f0f9e1] hover:bg-[#9ed948] text-[#1c3322] border border-[#d6efaa] text-[10px] font-bold flex flex-col items-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <span className="text-xs">{acc.icon}</span>
                        <span className="truncate w-full text-center text-[9px] mt-0.5">{acc.name.split(' ')[0]}</span>
                        <span className="text-[8px] text-slate-500 font-mono scale-90">{acc.trial}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* PORTAL 2: STAFF / RESEARCH TEAM */}
          {/* ========================================================================= */}
          {portalType === 'staff' && (
            <>
              {mode === 'login' ? (
                <form onSubmit={handleStaffLoginSubmit} className="space-y-3 text-left pt-1">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Institutional email address"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium shadow-sm"
                      required
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium pr-11 shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Main CTA Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1.5 py-3.5 px-6 rounded-2xl bg-[#9ed948] hover:bg-[#8ecb3d] active:scale-[0.99] text-[#1c3322] font-extrabold text-sm tracking-wide transition-all shadow-md shadow-[#9ed948]/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#1c3322]" />
                    ) : (
                      <span>Sign in to Staff Platform</span>
                    )}
                  </button>
                </form>
              ) : (
                /* Staff Registration Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-2.5 text-left pt-1 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                      Full Name & Title *
                    </label>
                    <input
                      type="text"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Dr. Vikramaditya Joshi"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                      Institutional Email *
                    </label>
                    <input
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="e.g. vikram.joshi@aiia.gov.in"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                      Department
                    </label>
                    <select
                      value={regData.department}
                      onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#9ed948] shadow-sm"
                    >
                      <option value="Kayachikitsa (Internal Medicine)">Kayachikitsa</option>
                      <option value="Dravyaguna (Pharmacology)">Dravyaguna</option>
                      <option value="Panchakarma">Panchakarma</option>
                      <option value="Pharmacovigilance Unit">Pharmacovigilance</option>
                      <option value="Ethics Committee">Ethics Committee</option>
                      <option value="Directorate & Administration">Directorate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        placeholder="Create a secure password"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed948] focus:ring-2 focus:ring-[#9ed948]/30 transition-all font-medium pr-10 shadow-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#f0f9e1] rounded-xl border border-[#d6efaa] text-[10px] text-[#1c3322] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#72ac23] shrink-0" />
                    <span>An institutional ID (e.g. <strong>AIIA-RES-XXXX</strong>) will automatically be generated.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-6 rounded-2xl bg-[#9ed948] hover:bg-[#8ecb3d] active:scale-[0.99] text-[#1c3322] font-extrabold text-sm tracking-wide transition-all shadow-md shadow-[#9ed948]/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#1c3322]" />
                    ) : (
                      <span>Create Account & Generate ID</span>
                    )}
                  </button>
                </form>
              )}

              {/* Staff 5 Demo Persona Buttons */}
              {mode === 'login' && demoAccessEnabled && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Staff Quick Demo Personas</span>
                    <span className="text-[#3b682b] font-bold">1-Click</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {staffDemoAccounts.map((acc) => (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleQuickStaffLogin(acc.role)}
                        title={`Login as ${acc.name} (${acc.id})`}
                        className="p-1.5 rounded-xl bg-[#f0f9e1] hover:bg-[#9ed948] text-[#1c3322] border border-[#d6efaa] text-[10px] font-bold flex flex-col items-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <span className="text-xs">{acc.icon}</span>
                        <span className="truncate w-full text-center text-[9px] mt-0.5">{acc.title}</span>
                        <span className="text-[8px] text-slate-500 font-mono scale-90">{acc.id.split('-')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Privacy Reassurance */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
            <Lock className="w-3 h-3 text-[#608c7d]" />
            <span>Encrypted institutional authentication session</span>
          </div>
        </div>

        {/* Footer Link (Toggle Login / Register for both portals) */}
        <div className="pb-2 pt-2">
          {portalType === 'staff' ? (
            <p className="text-xs text-slate-500 font-medium">
              {mode === 'login' ? "Don't have an investigator account? " : 'Already registered? '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[#2b4c30] font-bold hover:underline focus:outline-none ml-1"
              >
                {mode === 'login' ? 'Create an account' : 'Log in with Email'}
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              {mode === 'login' ? "New trial participant? " : 'Already enrolled? '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[#2b4c30] font-bold hover:underline focus:outline-none ml-1"
              >
                {mode === 'login' ? 'Register participant profile' : 'Log in with Participant ID'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

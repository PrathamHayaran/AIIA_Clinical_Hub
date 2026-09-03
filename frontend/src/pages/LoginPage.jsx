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
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, quickDemoLogin } = useAuth();
  const { addToast } = useNotification();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login form state
  const [email, setEmail] = useState('admin@aiia.demo');
  const [password, setPassword] = useState('Demo@AIIA2025');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Registration form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'RESEARCHER',
    department: 'Kayachikitsa (Internal Medicine)',
  });

  const demoAccounts = [
    { role: 'ADMIN', name: 'Dr. Tanuja Nesari', title: 'Admin', icon: '👑', id: 'AIIA-ADM-1001' },
    { role: 'RESEARCHER', name: 'Dr. Anand Kumar', title: 'Investigator', icon: '🔬', id: 'AIIA-RES-2002' },
    { role: 'SAFETY_OFFICER', name: 'Dr. Priyadarshini Rao', title: 'Safety PV', icon: '🛡️', id: 'AIIA-SAF-3003' },
    { role: 'COMPLIANCE_OFFICER', name: 'Adv. Rajeshwar Sharma', title: 'Compliance', icon: '⚖️', id: 'AIIA-CMP-4004' },
    { role: 'MANAGEMENT', name: 'Prof. Vaidya K. S. Dhiman', title: 'Management', icon: '📈', id: 'AIIA-MGT-5005' },
  ];

  const handleLoginSubmit = async (e) => {
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
      navigate('/dashboard');
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
      const res = await register(regData);
      addToast({
        title: 'Account Registered!',
        message: `Welcome ${res.user.name}! Your Unique ID is ${res.user.uniqueId}`,
        type: 'success',
      });
      navigate('/dashboard');
    } catch (err) {
      addToast({ title: 'Registration Failed', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
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
          <span>AIIA CTMS • MULTI-CENTER HUB</span>
        </div>
      </div>

      {/* Right Full-Height Clean Form Pane */}
      <div className="w-full lg:w-1/2 min-h-full bg-white flex flex-col justify-between items-center p-6 sm:p-10 md:p-12 lg:p-14 overflow-y-auto">
        {/* Top Brand Logo */}
        <div className="flex items-center gap-2 pt-2 sm:pt-3">
          <div className="w-7 h-7 rounded-lg bg-[#9ed948] flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm leading-none">+</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#1c3322] tracking-tight font-display">
            messimo
          </span>
        </div>

        {/* Center Form Section */}
        <div className="w-full max-w-[400px] my-auto py-4 space-y-4 text-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a2e21] tracking-tight font-display">
              {mode === 'login' ? 'Welcome back' : 'Create an Account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {mode === 'login'
                ? 'Sign in with your institutional email to access trials'
                : 'Register your investigator profile to receive a Unique ID'}
            </p>
          </div>

          {/* Mode 1: LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3 text-left pt-1">
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
                  <span>Sign in</span>
                )}
              </button>
            </form>
          ) : (
            /* Mode 2: REGISTRATION FORM */
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-display">
                    Role *
                  </label>
                  <select
                    value={regData.role}
                    onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#9ed948] shadow-sm"
                  >
                    <option value="RESEARCHER">🔬 Researcher</option>
                    <option value="SAFETY_OFFICER">🛡️ Safety Officer</option>
                    <option value="COMPLIANCE_OFFICER">⚖️ Compliance</option>
                    <option value="ADMIN">👑 Administrator</option>
                    <option value="MANAGEMENT">📈 Management</option>
                  </select>
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

              {/* Unique ID Info Note */}
              <div className="p-2.5 bg-[#f0f9e1] rounded-xl border border-[#d6efaa] text-[10px] text-[#1c3322] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#72ac23] shrink-0" />
                <span>An institutional ID (e.g. <strong>AIIA-RES-XXXX</strong>) will automatically be generated for you.</span>
              </div>

              {/* Register Button */}
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

          {/* Social Divider & Quick Persona Buttons (Shown in Login mode) */}
          {mode === 'login' && (
            <>
              <div className="pt-1">
                <p className="text-[11px] font-semibold text-slate-400">
                  or sign up with
                </p>

                {/* Social Buttons: Google, Microsoft, GitHub */}
                <div className="flex items-center justify-center gap-3 mt-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ADMIN')}
                    title="Sign in with Google / Admin"
                    className="w-10 h-10 rounded-2xl bg-[#f0f9e1] hover:bg-[#e4f5cc] text-[#2d4d23] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('RESEARCHER')}
                    title="Sign in with Microsoft / Researcher"
                    className="w-10 h-10 rounded-2xl bg-[#f0f9e1] hover:bg-[#e4f5cc] text-[#2d4d23] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="1" y="1" width="10" height="10" />
                      <rect x="13" y="1" width="10" height="10" />
                      <rect x="1" y="13" width="10" height="10" />
                      <rect x="13" y="13" width="10" height="10" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('SAFETY_OFFICER')}
                    title="Sign in with GitHub / Safety Officer"
                    className="w-10 h-10 rounded-2xl bg-[#f0f9e1] hover:bg-[#e4f5cc] text-[#2d4d23] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 1-Click Quick Demo Persona Selector with Unique IDs */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>⚡ 1-Click Demo Persona:</span>
                  <span className="text-[#3b682b] font-bold">Hackathon Ready</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickLogin(acc.role)}
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
            </>
          )}

          {/* Terms and Privacy Policy Text */}
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed pt-1">
            By accessing this hub you agree to AIIA's{' '}
            <a href="#terms" className="text-[#2b4c30] font-bold hover:underline">
              Terms of Services
            </a>{' '}
            and{' '}
            <a href="#privacy" className="text-[#2b4c30] font-bold hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Footer Navigation Link */}
        <div className="pb-2 pt-2">
          <p className="text-xs text-slate-500 font-medium">
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[#2b4c30] font-bold hover:underline focus:outline-none ml-1"
            >
              {mode === 'login' ? 'Create an account' : 'Log in with Email'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

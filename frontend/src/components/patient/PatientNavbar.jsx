import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Bell,
  Lock,
  HeartPulse,
  LogOut,
  User,
  ShieldCheck,
  AlertTriangle,
  X,
  PhoneCall,
} from 'lucide-react';

export const PatientNavbar = ({ setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 sm:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-30 px-4 sm:px-8 flex items-center justify-between transition-all">
        {/* Left Side: Mobile Menu + Privacy Indicator */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-2xl bg-[#f4f8f6] text-slate-600 hover:text-slate-900 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Privacy Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f8f6] border border-slate-200/70 text-slate-700 text-xs font-semibold shadow-xs">
            <Lock className="w-3.5 h-3.5 text-[#608c7d]" />
            <span className="hidden sm:inline">Your information is private</span>
            <span className="sm:hidden">Private Portal</span>
          </div>

          {/* Trial Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#608c7d]/10 border border-[#608c7d]/20 text-[#608c7d] text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-[#608c7d] animate-pulse" />
            <span>TRIAL AYU-001 (ACTIVE)</span>
          </div>
        </div>

        {/* Right Side: Emergency Notice + Notifications + Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Notice Action */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Medical Help</span>
          </button>

          {/* Notifications Link */}
          <NavLink
            to="/patient/notifications"
            className="p-2.5 rounded-full bg-[#f4f8f6] hover:bg-slate-100 text-slate-600 hover:text-slate-900 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f4a28c]" />
          </NavLink>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-[#f4f8f6] transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200/80"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Patient'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight font-display">
                  {user?.name || 'Aditi Sharma'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {user?.uniqueId || 'AIIA-PAT-1001'}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200/80 shadow-soft-xl p-2 z-50 text-xs font-medium space-y-1 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate font-display">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/patient/profile');
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-slate-700 hover:bg-[#f4f8f6] transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/patient/privacy');
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-slate-700 hover:bg-[#f4f8f6] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Privacy & Security</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Emergency Guidance Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-soft-xl border border-slate-200 relative animate-fadeIn">
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#f4f8f6]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-xs">
              <HeartPulse className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-display">Medical Emergency Guidance</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              If you are experiencing severe pain, difficulty breathing, sudden chest tightness, or believe you have a medical emergency:
            </p>

            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 space-y-2">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Call Emergency Services immediately: <strong>112</strong> or <strong>102</strong></span>
              </p>
              <p className="text-[11px] font-normal text-rose-700">
                Proceed directly to your nearest hospital emergency department. This web platform is for clinical research tracking and is not a real-time emergency service.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>AIIA Research Emergency Desk:</span>
              <strong className="text-slate-900 font-mono">+91-11-29997601</strong>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="mt-5 w-full py-2.5 rounded-full bg-[#608c7d] hover:bg-[#537e70] text-white font-bold text-xs shadow-soft-sm transition-all"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
};

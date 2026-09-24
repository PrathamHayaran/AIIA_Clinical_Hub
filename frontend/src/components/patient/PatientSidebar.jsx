import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FlaskConical,
  Calendar,
  Pill,
  HeartPulse,
  ClipboardList,
  FileText,
  User,
  Bell,
  MessageSquare,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Lock,
} from 'lucide-react';

export const PatientSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/patient/dashboard' },
    { label: 'My Trial', icon: FlaskConical, path: '/patient/trial' },
    { label: 'Visits', icon: Calendar, path: '/patient/visits' },
    { label: 'Treatment & Adherence', icon: Pill, path: '/patient/treatment' },
    { label: 'Health & Safety', icon: HeartPulse, path: '/patient/safety', badge: 'Active' },
    { label: 'Questionnaires', icon: ClipboardList, path: '/patient/questionnaires' },
    { label: 'Documents & Consent', icon: FileText, path: '/patient/documents' },
    { label: 'My Profile', icon: User, path: '/patient/profile' },
    { label: 'Notifications', icon: Bell, path: '/patient/notifications' },
    { label: 'Study Team', icon: MessageSquare, path: '/patient/study-team' },
    { label: 'Privacy & Security', icon: ShieldCheck, path: '/patient/privacy' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 shadow-soft-sm flex flex-col justify-between transition-transform duration-300 ease-in-out font-sans ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#608c7d] to-[#7aa898] flex items-center justify-center text-white shadow-soft-sm shrink-0">
              <span className="font-extrabold text-base font-display">A+</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight font-display block leading-tight">
                AIIA Hub
              </span>
              <span className="text-[10px] font-bold text-[#608c7d] tracking-wider uppercase font-mono block">
                PATIENT PORTAL
              </span>
            </div>
          </div>

          {/* Patient Quick Card */}
          <div className="p-3 bg-[#f4f8f6] rounded-2xl border border-slate-200/60 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Patient'}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate font-display">
                {user?.name || 'Aditi Sharma'}
              </h4>
              <p className="text-[10px] font-mono font-bold text-[#608c7d] truncate">
                SYNTH-DEL-1001
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-semibold text-slate-500">Trial AYU-001</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#608c7d] text-white shadow-soft-sm font-bold'
                      : 'text-slate-600 hover:bg-[#f4f8f6] hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#608c7d]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && !isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#f4a28c]/20 text-[#e26b4e]">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Privacy & Security Callout */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-500 text-[10px] flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#608c7d] shrink-0" />
            <span className="leading-tight font-medium">Your data is strictly private to your trial team.</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

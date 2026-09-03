import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  LayoutDashboard,
  FlaskConical,
  Users,
  Building2,
  ShieldCheck,
  Activity,
  Sparkles,
  BarChart2,
  Sliders,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Compass,
  Check,
  Copy,
  Leaf,
  ShieldAlert,
  Zap,
  Flame,
  Wind,
  Droplets,
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { liveAlerts } = useNotification();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCopyId = (e) => {
    e.stopPropagation();
    if (user?.uniqueId) {
      navigator.clipboard.writeText(user.uniqueId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Clinical Trials', icon: FlaskConical, path: '/trials', badge: '25' },
    { label: 'Patient Cohorts', icon: Users, path: '/recruitment', badge: '86%' },
    { label: 'Research Centers', icon: Building2, path: '/sites' },
    { label: 'Safety & PV', icon: Activity, path: '/safety', badge: 'PV' },
    { label: 'Compliance & IEC', icon: ShieldCheck, path: '/compliance' },
    { label: 'AI Copilot', icon: Sparkles, path: '/ai-copilot', badge: 'AI', isAi: true },
    { label: 'Analytics', icon: BarChart2, path: '/analytics' },
    { label: 'Alert Engine', icon: Compass, path: '/alerts', badge: liveAlerts.length > 0 ? `${liveAlerts.length}` : 'LIVE' },
    { label: 'Preferences', icon: Sliders, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-white border-r border-slate-200/80 shadow-soft-xl transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* 1. Brand Header with Animated Ayurvedic Prana Emblem & Clear Expand Action */}
        {isCollapsed ? (
          <div className="h-20 w-full flex items-center justify-center border-b border-slate-100 bg-white">
            <button
              onClick={() => setIsCollapsed(false)}
              title="Click to Expand Navigation"
              className="relative group p-1.5 rounded-2xl hover:bg-[#f4f8f6] transition-all"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#608c7d] via-[#527d6e] to-[#456c5f] text-white flex items-center justify-center shadow-sage-glow group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f4a28c] rounded-full border-2 border-white animate-pulse" />
                {/* Floating Chevron Expand Indicator Badge */}
                <div className="absolute -bottom-1 -right-1.5 w-4 h-4 bg-[#608c7d] text-white rounded-full flex items-center justify-center border border-white shadow-xs group-hover:bg-[#456c5f] transition-colors">
                  <ChevronRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              {/* Logo Emblem with Ayurvedic Botanical Aura */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#608c7d] via-[#527d6e] to-[#456c5f] text-white flex items-center justify-center shadow-sage-glow shrink-0 group animate-botanical-breathe">
                <Compass className="w-5 h-5 transition-transform duration-700 group-hover:rotate-180" />
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#f4a28c] rounded-full border-2 border-white animate-pulse" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-slate-900 tracking-tight font-display leading-none">
                    AIIA Hub
                  </span>
                  <Leaf className="w-3.5 h-3.5 text-[#608c7d] animate-herb-sway" />
                </div>
                <span className="text-[10px] text-[#608c7d] font-bold tracking-wider uppercase mt-1 leading-none">
                  Clinical CTMS
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCollapsed(true)}
              title="Collapse Sidebar"
              className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#f4f8f6] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Navigation Items with Micro-Animations & Herbal Sprout Hover */}
        <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-3.5 py-2.5 rounded-[20px] text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#608c7d] to-[#4e7668] text-white font-bold shadow-sage-glow'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#f4f8f6] hover:translate-x-1'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`relative p-1 rounded-xl transition-all ${
                        isActive
                          ? 'text-white'
                          : 'text-[#608c7d] group-hover:text-slate-900 group-hover:scale-110'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0 transition-transform duration-200" />
                    </div>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {/* Micro Botanical Leaf Hover Sprout */}
                  {!isCollapsed && !isActive && (
                    <Leaf className="w-3 h-3 text-[#608c7d] opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 mr-1" />
                  )}

                  {/* Badge Indicator */}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.isAi
                          ? 'bg-[#fdede8] text-[#f4a28c] animate-pulse'
                          : 'bg-[#e4ede9] text-[#2b423b]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active glowing dot in collapsed mode */}
                  {isCollapsed && isActive && (
                    <div className="w-2 h-2 rounded-full bg-[#f4a28c] ml-auto animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* 3. Ayurvedic Prana & Tridosha Harmony Widget (When Expanded) */}
        {!isCollapsed && (
          <div className="px-3 py-2">
            <div className="p-3 bg-gradient-to-br from-[#f4f8f6] via-white to-[#edf2ef] rounded-[24px] border border-slate-200/80 shadow-soft-sm space-y-2.5">
              {/* Top Row: Sprout Animation & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Micro 3D-styled SVG Animated Ayurvedic Sprout */}
                  <div className="w-6 h-6 rounded-lg bg-[#e4ede9] flex items-center justify-center text-[#608c7d]">
                    <svg className="w-4 h-4 animate-herb-sway" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22V12" strokeLinecap="round" />
                      <path d="M12 12C12 7 7 6 7 6C7 11 12 12 12 12Z" fill="#608c7d" fillOpacity="0.4" />
                      <path d="M12 9C12 4 17 3 17 3C17 8 12 9 12 9Z" fill="#f4a28c" fillOpacity="0.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-800 font-display block leading-none">
                      Prakriti Balance
                    </span>
                    <span className="text-[8px] text-[#608c7d] font-bold uppercase tracking-wider">
                      Ayurvedic Vitality
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  100% Live
                </span>
              </div>

              {/* Tri-Dosha Micro Flow Bars: Vata (Air/Cyan), Pitta (Fire/Peach), Kapha (Earth/Sage) */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Wind className="w-2.5 h-2.5 text-cyan-600" /> Vata</span>
                  <span className="flex items-center gap-1"><Flame className="w-2.5 h-2.5 text-[#f4a28c]" /> Pitta</span>
                  <span className="flex items-center gap-1"><Droplets className="w-2.5 h-2.5 text-[#608c7d]" /> Kapha</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden flex gap-0.5">
                  <div className="h-full bg-cyan-500 rounded-full w-1/3 animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="h-full bg-[#f4a28c] rounded-full w-1/3 animate-pulse" style={{ animationDuration: '2.5s' }} />
                  <div className="h-full bg-[#608c7d] rounded-full w-1/3 animate-pulse" style={{ animationDuration: '3.5s' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. User Profile Overview & Quick Logout */}
        <div className="p-3.5 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2.5 p-2 rounded-[22px] bg-gradient-to-r from-[#f4f8f6] to-[#edf2ef] border border-slate-200/60 shadow-xs">
            <div className="relative shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-extrabold text-slate-900 truncate font-display">{user?.name || 'Dr. Tanuja Nesari'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-[#608c7d] font-bold uppercase truncate">
                    {user?.role || 'ADMIN'}
                  </span>
                  {user?.uniqueId && (
                    <button
                      onClick={handleCopyId}
                      title="Click to copy Institutional ID"
                      className="inline-flex items-center gap-0.5 text-[8px] font-mono font-bold px-1.5 py-0.5 bg-white/80 hover:bg-white text-slate-700 rounded-md border border-slate-200 transition-colors shrink-0"
                    >
                      <span>{user.uniqueId}</span>
                      {copied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 text-slate-400" />}
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all ml-auto shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

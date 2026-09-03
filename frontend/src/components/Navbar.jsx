import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  UserCheck,
  Check,
  Compass,
} from 'lucide-react';
import { AyurvedicHerbalCanopy } from './3d/AyurvedicHerbalCanopy';

export const Navbar = ({ isCollapsed, setIsCollapsed, setIsMobileOpen }) => {
  const { user, quickDemoLogin } = useAuth();
  const { liveAlerts, connectionStatus, latencyMs } = useNotification();
  const navigate = useNavigate();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const demoRoles = [
    { role: 'ADMIN', label: '👑 Admin (Dr. Tanuja Nesari)' },
    { role: 'RESEARCHER', label: '🔬 Researcher (Dr. Anand Kumar)' },
    { role: 'SAFETY_OFFICER', label: '🛡️ Safety Officer (Dr. Priyadarshini Rao)' },
    { role: 'COMPLIANCE_OFFICER', label: '⚖️ Compliance Officer (Adv. Rajeshwar Sharma)' },
    { role: 'MANAGEMENT', label: '📈 Management (Prof. Vaidya K. S. Dhiman)' },
  ];

  const handleRoleSwitch = async (role) => {
    try {
      await quickDemoLogin(role);
      setIsRoleMenuOpen(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Quick switch failed:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/trials?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 sm:h-20 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 bg-[#edf2ef]/90 backdrop-blur-xl transition-all duration-300 overflow-hidden ${
        isCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      }`}
    >
      {/* Full Top Ayurvedic Herbs & Shrubs Animated Canopy */}
      <AyurvedicHerbalCanopy />

      {/* Left: Sidebar Toggle + Location Search */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Toggle Button for Mobile and Desktop */}
        <button
          onClick={() => {
            if (window.innerWidth < 1024) {
              if (setIsMobileOpen) setIsMobileOpen(true);
            } else {
              if (setIsCollapsed) setIsCollapsed(!isCollapsed);
            }
          }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-2 bg-white rounded-2xl border border-slate-200 text-slate-700 hover:text-[#608c7d] hover:border-[#608c7d]/40 shadow-sm transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Find trials, locations, centers, etc."
            className="w-60 md:w-80 pl-10 pr-4 py-2 bg-white rounded-full border border-slate-200/80 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#608c7d]/30 shadow-sm"
          />
        </form>
      </div>

      {/* Right Controls: Live Socket Telemetry + 1-Click Role Switcher + Bell + Avatar */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Live WebSocket Status & Latency Pill */}
        <div
          title={`Real-Time CTMS Stream: ${connectionStatus}${latencyMs ? ` • Latency: ${latencyMs}ms` : ''}`}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold shadow-xs border transition-all ${
            connectionStatus === 'CONNECTED'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
              : connectionStatus === 'RECONNECTING'
              ? 'bg-amber-50 text-amber-800 border-amber-200/80 animate-pulse'
              : 'bg-rose-50 text-rose-800 border-rose-200/80'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-500 animate-pulse'
                : connectionStatus === 'RECONNECTING'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          />
          <span>{connectionStatus === 'CONNECTED' ? 'LIVE SYNC' : connectionStatus}</span>
          {connectionStatus === 'CONNECTED' && latencyMs !== null && (
            <span className="opacity-70 font-normal">({latencyMs}ms)</span>
          )}
        </div>
        {/* 1-Click Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#f4a28c] hover:bg-[#e26b4e] text-white rounded-full text-xs font-bold font-display shadow-peach-glow transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline uppercase text-[11px]">{user?.role || 'PERSONA'}</span>
            {user?.uniqueId && (
              <span className="hidden md:inline px-2 py-0.5 bg-black/20 text-white rounded-full text-[10px] font-mono">
                {user.uniqueId}
              </span>
            )}
            <ChevronDown className="w-3 h-3" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl border border-slate-200/80 shadow-soft-xl p-2.5 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1 font-mono font-bold text-[10px] uppercase text-slate-400">
                ⚡ 1-Click Persona Switcher
              </div>
              <div className="space-y-1">
                {demoRoles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSwitch(r.role)}
                    className={`w-full text-left px-3 py-2 rounded-2xl text-xs font-medium transition-all flex items-center justify-between ${
                      user?.role === r.role
                        ? 'bg-[#608c7d] text-white font-bold shadow-sm'
                        : 'hover:bg-[#f4f8f6] text-slate-700'
                    }`}
                  >
                    <span className="truncate">{r.label}</span>
                    {user?.role === r.role && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/alerts')}
          className="relative p-2.5 bg-white rounded-full border border-slate-200/80 text-slate-700 hover:bg-[#f4f8f6] transition-colors shadow-sm"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {liveAlerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f4a28c]" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => navigate('/settings')}
          className="w-9 h-9 rounded-full bg-white ring-2 ring-slate-200/80 overflow-hidden cursor-pointer hover:scale-105 transition-transform shrink-0 shadow-sm"
          title={user?.name || 'Profile'}
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

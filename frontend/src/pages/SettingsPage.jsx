import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import {
  CheckCircle2,
  RefreshCw,
  User,
  Shield,
  Sliders,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [reSeeding, setReSeeding] = useState(false);

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
    { role: 'ADMIN', desc: 'Full write/read access to trials, sites, users, safety events, and AI copilot.', current: user?.role === 'ADMIN' },
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
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-[#f4f8f6] shadow-sm"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
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
                className="px-2.5 py-1 bg-[#608c7d] hover:bg-[#4e7c6e] text-white text-[10px] font-bold rounded-lg transition-colors"
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

      {/* 4. Infrastructure Telemetry & Re-Scan */}
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

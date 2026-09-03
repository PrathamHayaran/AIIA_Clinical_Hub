import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { intelligenceApi } from '../services/intelligenceApi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Calendar,
  Layers,
} from 'lucide-react';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const AlertsPage = () => {
  const { isAdmin, isManagement } = useAuth();
  const { addToast, lastUpdate } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTION_CENTER'); // 'ACTION_CENTER' or 'RAW_ALERTS'
  const [data, setData] = useState(null);
  const [actionCenterData, setActionCenterData] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [scanning, setScanning] = useState(false);

  const fetchAlertsAndActions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (severityFilter !== 'ALL') params.severity = severityFilter;
      if (typeFilter !== 'ALL') params.type = typeFilter;

      const [alertRes, actionRes] = await Promise.all([
        api.get('/alerts', { params }),
        intelligenceApi.getActionCenter().catch(() => ({ actionCenter: null })),
      ]);

      if (alertRes.data.success) {
        setData(alertRes.data.data);
      }
      if (actionRes.actionCenter) {
        setActionCenterData(actionRes.actionCenter);
      }
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsAndActions();
  }, [severityFilter, typeFilter, lastUpdate]);

  const handleResolveAlert = async (alertId) => {
    try {
      const res = await api.put(`/alerts/${alertId}/resolve`);
      if (res.data.success) {
        addToast({ title: 'Alert Acknowledged', message: 'Alert has been marked as resolved.', type: 'success' });
        fetchAlertsAndActions();
      }
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    }
  };

  const handleCompleteAction = async (actionId) => {
    try {
      const res = await intelligenceApi.completeActionItem(actionId);
      if (res.success) {
        addToast({ title: 'Action Acknowledged', message: res.message, type: 'success' });
        fetchAlertsAndActions();
      }
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    }
  };

  const handleTriggerScan = async () => {
    try {
      setScanning(true);
      const res = await api.post('/alerts/scan');
      if (res.data.success) {
        addToast({ title: 'Alert Scan Completed', message: res.data.message, type: 'success' });
        fetchAlertsAndActions();
      }
    } catch (err) {
      addToast({ title: 'Scan Error', message: err.message, type: 'danger' });
    } finally {
      setScanning(false);
    }
  };

  if (loading && !data && !actionCenterData) {
    return (
      <div className="space-y-6 bg-[#edf2ef] p-6">
        <div className="h-8 bg-slate-200 rounded-full w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-[24px] shadow-soft-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const counts = data?.counts || {};
  const alerts = data?.alerts || [];
  const actions = actionCenterData?.actions || [];
  const actionBreakdown = actionCenterData?.breakdown || {};

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                AI Action Center & Decision Support
              </h1>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold text-white">
                INTELLIGENCE ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
              Synthesized operational priority queue — identifies what needs attention today, why it matters, and recommended actions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(isAdmin || isManagement) && (
              <button
                onClick={handleTriggerScan}
                disabled={scanning}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f4a28c] hover:bg-[#e26b4e] text-white rounded-full font-bold text-xs font-display shadow-peach-glow transition-all active:scale-[0.98]"
              >
                <Zap className={`w-4 h-4 ${scanning ? 'animate-bounce' : ''}`} />
                <span>EVALUATE ALL TRIALS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
        <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Total Action Items</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">{actions.length || counts.total || 0}</p>
        </div>

        <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Critical Priorities</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1 font-display">{actionBreakdown.critical || counts.high || 0}</p>
        </div>

        <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-display">High Priorities</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#f4a28c] mt-1 font-display">{actionBreakdown.high || counts.warning || 0}</p>
        </div>

        <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Medium & Low</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#608c7d] mt-1 font-display">{actionBreakdown.medium || counts.resolved || 0}</p>
        </div>
      </div>

      {/* 3. View Mode Toggle + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-4">
        {/* Toggle between AI Action Center and Raw Alerts */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f4f8f6] rounded-2xl border border-slate-200/60 w-fit">
          <button
            onClick={() => setActiveTab('ACTION_CENTER')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'ACTION_CENTER'
                ? 'bg-[#608c7d] text-white shadow-sage-glow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Action Center ({actions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('RAW_ALERTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'RAW_ALERTS'
                ? 'bg-[#608c7d] text-white shadow-sage-glow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Telemetry Alerts ({alerts.length})</span>
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 bg-[#f4f8f6] rounded-full border border-slate-200/60 font-semibold text-xs text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="ALL">All Severities</option>
            <option value="High">Critical / High</option>
            <option value="Warning">Warning</option>
            <option value="Attention">Attention</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-[#f4f8f6] rounded-full border border-slate-200/60 font-semibold text-xs text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="Recruitment">Recruitment</option>
            <option value="Ethics">Ethics & IEC</option>
            <option value="CTRI">CTRI Registry</option>
            <option value="Safety">Safety & PV</option>
            <option value="Data_Quality">Data Quality</option>
            <option value="Milestone">Milestones</option>
          </select>
        </div>
      </div>

      {/* 4. Content Area: AI Action Center vs Raw Alerts */}
      {activeTab === 'ACTION_CENTER' ? (
        /* Prioritized AI Action Items Feed */
        <div className="space-y-4">
          {actions.length === 0 ? (
            <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#608c7d] mx-auto mb-2 opacity-60" />
              <h3 className="text-base font-bold text-slate-800 font-display">Zero Critical Operational Bottlenecks</h3>
              <p className="text-xs text-slate-400 mt-1">All clinical trial protocols are executing within standard operating thresholds.</p>
            </div>
          ) : (
            actions.map((act) => {
              const isCritical = act.severity === 'CRITICAL';
              const isHigh = act.severity === 'HIGH';

              return (
                <div
                  key={act.id}
                  className={`p-6 rounded-[28px] transition-all bg-white border shadow-soft-lg space-y-3.5 ${
                    isCritical
                      ? 'border-rose-200 ring-1 ring-rose-200/50'
                      : isHigh
                      ? 'border-amber-200'
                      : 'border-slate-200/80'
                  }`}
                >
                  {/* Top Row: Severity Badge + Trial + Category */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full shadow-xs ${
                          isCritical
                            ? 'bg-[#fdede8] text-[#9d442e] border border-[#f8947b] animate-pulse'
                            : isHigh
                            ? 'bg-[#fff5e6] text-[#b45309] border border-[#fcd34d]'
                            : 'bg-[#e4ede9] text-[#2b423b] border border-[#a3c5b3]'
                        }`}
                      >
                        {act.severity} PRIORITY
                      </span>
                      <span className="text-xs font-mono font-black text-slate-900 px-2.5 py-0.5 bg-[#f4f8f6] rounded-md border border-slate-200">
                        {act.trialId}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-display">
                        {act.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(act.actionLink || `/trials/${act.trialId}`)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#608c7d] hover:bg-[#4d7567] text-white text-xs font-bold rounded-full shadow-sage-glow transition-all"
                      >
                        <span>Open Protocol</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleCompleteAction(act.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-all"
                      >
                        <Check className="w-3 h-3" />
                        <span>Acknowledge</span>
                      </button>
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-display">
                      {act.problem}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{act.trialTitle}</p>
                  </div>

                  {/* Two-Column Rationale & Recommendation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Why It Matters */}
                    <div className="p-3.5 bg-[#edf2ef]/60 rounded-2xl border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">
                        Why It Matters
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {act.whyItMatters}
                      </p>
                    </div>

                    {/* Recommended Action */}
                    <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-display flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Recommended Operational Action</span>
                      </span>
                      <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                        {act.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Raw Telemetry Alert Feed */
        <div className="space-y-3.5">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#608c7d] mx-auto mb-2 opacity-60" />
              <h3 className="text-base font-bold text-slate-800 font-display">All Clear — Zero Active Alerts</h3>
              <p className="text-xs text-slate-400 mt-1">All clinical trials are operating within approved regulatory tolerances.</p>
            </div>
          ) : (
            alerts.map((a) => {
              const isResolved = a.isResolved;

              return (
                <div
                  key={a.id}
                  className={`p-5 rounded-[26px] transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border ${
                    isResolved
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : a.severity === 'High'
                      ? 'bg-white border-rose-200 shadow-soft-lg'
                      : 'bg-white border-slate-200/80 shadow-soft-lg'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 pr-2">
                    <div
                      className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                        a.severity === 'High'
                          ? 'bg-[#fdede8] text-[#9d442e]'
                          : 'bg-[#f4f8f6] text-[#608c7d]'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            a.severity === 'High'
                              ? 'bg-[#fdede8] text-[#9d442e]'
                              : 'bg-[#e4ede9] text-[#2b423b]'
                          }`}
                        >
                          {a.severity} • {a.type}
                        </span>
                        {a.trial?.trialId && (
                          <span className="text-xs font-mono font-bold text-slate-900">
                            {a.trial.trialId}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug font-display">
                        {a.message}
                      </h3>
                      {a.details && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {a.details}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isResolved && (
                    <div className="shrink-0 flex items-center justify-end">
                      <button
                        onClick={() => handleResolveAlert(a.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#608c7d] hover:bg-[#4e7c6e] text-white rounded-full font-bold text-xs font-display shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>RESOLVE</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

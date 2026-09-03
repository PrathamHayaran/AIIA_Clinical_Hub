import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { SeverityBadge } from '../components/Badges';
import { TableSkeleton } from '../components/SkeletonLoader';
import { SafetyEventModal } from '../components/SafetyEventModal';
import {
  ShieldAlert,
  AlertTriangle,
  Plus,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bot,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { AyurvedicMortar3D } from '../components/3d/AyurvedicMortar3D';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const SafetyPage = () => {
  const { isSafetyOfficer, isAdmin } = useAuth();
  const { addToast, lastUpdate } = useNotification();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [trials, setTrials] = useState([]);
  const [sites, setSites] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [safetyReport, setSafetyReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fetchSafetyData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (severityFilter !== 'ALL') params.severity = severityFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const [safetyRes, trialsRes, sitesRes] = await Promise.all([
        api.get('/safety', { params }),
        api.get('/trials?limit=100'),
        api.get('/sites'),
      ]);

      if (safetyRes.data.success) {
        setData(safetyRes.data.data);
      }
      if (trialsRes.data.success) {
        setTrials(trialsRes.data.data);
      }
      if (sitesRes.data.success) {
        setSites(sitesRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load safety events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyData();
  }, [severityFilter, statusFilter, lastUpdate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSafetyData();
  };

  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      const res = await api.put(`/safety/${eventId}`, { status: newStatus });
      if (res.data.success) {
        addToast({ title: 'Safety Event Updated', message: `Status set to ${newStatus}`, type: 'success' });
        fetchSafetyData();
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent(res.data.data);
        }
      }
    } catch (err) {
      addToast({ title: 'Update Failed', message: err.message, type: 'danger' });
    }
  };

  const handleGenerateAIReport = async () => {
    try {
      setGeneratingReport(true);
      const res = await api.get('/safety/report');
      if (res.data.success) {
        setSafetyReport(res.data.data);
        setIsReportModalOpen(true);
        addToast({
          title: 'Pharmacovigilance Report Ready',
          message: 'AI Safety Summary successfully compiled.',
          type: 'success',
        });
      }
    } catch (err) {
      addToast({ title: 'Report Generation Failed', message: err.message, type: 'danger' });
    } finally {
      setGeneratingReport(false);
    }
  };

  const metrics = data?.metrics || {};
  const events = data?.events || [];

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Pharmacovigilance & Drug Safety Hub
              </h1>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold text-white">
                PV AUDIT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
              Real-time adverse event logging, causality reviews, and automated DSMB safety reporting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateAIReport}
              disabled={generatingReport}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 rounded-full font-bold text-xs font-display hover:bg-slate-100 transition-all shadow-sm"
            >
              {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4 text-[#608c7d]" />}
              <span>AI SAFETY SUMMARY</span>
            </button>

            {(isAdmin || isSafetyOfficer) && (
              <button
                onClick={() => setIsLogModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f4a28c] hover:bg-[#e26b4e] text-white rounded-full font-bold text-xs font-display shadow-peach-glow transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>LOG ADVERSE EVENT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. 4 Summary Stat Metric Cards + 3D Ayurvedic Alchemy Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-sans items-stretch">
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Total Incidents</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">{metrics.totalEvents || 0}</p>
            <span className="text-[10px] text-slate-500 font-medium mt-1">Across 25 Protocols</span>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Serious (SAEs)</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1 font-display">{metrics.seriousEvents || 0}</p>
            <span className="text-[10px] text-rose-600 font-bold mt-1">&lt;14d Expedited PV</span>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Under Review</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#f4a28c] mt-1 font-display">{metrics.underInvestigation || 0}</p>
            <span className="text-[10px] text-slate-500 font-medium mt-1">Causality Audits</span>
          </div>

          <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Resolved Rate</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#608c7d] mt-1 font-display">{metrics.resolved || 0}</p>
            <span className="text-[10px] text-[#608c7d] font-bold mt-1">78% Cleared</span>
          </div>
        </div>

        {/* 3D Extraction & Alchemy Monitor Card */}
        <div className="lg:col-span-4 bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-display">3D Toxicology Monitor</span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Live Extraction</span>
          </div>
          <div className="w-full h-24 flex items-center justify-center">
            <AyurvedicMortar3D className="w-full h-24" glowColor="#f4a28c" baseColor="#608c7d" />
          </div>
          <p className="text-[10px] text-slate-500 text-center font-medium">
            Active Batch Phytochemical & Hepato-Renal Safety Stream
          </p>
        </div>
      </div>

      {/* 3. Filter and Search Bar */}
      <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Event ID (SAE-001), Adverse Event description, or Patient ID..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#f4f8f6] rounded-full border border-slate-200/60 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#f4f8f6] rounded-full border border-slate-200/60 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Severities</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Serious">Serious (SAE)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#f4f8f6] rounded-full border border-slate-200/60 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Under_Review">Under Review</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#608c7d] hover:bg-[#4e7c6e] text-white rounded-full font-bold text-xs font-display transition-all shadow-sage-glow"
            >
              FILTER
            </button>
          </div>
        </form>
      </div>

      {/* 4. Main Table in Organic Card */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={7} />
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#608c7d] mx-auto mb-2 opacity-60" />
            <h3 className="text-base font-bold text-slate-800 font-display">No Adverse Events Found</h3>
            <p className="text-xs text-slate-400 mt-1">Zero safety incidents match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-[#608c7d] text-white font-display font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-4 px-5">Case ID</th>
                  <th className="py-4 px-5">Trial</th>
                  <th className="py-4 px-5 min-w-[200px]">Reported Event & Symptoms</th>
                  <th className="py-4 px-5">Severity</th>
                  <th className="py-4 px-5">Causality</th>
                  <th className="py-4 px-5">Reporting Site</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelectedEvent(e)}
                    className="hover:bg-[#f4f8f6] transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-5 font-mono font-bold text-slate-900">
                      <span className="px-2.5 py-1 bg-[#e4ede9] text-[#2b423b] rounded-lg text-xs">
                        {e.eventId}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono font-semibold text-slate-700">
                      {e.trial?.trialId}
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900 font-display">{e.eventName}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{e.description}</p>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <SeverityBadge severity={e.severity} />
                    </td>
                    <td className="py-4 px-5 text-slate-700 whitespace-nowrap font-medium">
                      {e.causality}
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-medium whitespace-nowrap">
                      {e.site?.name || 'AIIA New Delhi'}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="px-3 py-1 bg-[#f4f8f6] text-slate-700 rounded-full font-semibold text-[11px]">
                        {e.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setSelectedEvent(e);
                        }}
                        className="px-3.5 py-1.5 bg-[#608c7d] hover:bg-[#4e7c6e] text-white rounded-full font-bold text-xs font-display shadow-xs transition-colors"
                      >
                        REVIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Safety Event Modal */}
      <SafetyEventModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onEventCreated={() => fetchSafetyData()}
        trials={trials}
        sites={sites}
      />

      {/* Event Details Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end animate-in fade-in">
          <div className="w-full max-w-lg bg-white h-full p-6 overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono font-bold text-lg text-slate-900">{selectedEvent.eventId}</span>
                <p className="text-xs text-slate-400 font-medium">Pharmacovigilance Dossier Review</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-800">
              <div className="p-4 bg-[#f4f8f6] rounded-2xl">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Event Title</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5 font-display">{selectedEvent.eventName}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f4f8f6] rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Patient ID</span>
                  <p className="font-bold text-slate-900 font-mono mt-0.5">{selectedEvent.syntheticPatientId || 'N/A'}</p>
                </div>
                <div className="p-3 bg-[#f4f8f6] rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Onset Date</span>
                  <p className="font-bold text-slate-900 font-mono mt-0.5">{new Date(selectedEvent.onsetDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="font-bold text-xs uppercase block text-slate-500 font-display">Update Investigation Status:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Under_Review', 'Investigating', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedEvent.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedEvent.status === st
                          ? 'bg-[#608c7d] text-white shadow-sm'
                          : 'bg-[#f4f8f6] text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Safety Report Modal */}
      {isReportModalOpen && safetyReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 font-display">{safetyReport.title}</h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-[#f4f8f6] rounded-2xl p-4">
              {safetyReport.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

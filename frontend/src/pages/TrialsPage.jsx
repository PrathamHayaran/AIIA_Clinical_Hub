import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { RiskBadge, StatusBadge, PhaseBadge } from '../components/Badges';
import { TableSkeleton } from '../components/SkeletonLoader';
import { TrialModal } from '../components/TrialModal';
import {
  FlaskConical,
  Search,
  Plus,
  Eye,
  Bot,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AyurvedicHerbFlask3D } from '../components/3d/AyurvedicHerbFlask3D';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const TrialsPage = () => {
  const navigate = useNavigate();
  const { isResearcher, isAdmin } = useAuth();
  const { lastUpdate } = useNotification();

  const [loading, setLoading] = useState(true);
  const [trials, setTrials] = useState([]);
  const [sites, setSites] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 25, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrials = async () => {
    try {
      setLoading(true);
      const params = {
        page: meta.page,
        limit: meta.limit,
      };
      if (search.trim()) params.search = search.trim();
      if (phaseFilter !== 'ALL') params.phase = phaseFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (riskFilter !== 'ALL') params.riskCategory = riskFilter;

      const [trialsRes, sitesRes] = await Promise.all([
        api.get('/trials', { params }),
        api.get('/sites'),
      ]);

      if (trialsRes.data.success) {
        setTrials(trialsRes.data.data);
        setMeta(trialsRes.data.meta);
      }
      if (sitesRes.data.success) {
        setSites(sitesRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load trials catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, [meta.page, phaseFilter, statusFilter, riskFilter, lastUpdate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setMeta((prev) => ({ ...prev, page: 1 }));
    fetchTrials();
  };

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* 1. Top Curved Sage Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* 3D Active Decoction Flask */}
            <div className="hidden md:flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shrink-0">
              <AyurvedicHerbFlask3D className="w-14 h-14" liquidColor="#608c7d" bubbleColor="#f4a28c" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                  Clinical Trials Portfolio
                </h1>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold text-white">
                  {meta.total} PROTOCOLS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                Multi-center Ayurvedic research registry spanning Phase I safety to Phase IV observational cohorts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(isAdmin || isResearcher) && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f4a28c] hover:bg-[#e26b4e] text-white rounded-full font-bold text-xs font-display shadow-peach-glow transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>REGISTER PROTOCOL</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Floating Filter & Search Bar */}
      <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Trial ID (AYU-001), Title, Formulation, or PI..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#f4f8f6] rounded-full border border-slate-200/60 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#608c7d]/30 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={phaseFilter}
              onChange={(e) => {
                setPhaseFilter(e.target.value);
                setMeta((p) => ({ ...p, page: 1 }));
              }}
              className="px-4 py-2.5 bg-[#f4f8f6] rounded-full border border-slate-200/60 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Phases</option>
              <option value="Phase I">Phase I</option>
              <option value="Phase II">Phase II</option>
              <option value="Phase III">Phase III</option>
              <option value="Phase IV">Phase IV</option>
              <option value="Observational">Observational</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setMeta((p) => ({ ...p, page: 1 }));
              }}
              className="px-4 py-2.5 bg-[#f4f8f6] rounded-full border border-slate-200/60 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Recruiting">Recruiting</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setMeta((p) => ({ ...p, page: 1 }));
              }}
              className="px-4 py-2.5 bg-[#f4f8f6] rounded-full border border-slate-200/60 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
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

      {/* 3. Main Data Table in Organic Card */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={7} />
          </div>
        ) : trials.length === 0 ? (
          <div className="p-12 text-center">
            <FlaskConical className="w-10 h-10 text-[#608c7d] mx-auto mb-2 opacity-60" />
            <h3 className="text-base font-bold text-slate-800 font-display">No Clinical Protocols Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try modifying your filter parameters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-[#608c7d] text-white font-display font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-4 px-5">Trial Code</th>
                  <th className="py-4 px-5 min-w-[220px]">Protocol Title & Formulation</th>
                  <th className="py-4 px-5">Phase</th>
                  <th className="py-4 px-5">Lead Investigator</th>
                  <th className="py-4 px-5">Enrollment Pacing</th>
                  <th className="py-4 px-5">Risk Level</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trials.map((t) => {
                  const enrollmentPct =
                    t.targetParticipants > 0
                      ? Math.min(100, Math.round((t.currentEnrolled / t.targetParticipants) * 100))
                      : 0;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => navigate(`/trials/${t.trialId}`)}
                      className="hover:bg-[#f4f8f6] transition-colors cursor-pointer"
                    >
                      {/* Trial ID */}
                      <td className="py-4 px-5 font-mono font-bold text-slate-900">
                        <span className="px-2.5 py-1 bg-[#e4ede9] text-[#2b423b] rounded-lg text-xs">
                          {t.trialId}
                        </span>
                      </td>

                      {/* Title & Treatment */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900 line-clamp-1 font-display">
                          {t.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                          <strong className="text-slate-700">Rx:</strong> {t.treatment}
                        </p>
                      </td>

                      {/* Phase */}
                      <td className="py-4 px-5">
                        <PhaseBadge phase={t.phase} />
                      </td>

                      {/* PI */}
                      <td className="py-4 px-5 text-slate-800 font-semibold whitespace-nowrap">
                        {t.principalInvestigator}
                      </td>

                      {/* Participants Progress Bar */}
                      <td className="py-4 px-5 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1 text-slate-700">
                          <span>{t.currentEnrolled} / {t.targetParticipants}</span>
                          <span className="text-[#608c7d]">{enrollmentPct}%</span>
                        </div>
                        <div className="w-full bg-[#f4f8f6] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#608c7d] to-[#f4a28c] h-full rounded-full transition-all"
                            style={{ width: `${enrollmentPct}%` }}
                          />
                        </div>
                      </td>

                      {/* Risk */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <RiskBadge category={t.riskCategory} score={t.riskScore} />
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <StatusBadge status={t.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/trials/${t.trialId}`)}
                            title="View Trial"
                            className="p-2 bg-[#f4f8f6] hover:bg-[#608c7d] hover:text-white rounded-xl text-slate-600 transition-colors shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/ai-copilot?trial=${t.trialId}`)}
                            title="AI Diagnosis"
                            className="p-2 bg-[#fdede8] hover:bg-[#f4a28c] hover:text-white rounded-xl text-[#f4a28c] transition-colors shadow-xs"
                          >
                            <Bot className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Trial Modal */}
      <TrialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTrialCreated={() => fetchTrials()}
        sites={sites}
      />
    </div>
  );
};

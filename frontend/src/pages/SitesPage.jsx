import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import { AddSiteModal } from '../components/AddSiteModal';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Plus,
  Search,
  BedDouble,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Filter,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const SitesPage = () => {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [sortBy, setSortBy] = useState('performance'); // 'performance', 'capacity', 'trials', 'name'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sites');
      if (res.data.success) {
        setSites(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load sites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleSiteAdded = (newSite) => {
    setSites((prev) => [newSite, ...prev]);
    showToast(`"${newSite.name}" successfully registered into the research network!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteSite = async (site) => {
    if (!window.confirm(`Are you sure you want to remove '${site.name}' (${site.siteCode})?`)) {
      return;
    }

    try {
      setDeletingId(site.id);
      const res = await api.delete(`/sites/${site.id}`);
      if (res.data.success) {
        setSites((prev) => prev.filter((s) => s.id !== site.id));
        showToast(`Center '${site.name}' removed.`);
      }
    } catch (err) {
      console.error('Failed to delete site:', err);
      alert(err.response?.data?.message || 'Could not delete site. It may be linked to active trials.');
    } finally {
      setDeletingId(null);
    }
  };

  // Extract unique states for dropdown filter
  const uniqueStates = useMemo(() => {
    const states = sites.map((s) => s.state).filter(Boolean);
    return Array.from(new Set(states)).sort();
  }, [sites]);

  // Aggregate stats
  const totalBeds = useMemo(() => sites.reduce((sum, s) => sum + (s.capacity || 0), 0), [sites]);
  const totalActiveTrials = useMemo(() => sites.reduce((sum, s) => sum + (s.activeTrialsCount || 0), 0), [sites]);
  const avgCompliance = useMemo(() => {
    if (sites.length === 0) return 0;
    const sum = sites.reduce((s, item) => s + (item.complianceRate || 90), 0);
    return Math.round(sum / sites.length);
  }, [sites]);

  // Filtered & sorted sites
  const filteredSites = useMemo(() => {
    let result = [...sites];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q) ||
          s.state?.toLowerCase().includes(q) ||
          s.siteCode?.toLowerCase().includes(q) ||
          s.principalInvestigator?.toLowerCase().includes(q)
      );
    }

    if (selectedState !== 'ALL') {
      result = result.filter((s) => s.state === selectedState);
    }

    result.sort((a, b) => {
      if (sortBy === 'performance') return (b.performanceScore || 0) - (a.performanceScore || 0);
      if (sortBy === 'capacity') return (b.capacity || 0) - (a.capacity || 0);
      if (sortBy === 'trials') return (b.activeTrialsCount || 0) - (a.activeTrialsCount || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

    return result;
  }, [sites, searchTerm, selectedState, sortBy]);

  if (loading && sites.length === 0) {
    return (
      <div className="space-y-6 bg-[#edf2ef] p-6">
        <div className="h-8 bg-slate-200 rounded-full w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 bg-white rounded-[28px] shadow-soft-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-[#608c7d] text-white rounded-2xl shadow-soft-xl border border-white/20 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Ayurvedic Research Centers
              </h1>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold text-white">
                {sites.length} INSTITUTES
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
              Operational capacity, recruitment velocity, and active clinical trial mapping across India.
            </p>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold font-display bg-[#f4a28c] hover:bg-[#e26b4e] text-white shadow-peach-glow transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Register Research Center</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15 relative z-10">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block font-display">
              Total Centers
            </span>
            <span className="text-xl font-black text-white font-display">{sites.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block font-display flex items-center gap-1">
              <BedDouble className="w-3 h-3" /> Inpatient Beds
            </span>
            <span className="text-xl font-black text-white font-display">{totalBeds.toLocaleString()}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block font-display flex items-center gap-1">
              <Activity className="w-3 h-3" /> Active Protocol Mappings
            </span>
            <span className="text-xl font-black text-white font-display">{totalActiveTrials}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block font-display flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Avg GCP Compliance
            </span>
            <span className="text-xl font-black text-white font-display">{avgCompliance}%</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Toolbar */}
      <div className="bg-white rounded-[24px] border border-slate-200/80 p-4 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by institute, city, code, PI..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#f4f8f6] border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-[#608c7d] transition-all"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* State Filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All States / UTs ({sites.length})</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <span className="text-[11px] text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-[#f4f8f6] border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="performance">Highest Performance</option>
              <option value="capacity">Bed Capacity</option>
              <option value="trials">Active Trials</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchSites}
            title="Refresh Centers"
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#f4f8f6] transition-colors shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Empty State */}
      {filteredSites.length === 0 && (
        <div className="bg-white rounded-[28px] border border-dashed border-slate-300 p-12 text-center">
          <div className="w-14 h-14 bg-[#f4f8f6] text-[#608c7d] rounded-full flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">No research centers matched</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or register this research center manually.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold font-display bg-[#608c7d] text-white hover:bg-[#456c5f] transition-all"
          >
            <Plus className="w-4 h-4" /> Register New Center
          </button>
        </div>
      )}

      {/* 4. Grid of Site Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-lg hover:shadow-soft-xl p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-0.5"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-[#f4f8f6] group-hover:bg-[#608c7d] group-hover:text-white rounded-2xl text-[#608c7d] transition-colors shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-display block">Performance</span>
                  <span className="text-xl font-extrabold text-slate-900 font-display">{site.performanceScore || 85}%</span>
                </div>
              </div>

              {/* Site Name & City */}
              <h3 className="text-sm font-bold text-slate-900 line-clamp-2 font-display">
                {site.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#f4a28c] shrink-0" />
                <span>{site.city}, {site.state} <span className="font-mono font-bold text-slate-700">({site.siteCode})</span></span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                <p>
                  <strong className="text-slate-600">PI:</strong> <span className="font-semibold text-slate-800">{site.principalInvestigator}</span>
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Capacity: <strong className="text-slate-800">{site.capacity} beds</strong></span>
                  <span>Active Trials: <strong className="text-[#608c7d] font-bold">{site.activeTrialsCount || 0}</strong></span>
                </div>
              </div>

              {/* 3 Progress Bars */}
              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1 text-slate-600 font-bold">
                    <span>Recruitment Rate</span>
                    <span className="text-[#608c7d]">{site.recruitmentRate || 80}%</span>
                  </div>
                  <div className="w-full bg-[#f4f8f6] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#608c7d] h-full rounded-full"
                      style={{ width: `${site.recruitmentRate || 80}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1 text-slate-600 font-bold">
                    <span>Data Quality</span>
                    <span className="text-sky-600">{site.dataQualityRate || 90}%</span>
                  </div>
                  <div className="w-full bg-[#f4f8f6] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full"
                      style={{ width: `${site.dataQualityRate || 90}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1 text-slate-600 font-bold">
                    <span>GCP Compliance</span>
                    <span className="text-[#f4a28c]">{site.complianceRate || 95}%</span>
                  </div>
                  <div className="w-full bg-[#f4f8f6] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#f4a28c] h-full rounded-full"
                      style={{ width: `${site.complianceRate || 95}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Contact Info & Delete Button */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <div className="truncate max-w-[140px] flex items-center gap-1">
                <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                <span className="truncate">{site.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">{site.contactPhone}</span>
                {(!site.activeTrialsCount || site.activeTrialsCount === 0) && (
                  <button
                    onClick={() => handleDeleteSite(site)}
                    disabled={deletingId === site.id}
                    title="Remove center"
                    className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSiteAdded={handleSiteAdded}
      />
    </div>
  );
};


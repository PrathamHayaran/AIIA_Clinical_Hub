import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { HerbalLeaf3D } from '../components/3d/HerbalLeaf3D';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const SitesPage = () => {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);

  useEffect(() => {
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

    fetchSites();
  }, []);

  if (loading) {
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
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Ayurvedic Research Centers
          </h1>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold text-white">
            {sites.length} INSTITUTES
          </span>
        </div>
        <p className="text-xs sm:text-sm text-white/80 font-medium mt-1 relative z-10">
          Operational capacity, recruitment velocity, and active clinical trial mapping across India.
        </p>
      </div>

      {/* 2. Grid of Site Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-lg hover:shadow-soft-xl p-6 flex flex-col justify-between transition-all duration-300 group"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-[#f4f8f6] group-hover:bg-[#608c7d] group-hover:text-white rounded-2xl text-[#608c7d] transition-colors shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-display block">Performance</span>
                  <span className="text-xl font-extrabold text-slate-900 font-display">{site.performanceScore}%</span>
                </div>
              </div>

              {/* Site Name & City */}
              <h3 className="text-sm font-bold text-slate-900 line-clamp-2 font-display">
                {site.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#f4a28c] shrink-0" />
                <span>{site.city}, {site.state} ({site.siteCode})</span>
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
                    <span className="text-[#608c7d]">{site.recruitmentRate}%</span>
                  </div>
                  <div className="w-full bg-[#f4f8f6] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#608c7d] h-full rounded-full"
                      style={{ width: `${site.recruitmentRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1 text-slate-600 font-bold">
                    <span>Data Quality</span>
                    <span className="text-sky-600">{site.dataQualityRate}%</span>
                  </div>
                  <div className="w-full bg-[#f4f8f6] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full"
                      style={{ width: `${site.dataQualityRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1 text-slate-600 font-bold">
                    <span>GCP Compliance</span>
                    <span className="text-[#f4a28c]">{site.complianceRate}%</span>
                  </div>
                  <div className="w-full bg-[#f4f8f6] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#f4a28c] h-full rounded-full"
                      style={{ width: `${site.complianceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Contact Info */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="truncate max-w-[140px]">{site.contactEmail}</span>
              <span className="font-semibold text-slate-700">{site.contactPhone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

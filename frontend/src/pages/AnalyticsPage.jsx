import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';
import { AyurvedicChakraPulse3D } from '../components/3d/AyurvedicChakraPulse3D';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30 Days');
  const [data, setData] = useState(null);

  const timeRanges = ['7 Days', '30 Days', '3 Months', '6 Months', '1 Year', 'All Time'];

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/analytics/cross-trial?timeRange=${timeRange}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading && !data) {
    return (
      <div className="space-y-6 bg-[#edf2ef] p-6">
        <div className="h-8 bg-slate-200 rounded-full w-1/3 animate-pulse" />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const riskBrackets = data?.riskBrackets || [];
  const phaseDistribution = data?.phaseDistribution || [];
  const siteMatrix = data?.siteMatrix || [];
  const safetyTrends = data?.safetyTrends || [];

  const RISK_COLORS = {
    Low: '#608c7d',
    Medium: '#fcd34d',
    High: '#f4a28c',
    Critical: '#e11d48',
  };

  const PHASE_COLORS = ['#608c7d', '#f4a28c', '#70a1ff', '#a29bfe', '#ffa502'];

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* 1. Header & Date Range Filter Bar */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shrink-0">
              <AyurvedicChakraPulse3D className="w-14 h-14" primaryColor="#ffffff" accentColor="#f4a28c" interactive={false} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Cross-Trial Analytics & Telemetry
              </h1>
              <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                Predictive modeling, multi-center safety matrix, and institutional performance curves.
              </p>
            </div>
          </div>

          {/* Date Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-white/15 backdrop-blur-md p-1.5 rounded-full border border-white/20">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3.5 py-1.5 text-xs font-bold font-display rounded-full transition-all ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Grid: Multi-Site Matrix Comparison + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-Site Performance Matrix Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
              Multi-Center Institutional Operational Index
            </h2>
            <p className="text-xs text-slate-500">
              Comparative matrix: Recruitment Rate vs Data Quality vs GCP Compliance.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={siteMatrix} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="city" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="recruitment" name="Recruitment %" fill="#608c7d" radius={[8, 8, 0, 0]} />
                <Bar dataKey="dataQuality" name="Data Quality %" fill="#70a1ff" radius={[8, 8, 0, 0]} />
                <Bar dataKey="compliance" name="Compliance %" fill="#f4a28c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Risk Distribution Donut */}
        <div className="lg:col-span-4 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
              Trial Risk Distribution
            </h2>
            <p className="text-xs text-slate-500">Protocols categorized by composite AI risk score.</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskBrackets}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {riskBrackets.map((entry) => (
                    <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            {riskBrackets.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-xs p-2.5 bg-[#f4f8f6] rounded-xl">
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[r.name] }} />
                  {r.name}
                </span>
                <span className="font-bold text-slate-900 font-mono">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Grid: Safety Event Trend Curve + Phase Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Incident Curve */}
        <div className="lg:col-span-8 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
              Safety Incident Velocity by Severity Class
            </h2>
            <p className="text-xs text-slate-500">Weekly monitoring of Mild, Moderate, and Serious (SAE) cases.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safetyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="mild" name="Mild Events" stroke="#608c7d" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="moderate" name="Moderate Events" stroke="#ffa502" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="serious" name="Serious SAEs" stroke="#e11d48" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Phase Distribution */}
        <div className="lg:col-span-4 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
              Clinical Trial Phase Mix
            </h2>
            <p className="text-xs text-slate-500">Research pipeline composition.</p>
          </div>

          <div className="space-y-2">
            {phaseDistribution.map((p, idx) => (
              <div key={p.name} className="p-3 bg-[#f4f8f6] rounded-2xl flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-800 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASE_COLORS[idx % PHASE_COLORS.length] }} />
                  {p.name}
                </span>
                <span className="font-bold text-slate-900 font-mono">{p.count} protocols</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

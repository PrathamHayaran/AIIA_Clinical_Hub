import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { intelligenceApi } from '../services/intelligenceApi';
import { TableSkeleton, CardSkeleton } from '../components/SkeletonLoader';
import { WhyExplainModal } from '../components/WhyExplainModal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  Line,
} from 'recharts';
import {
  Users,
  Building2,
  TrendingUp,
  Award,
  Sparkles,
  Calendar,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { AyurvedicTridosha3D } from '../components/3d/AyurvedicTridosha3D';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const RecruitmentPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecruitmentAndForecast = async () => {
      try {
        setLoading(true);
        const [recRes, predRes] = await Promise.all([
          api.get('/recruitment'),
          intelligenceApi.getTrialPrediction('AYU-002').catch(() => ({ prediction: null })),
        ]);
        if (recRes.data.success) {
          setData(recRes.data.data);
        }
        if (predRes.prediction) {
          setForecastData(predRes.prediction);
        }
      } catch (err) {
        console.error('Failed to load recruitment data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitmentAndForecast();
  }, []);

  if (loading && !data) {
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

  const summary = data?.summary || {};
  const siteComparison = data?.siteComparison || [];
  const demographics = data?.demographics || {};
  const doshaData = demographics.dosha || [];

  const DOSHA_COLORS = ['#608c7d', '#f4a28c', '#70a1ff', '#ffa502', '#a29bfe', '#f8a5c2', '#4e7c6e'];

  // Synthetic portfolio recruitment trajectory data points
  const trajectoryPoints = forecastData?.trajectory || [
    { month: 'Jan', target: 350, actual: 360, forecast: 360 },
    { month: 'Feb', target: 700, actual: 720, forecast: 720 },
    { month: 'Mar', target: 1050, actual: 1040, forecast: 1040 },
    { month: 'Apr', target: 1400, actual: 1380, forecast: 1380 },
    { month: 'May', target: 1750, actual: 1710, forecast: 1710 },
    { month: 'Jun', target: 2100, actual: 2020, forecast: 2020 },
    { month: 'Jul', target: 2450, actual: 2310, forecast: 2310 },
    { month: 'Aug', target: 2800, actual: 2650, forecast: 2650 },
    { month: 'Sep', target: 3150, actual: 2980, forecast: 2980 },
    { month: 'Oct', target: 3500, actual: 3340, forecast: 3340 },
    { month: 'Nov', target: 3850, actual: 3740, forecast: 3740 },
    { month: 'Dec', target: 4200, actual: null, forecast: 4050 },
    { month: 'Jan 26', target: 4350, actual: null, forecast: 4350 },
  ];

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[32px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Patient Recruitment & Cohort Intelligence
          </h1>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold text-white">
            AI FORECASTING
          </span>
        </div>
        <p className="text-xs sm:text-sm text-white/80 font-medium mt-1 relative z-10">
          Multi-center recruitment velocity, AI operational completion trajectories, and Ayurvedic Dosha Prakriti phenotyping.
        </p>
      </div>

      {/* 2. 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
        <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Target Quota</span>
          <p className="text-2xl font-black text-slate-900 mt-1 font-display">{summary.targetParticipants?.toLocaleString() || 4350}</p>
          <span className="text-xs text-slate-500 font-medium">Patients Across 25 Trials</span>
        </div>

        <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Active Enrolled</span>
          <p className="text-2xl font-black text-[#608c7d] mt-1 font-display">{summary.totalEnrolled?.toLocaleString() || 3740}</p>
          <span className="text-xs font-bold text-[#608c7d]">{summary.overallRecruitmentRate || 86}% of Goal</span>
        </div>

        <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Recruitment Velocity</span>
          <p className="text-2xl font-black text-slate-900 mt-1 font-display">
            {forecastData?.currentVelocity || '8.4'} <span className="text-xs font-normal text-slate-500">pts/wk</span>
          </p>
          <span className="text-xs text-slate-500 font-medium">Target: {forecastData?.targetVelocity || '7.2'} pts/wk</span>
        </div>

        <div className="bg-white rounded-[26px] border border-slate-200/80 shadow-soft-lg p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-display">Drop-Out Rate</span>
          <p className="text-2xl font-black text-[#f4a28c] mt-1 font-display">{summary.dropOutRate || '2.4%'}</p>
          <span className="text-xs text-slate-500 font-medium">High Retention Index</span>
        </div>
      </div>

      {/* 3. AI Recruitment Pacing & Trajectory Forecast Card */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 space-y-4">
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
                AI Predictive Recruitment Trajectory & Pacing Curve
              </h2>
              <button
                onClick={() => setIsWhyModalOpen(true)}
                className="text-[10px] font-bold font-mono px-2 py-0.5 bg-[#edf2ef] hover:bg-[#608c7d] text-slate-700 hover:text-white rounded-full transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Why?</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Empirical historical enrollment trajectory vs. AI forecasted completion curve.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-0.5 bg-slate-300 rounded-full" /> Target Quota
            </span>
            <span className="flex items-center gap-1.5 text-[#608c7d]">
              <span className="w-3 h-1.5 bg-[#608c7d] rounded-full" /> Actual Enrolled
            </span>
            <span className="flex items-center gap-1.5 text-[#f4a28c]">
              <span className="w-3 h-1 bg-[#f4a28c] rounded-full border border-dashed border-[#f4a28c]" /> AI Forecast
            </span>
          </div>
        </div>

        {/* Trajectory Area Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryPoints} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f1" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} fill="#f1f5f9" fillOpacity={0.4} name="Target Quota" />
              <Area type="monotone" dataKey="actual" stroke="#608c7d" strokeWidth={2.5} fill="#608c7d" fillOpacity={0.15} name="Actual Enrolled" />
              <Line type="monotone" dataKey="forecast" stroke="#f4a28c" strokeWidth={2} strokeDasharray="5 5" name="AI Projected" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[10px] text-slate-400 font-medium text-center pt-1 border-t border-slate-100">
          AI-generated operational forecast. Trajectory calculated from empirical synthetic enrollment velocity across all 8 research centers.
        </p>
      </div>

      {/* 4. Multi-Center Comparison & Ayurvedic Dosha Phenotyping */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        {/* Research Centers Velocity */}
        <div className="lg:col-span-8 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 overflow-hidden">
          <div className="pb-4 border-b border-slate-100 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
                Multi-Center Patient Intake Velocity
              </h2>
              <p className="text-xs text-slate-500">Comparative capacity utilization across participating institutes.</p>
            </div>
            <span className="px-3 py-1 bg-[#f4f8f6] rounded-full text-xs font-bold text-slate-700">
              8 Active Sites
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#608c7d] text-white font-display font-bold uppercase text-[10px] tracking-wider rounded-t-2xl">
                  <th className="py-3.5 px-4">Research Institute</th>
                  <th className="py-3.5 px-4">Enrolled</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Rate</th>
                  <th className="py-3.5 px-4 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteComparison.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f4f8f6] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <p className="text-xs text-slate-900 font-display">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.city}, {s.state}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {s.enrolled} / {s.target}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {s.capacity} beds
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#608c7d]">
                      {s.recruitmentRate}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="w-24 ml-auto bg-[#f4f8f6] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#608c7d] h-full rounded-full"
                          style={{ width: `${Math.min(100, s.progress)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dosha Demographics with 3D Tridosha Matrix */}
        <div className="lg:col-span-4 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-6 flex flex-col justify-between space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
                Dosha Prakriti Matrix
              </h2>
              <p className="text-xs text-slate-500">Ayurvedic constitutional phenotyping.</p>
            </div>
            <span className="text-[10px] font-bold text-[#608c7d] bg-[#f4f8f6] px-2 py-0.5 rounded-full">3D Orbit</span>
          </div>

          {/* 3D Interactive Tridosha Balance Orbit */}
          <div className="w-full h-36 flex items-center justify-center bg-[#f4f8f6] rounded-2xl p-2 border border-slate-200/60">
            <AyurvedicTridosha3D className="w-full h-36" interactive={true} />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {doshaData.map((d, idx) => (
              <div key={d.name} className="flex items-center justify-between p-2 bg-[#f4f8f6] rounded-xl">
                <span className="flex items-center gap-2 text-slate-800 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DOSHA_COLORS[idx % DOSHA_COLORS.length] }} />
                  {d.name}
                </span>
                <span className="font-bold text-slate-900 font-mono">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* "Why?" Root Cause Modal */}
      <WhyExplainModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        trialId="AYU-002"
        metric="recruitment"
      />
    </div>
  );
};

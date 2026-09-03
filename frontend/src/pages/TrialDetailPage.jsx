import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { RiskBadge, StatusBadge, SeverityBadge, PhaseBadge, HealthBadge } from '../components/Badges';
import { Timeline } from '../components/Timeline';
import { WhyExplainModal } from '../components/WhyExplainModal';
import { ScenarioSimulatorModal } from '../components/ScenarioSimulatorModal';
import {
  FlaskConical,
  Calendar,
  User,
  Building2,
  ShieldAlert,
  Bot,
  ArrowLeft,
  CheckCircle2,
  Check,
  AlertTriangle,
  FileCheck2,
  Activity,
  Sparkles,
  Loader2,
  ExternalLink,
  CornerDownRight,
  Filter,
  Sliders,
  HelpCircle,
  TrendingDown,
  Download,
  FileText,
} from 'lucide-react';
import { HerbalLeaf3D } from '../components/3d/HerbalLeaf3D';
import { AyurvedicTridosha3D } from '../components/3d/AyurvedicTridosha3D';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const TrialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isResearcher, isAdmin } = useAuth();
  const { addToast, lastUpdate } = useNotification();

  const [loading, setLoading] = useState(true);
  const [trial, setTrial] = useState(null);
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [milestoneFilter, setMilestoneFilter] = useState('ALL');

  // Intelligence Modals State
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [whyMetric, setWhyMetric] = useState('overall');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  const openWhyModal = (metric) => {
    setWhyMetric(metric);
    setIsWhyModalOpen(true);
  };

  const fetchTrialDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trials/${id}`);
      if (res.data.success) {
        setTrial(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load trial details:', err);
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialDetails();
  }, [id, lastUpdate]);

  const handleRunAiDiagnosis = async () => {
    try {
      setDiagnosing(true);
      const res = await api.get(`/ai/risk/${trial.trialId}`);
      if (res.data.success) {
        setAiDiagnosis(res.data.data);
        addToast({
          title: 'AI Diagnostic Generated',
          message: `Deep analysis completed for ${trial.trialId}.`,
          type: 'success',
        });
      }
    } catch (err) {
      addToast({ title: 'Diagnosis Failed', message: err.message, type: 'danger' });
    } finally {
      setDiagnosing(false);
    }
  };

  const handleUpdateMilestone = async (milestoneId, currentStatus) => {
    if (!isAdmin && !isResearcher) return;

    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const res = await api.put(`/trials/milestones/${milestoneId}`, { status: nextStatus });
      if (res.data.success) {
        addToast({ title: 'Milestone Updated', message: `Marked as ${nextStatus}`, type: 'success' });
        fetchTrialDetails();
      }
    } catch (err) {
      addToast({ title: 'Error', message: err.message, type: 'danger' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 bg-[#edf2ef] p-6 font-sans">
        <div className="h-8 bg-slate-200 rounded-full w-1/3 animate-pulse" />
        <div className="h-64 bg-white rounded-[28px] shadow-soft-lg animate-pulse" />
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="bg-white rounded-[28px] shadow-soft-xl p-12 text-center font-sans border border-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900 font-display">Trial Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested clinical trial protocol could not be located.</p>
        <button
          onClick={() => navigate('/trials')}
          className="mt-5 px-6 py-2.5 bg-[#608c7d] text-white rounded-full font-bold text-xs shadow-sage-glow"
        >
          RETURN TO TRIALS CATALOG
        </button>
      </div>
    );
  }

  const enrollmentPct =
    trial.targetParticipants > 0
      ? Math.min(100, Math.round((trial.currentEnrolled / trial.targetParticipants) * 100))
      : 0;

  const liveRisk = trial.liveRiskAnalysis || { score: trial.riskScore, category: trial.riskCategory, breakdown: [] };

  const milestonesList = trial.milestones || [];
  const completedMilestones = milestonesList.filter((m) => m.status === 'COMPLETED').length;
  const milestoneProgressPct = milestonesList.length > 0 ? Math.round((completedMilestones / milestonesList.length) * 100) : 0;

  const filteredMilestones = milestonesList.filter((m) => {
    if (milestoneFilter === 'COMPLETED') return m.status === 'COMPLETED';
    if (milestoneFilter === 'PENDING') return m.status !== 'COMPLETED';
    if (milestoneFilter === 'DELAYED') return m.status === 'DELAYED';
    return true;
  });

  const handleExportFHIR = async () => {
    try {
      const res = await api.get(`/trials/${id}/export/fhir`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FHIR-ResearchStudy-${trial.trialId || id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast({ title: 'FHIR Export Downloaded', message: `HL7 FHIR ResearchStudy Bundle generated for ${trial.trialId}`, type: 'success' });
    } catch (err) {
      addToast({ title: 'Export Error', message: err.message, type: 'danger' });
    }
  };

  const handleExportCDISC = async () => {
    try {
      const res = await api.get(`/trials/${id}/export/cdisc`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CDISC-SDTM-${trial.trialId || id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast({ title: 'CDISC Export Downloaded', message: `CDISC SDTM (DM, AE, DS, SV) Dataset generated for ${trial.trialId}`, type: 'success' });
    } catch (err) {
      addToast({ title: 'Export Error', message: err.message, type: 'danger' });
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans bg-[#edf2ef]">
      {/* Top Navigation & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate('/trials')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#608c7d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO CATALOG</span>
        </button>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* FHIR Export Button */}
          <button
            onClick={handleExportFHIR}
            title="Export HL7 FHIR ResearchStudy JSON Bundle"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-[#f4f8f6] text-slate-700 border border-slate-200/80 rounded-full font-bold text-xs font-display shadow-xs transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 text-[#608c7d]" />
            <span>FHIR JSON</span>
          </button>

          {/* CDISC Export Button */}
          <button
            onClick={handleExportCDISC}
            title="Export CDISC SDTM (DM, AE, DS, SV) Standard Dataset"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-[#f4f8f6] text-slate-700 border border-slate-200/80 rounded-full font-bold text-xs font-display shadow-xs transition-all active:scale-[0.98]"
          >
            <FileText className="w-3.5 h-3.5 text-[#608c7d]" />
            <span>CDISC SDTM</span>
          </button>

          <button
            onClick={() => setIsScenarioModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#f4f8f6] text-slate-800 border border-slate-200/80 rounded-full font-bold text-xs font-display shadow-xs transition-all active:scale-[0.98]"
          >
            <Sliders className="w-4 h-4 text-[#608c7d]" />
            <span>SIMULATE SCENARIOS</span>
          </button>

          <button
            onClick={handleRunAiDiagnosis}
            disabled={diagnosing}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f4a28c] hover:bg-[#e26b4e] text-white rounded-full font-bold text-xs font-display shadow-peach-glow transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {diagnosing ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Bot className="w-4 h-4" />}
            <span>RUN AI RISK DIAGNOSIS</span>
          </button>
        </div>
      </div>

      {/* Trial Header Dossier Card */}
      <div className="relative bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] rounded-[34px] p-6 sm:p-8 text-white shadow-soft-xl overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-white/20 relative z-10">
          <div className="flex items-start gap-4 max-w-3xl">
            {/* 3D Floating Herbal Formulation Model */}
            <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
              <HerbalLeaf3D className="w-16 h-16" color="#a3c5b3" accentColor="#f4a28c" />
              <span className="text-[8px] text-white/80 font-bold uppercase tracking-wider mt-0.5">3D Active</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm font-mono font-black text-slate-900 px-3 py-1 bg-white rounded-full shadow-xs">
                  {trial.trialId}
                </span>
                <PhaseBadge phase={trial.phase} />
                <StatusBadge status={trial.status} />
                <RiskBadge category={liveRisk.category} score={liveRisk.score} />
                <HealthBadge category={trial.liveHealthAnalysis?.category} score={trial.liveHealthAnalysis?.score} />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display leading-snug">
                {trial.title}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                <strong className="text-white">Formulation:</strong> {trial.treatment} • <strong className="text-white">Discipline:</strong> {trial.ayurvedicDiscipline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-1.5 shrink-0 text-xs text-white/90">
            <span>PI: <strong className="text-white font-bold">{trial.principalInvestigator}</strong></span>
            <span>Initiation: <strong className="text-white font-bold">{new Date(trial.startDate).toLocaleDateString()}</strong></span>
            <span>Est. Completion: <strong className="text-white font-bold">{new Date(trial.expectedEndDate).toLocaleDateString()}</strong></span>
          </div>
        </div>

        {/* High-Impact Trial KPIs with Operational Intelligence */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 relative z-10">
          {/* 1. Recruitment with Why? */}
          <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/70 uppercase">Recruitment</span>
              <button
                onClick={() => openWhyModal('recruitment')}
                title="Explain why recruitment is at this level"
                className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-md transition-colors"
              >
                Why?
              </button>
            </div>
            <p className="text-xl font-extrabold text-white mt-0.5 font-display">{enrollmentPct}%</p>
            <p className="text-[10px] text-white/70">{trial.currentEnrolled}/{trial.targetParticipants}</p>
          </div>

          {/* 2. Operational Health with Why? */}
          <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/70 uppercase">Trial Health</span>
              <button
                onClick={() => openWhyModal('health')}
                title="Explain operational health score factors"
                className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-md transition-colors"
              >
                Why?
              </button>
            </div>
            <p className="text-xl font-extrabold text-white mt-0.5 font-display">{trial.liveHealthAnalysis?.score || 78}/100</p>
            <p className="text-[10px] text-white/70">{trial.liveHealthAnalysis?.category || 'Healthy'}</p>
          </div>

          {/* 3. Predictive Operational Delay with Why? */}
          <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/70 uppercase">AI Forecast</span>
              <button
                onClick={() => openWhyModal('delay')}
                title="Explain projected delay factors"
                className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-md transition-colors"
              >
                Why?
              </button>
            </div>
            <p className="text-xl font-extrabold text-white mt-0.5 font-display">
              {trial.livePrediction?.predictedDelayDays > 0 ? `+${trial.livePrediction.predictedDelayDays}d` : 'On Track'}
            </p>
            <p className="text-[10px] text-white/70">
              {trial.livePrediction?.delayProbability ? `${trial.livePrediction.delayProbability}% prob` : 'Trajectory optimal'}
            </p>
          </div>

          {/* 4. Compliance */}
          <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/70 uppercase">Compliance</span>
              <button
                onClick={() => openWhyModal('compliance')}
                title="Explain compliance status"
                className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-md transition-colors"
              >
                Why?
              </button>
            </div>
            <p className="text-xl font-extrabold text-white mt-0.5 font-display">{trial.complianceScore}%</p>
            <p className="text-[10px] text-white/70">IEC / CTRI Status</p>
          </div>

          {/* 5. Safety */}
          <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/70 uppercase">Safety Score</span>
              <button
                onClick={() => openWhyModal('safety')}
                title="Explain safety events"
                className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-md transition-colors"
              >
                Why?
              </button>
            </div>
            <p className="text-xl font-extrabold text-white mt-0.5 font-display">{trial.safetyScore}%</p>
            <p className="text-[10px] text-white/70">{trial.safetyEvents?.length || 0} PV Events</p>
          </div>

          {/* 6. Risk Score with Why? */}
          <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/70 uppercase">Risk Score</span>
              <button
                onClick={() => openWhyModal('risk')}
                title="Explain risk score components"
                className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-md transition-colors"
              >
                Why?
              </button>
            </div>
            <p className="text-xl font-extrabold text-white mt-0.5 font-display">{liveRisk.score}/100</p>
            <p className="text-[10px] text-white/70">{liveRisk.category} Risk</p>
          </div>
        </div>
      </div>

      {/* Trial 9-Stage Timeline in White Card */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-lg p-6">
        <div className="pb-4 border-b border-slate-100 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
              Clinical Milestone Journey Pipeline (Protocol → CSR Lock)
            </h2>
            <p className="text-xs text-slate-500">
              Real-time stage completion tracking through institutional audits.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-[#f4f8f6] px-3 py-1.5 rounded-full shrink-0">
            <span>{completedMilestones} / {milestonesList.length} Stages</span>
            <span className="text-[#608c7d]">({milestoneProgressPct}%)</span>
          </div>
        </div>

        <Timeline milestones={milestonesList} />
      </div>

      {/* Dynamic AI Risk Diagnosis Box */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-soft-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#fdede8] text-[#f4a28c] rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
              AI Risk Diagnosis & Remediation Architecture
            </h2>
          </div>
          <span className="text-xs font-bold text-[#608c7d] px-3 py-1 bg-[#e4ede9] rounded-full">
            Ground-Truth Analysis
          </span>
        </div>

        {liveRisk.breakdown.length === 0 ? (
          <div className="p-4 bg-[#e4ede9] rounded-2xl text-[#2b423b] text-xs font-medium">
            🟢 LOW RISK PROTOCOL STATUS — Progressing within statistical milestone limits with zero active critical alerts.
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-700 font-medium">
              The AI Diagnostic Engine computed a cumulative risk penalty of <strong className="font-mono text-rose-700">{liveRisk.score}/100</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {liveRisk.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#fdede8] rounded-2xl border border-[#fed7cd] text-xs"
                >
                  <div className="flex items-center justify-between font-bold mb-1 text-slate-900">
                    <span>{item.factor}</span>
                    <span className="font-mono text-rose-700">-{item.penalty} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations Output */}
        {aiDiagnosis && (
          <div className="mt-4 p-5 bg-[#f4f8f6] rounded-2xl border border-slate-200/80 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs uppercase text-slate-900 font-display">
              <Sparkles className="w-4 h-4 text-[#f4a28c]" />
              <span>Prioritized AI Action Plan:</span>
            </div>
            <div className="space-y-1.5 pl-1">
              {aiDiagnosis.recommendations?.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-800 font-medium">
                  <CornerDownRight className="w-3.5 h-3.5 text-[#608c7d] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Research Centers Assigned + Responsive Milestone Action Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Participating Ayurvedic Research Sites */}
        <div className="lg:col-span-5 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-lg p-6">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
              Participating Research Centers
            </h2>
            <p className="text-xs text-slate-500">Multi-center enrollment breakdown.</p>
          </div>

          <div className="space-y-3">
            {trial.trialSites?.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No research sites currently assigned.</p>
            ) : (
              trial.trialSites?.map((ts) => {
                const site = ts.site || {};
                const sitePct =
                  ts.targetEnrollment > 0
                    ? Math.round((ts.currentEnrollment / ts.targetEnrollment) * 100)
                    : 0;

                return (
                  <div
                    key={ts.id}
                    className="p-3.5 bg-[#f4f8f6] rounded-2xl flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-900 truncate font-display">{site.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {site.city}, {site.state} • PI: {ts.sitePi}
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <span className="text-xs font-bold text-slate-900">
                        {ts.currentEnrollment} / {ts.targetEnrollment}
                      </span>
                      <p className="text-[10px] text-[#608c7d] font-bold">{sitePct}% quota</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Fully Responsive Milestones Action Checklist */}
        <div className="lg:col-span-7 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-lg p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-display">
                Milestone Audit Checklist
              </h2>
              <p className="text-xs text-slate-500">Click any card to toggle verification status.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1 text-[10px]">
              {['ALL', 'COMPLETED', 'PENDING'].map((f) => (
                <button
                  key={f}
                  onClick={() => setMilestoneFilter(f)}
                  className={`px-3 py-1 rounded-full font-bold transition-colors ${
                    milestoneFilter === f
                      ? 'bg-[#608c7d] text-white shadow-xs'
                      : 'bg-[#f4f8f6] text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Milestone Progress Bar */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-700 text-[11px]">
              <span>Verification Progress</span>
              <span className="text-[#608c7d]">{completedMilestones} / {milestonesList.length} ({milestoneProgressPct}%)</span>
            </div>
            <div className="w-full bg-[#f4f8f6] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#608c7d] to-[#f4a28c] h-full rounded-full transition-all duration-300"
                style={{ width: `${milestoneProgressPct}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredMilestones.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No milestones match the selected filter.</p>
            ) : (
              filteredMilestones.map((m, idx) => {
                const isCompleted = m.status === 'COMPLETED';

                return (
                  <div
                    key={m.id}
                    onClick={() => handleUpdateMilestone(m.id, m.status)}
                    className={`p-3.5 rounded-2xl transition-all flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none ${
                      isCompleted
                        ? 'bg-[#e4ede9]/80 border border-[#a3c5b3]'
                        : m.status === 'DELAYED'
                        ? 'bg-[#fff5e6] border border-[#fcd34d]'
                        : 'bg-[#f4f8f6] hover:bg-white border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {/* Checkbox and Content */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 shrink-0 mt-0.5 sm:mt-0 rounded-lg flex items-center justify-center transition-colors ${
                          isCompleted ? 'bg-[#608c7d] text-white shadow-xs' : 'bg-white border border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white text-slate-800 rounded-md shadow-xs">
                            {m.stage || `Stage ${idx + 1}`}
                          </span>
                          {m.plannedDate && (
                            <span className="text-[10px] font-mono text-slate-500">
                              📅 {new Date(m.plannedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-bold leading-snug break-words ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900 font-display'}`}>
                          {m.title}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <StatusBadge status={m.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* "Why?" AI Root Cause Explainability Modal */}
      <WhyExplainModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        trialId={trial.trialId}
        metric={whyMetric}
      />

      {/* What-If Scenario Simulator Modal */}
      <ScenarioSimulatorModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        trialId={trial.trialId}
        trialTitle={trial.title}
      />
    </div>
  );
};

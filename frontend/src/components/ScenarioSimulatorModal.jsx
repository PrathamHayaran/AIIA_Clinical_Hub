import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { intelligenceApi } from '../services/intelligenceApi';
import { Sparkles, Sliders, ArrowRight, CheckCircle2, TrendingDown, TrendingUp, Calendar, Zap, RefreshCw } from 'lucide-react';

export const ScenarioSimulatorModal = ({ isOpen, onClose, trialId = 'AYU-002', trialTitle = 'Comparative Efficacy & Safety Trial' }) => {
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);

  // Simulation parameters state
  const [additionalSites, setAdditionalSites] = useState(2);
  const [siteVelocityBoostPct, setSiteVelocityBoostPct] = useState(15);
  const [timelineExtensionDays, setTimelineExtensionDays] = useState(0);
  const [resolveSafetyBacklog, setResolveSafetyBacklog] = useState(false);

  // Results state
  const [simulationResult, setSimulationResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await intelligenceApi.simulateScenario(trialId, {
        additionalSites: Number(additionalSites),
        siteVelocityBoostPct: Number(siteVelocityBoostPct),
        timelineExtensionDays: Number(timelineExtensionDays),
        resolveSafetyBacklog,
      });
      setSimulationResult(res.simulation);
      if (res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    if (isOpen && trialId) {
      setLoading(true);
      runSimulation().finally(() => setLoading(false));
    }
  }, [isOpen, trialId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trial Scenario Simulator • ${trialId}`}
      maxWidth="max-w-3xl"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#608c7d] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-slate-500 font-display">
            Initializing hypothetical operational simulation engine...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subheader Banner */}
          <div className="p-3.5 bg-[#f4f8f6] rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 font-display">{trialTitle}</p>
              <p className="text-[11px] text-slate-500">Hypothetical operational scenario modeler • Non-destructive</p>
            </div>
            <button
              onClick={runSimulation}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#608c7d] hover:bg-[#4d7567] text-white text-xs font-bold rounded-xl shadow-sage-glow transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
              <span>{simulating ? 'Simulating...' : 'Run Simulation'}</span>
            </button>
          </div>

          {/* Interactive Scenario Controls Grid */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#608c7d]" />
              <span>Hypothetical Operational Interventions</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Additional Sites Slider */}
              <div className="p-3 bg-[#edf2ef]/60 rounded-xl border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Additional Sites</span>
                  <span className="font-mono text-[#608c7d] px-2 py-0.5 bg-white rounded-md border border-slate-200">
                    +{additionalSites} Centers
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={additionalSites}
                  onChange={(e) => setAdditionalSites(e.target.value)}
                  className="w-full accent-[#608c7d]"
                />
                <p className="text-[10px] text-slate-500">Expands regional capacity by ~22% per site</p>
              </div>

              {/* 2. Site Velocity Boost Slider */}
              <div className="p-3 bg-[#edf2ef]/60 rounded-xl border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Recruitment Boost</span>
                  <span className="font-mono text-[#608c7d] px-2 py-0.5 bg-white rounded-md border border-slate-200">
                    +{siteVelocityBoostPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={siteVelocityBoostPct}
                  onChange={(e) => setSiteVelocityBoostPct(e.target.value)}
                  className="w-full accent-[#608c7d]"
                />
                <p className="text-[10px] text-slate-500">Targeted outreach & screening triage</p>
              </div>

              {/* 3. Timeline Extension */}
              <div className="p-3 bg-[#edf2ef]/60 rounded-xl border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Timeline Extension</span>
                  <span className="font-mono text-[#608c7d] px-2 py-0.5 bg-white rounded-md border border-slate-200">
                    +{timelineExtensionDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="15"
                  value={timelineExtensionDays}
                  onChange={(e) => setTimelineExtensionDays(e.target.value)}
                  className="w-full accent-[#608c7d]"
                />
                <p className="text-[10px] text-slate-500">Formal ethics timeline amendment</p>
              </div>
            </div>
          </div>

          {/* Current vs Simulated Outcome Comparison Table */}
          {simulationResult && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Current Baseline vs. Simulated Outcome</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Metric 1: Risk Score */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risk Score</span>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">Current</span>
                      <span className="text-lg font-bold text-slate-700 font-mono">{simulationResult.current.riskScore}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="text-right">
                      <span className="text-xs text-[#608c7d] font-bold block">Simulated</span>
                      <span className="text-2xl font-black text-[#608c7d] font-mono">{simulationResult.simulated.riskScore}</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-center">
                    {simulationResult.deltas.riskDelta <= 0 ? `${simulationResult.deltas.riskDelta} pts` : `+${simulationResult.deltas.riskDelta} pts`} improvement
                  </div>
                </div>

                {/* Metric 2: Health Score */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trial Health</span>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">Current</span>
                      <span className="text-lg font-bold text-slate-700 font-mono">{simulationResult.current.healthScore}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="text-right">
                      <span className="text-xs text-[#608c7d] font-bold block">Simulated</span>
                      <span className="text-2xl font-black text-[#608c7d] font-mono">{simulationResult.simulated.healthScore}</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-center">
                    +{simulationResult.deltas.healthDelta} pts operational vitality
                  </div>
                </div>

                {/* Metric 3: Projected Delay */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Projected Delay</span>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">Current</span>
                      <span className="text-lg font-bold text-slate-700 font-mono">{simulationResult.current.predictedDelayDays}d</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="text-right">
                      <span className="text-xs text-[#608c7d] font-bold block">Simulated</span>
                      <span className="text-2xl font-black text-[#608c7d] font-mono">{simulationResult.simulated.predictedDelayDays}d</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-center">
                    {simulationResult.deltas.delayDelta <= 0 ? `${simulationResult.deltas.delayDelta} days` : `+${simulationResult.deltas.delayDelta} days`} delay
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommended Scenario Box */}
          {recommendations?.recommendedScenario && (
            <div className="p-4 bg-gradient-to-br from-[#f4f8f6] via-white to-[#edf2ef] rounded-2xl border border-[#608c7d]/40 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#608c7d] text-xs font-bold font-display uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#608c7d]" />
                <span>AI Recommended Optimal Scenario</span>
                <span className="ml-auto text-[10px] font-mono px-2 py-0.5 bg-[#608c7d] text-white rounded-full">
                  Rank #1
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-900 font-display">
                {recommendations.recommendedScenario.name}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                {recommendations.recommendedScenario.rationale}
              </p>
            </div>
          )}

          <p className="text-[10px] text-slate-400 font-medium text-center pt-2 border-t border-slate-100">
            Hypothetical scenario modeling for operational decision support. No live database records are modified.
          </p>
        </div>
      )}
    </Modal>
  );
};

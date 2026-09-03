import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { intelligenceApi } from '../services/intelligenceApi';
import { Sparkles, AlertTriangle, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';

export const WhyExplainModal = ({ isOpen, onClose, trialId, metric = 'overall', initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [rootCause, setRootCause] = useState(initialData);

  useEffect(() => {
    if (isOpen && trialId && !initialData) {
      setLoading(true);
      intelligenceApi.getTrialRootCause(trialId, metric)
        .then((res) => {
          setRootCause(res.rootCause);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load root cause explanation:', err);
          setLoading(false);
        });
    } else if (initialData) {
      setRootCause(initialData);
    }
  }, [isOpen, trialId, metric, initialData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Root Cause Diagnostic • ${metric.toUpperCase()}`}
      maxWidth="max-w-2xl"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#608c7d] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-slate-500 font-display">
            Synthesizing trial telemetry & root cause evidence...
          </p>
        </div>
      ) : rootCause ? (
        <div className="space-y-5">
          {/* Direct Answer Header Box */}
          <div className="p-4 bg-gradient-to-br from-[#f4f8f6] via-white to-[#edf2ef] rounded-2xl border border-[#608c7d]/30 shadow-xs">
            <div className="flex items-center gap-2 text-[#608c7d] text-xs font-bold font-display uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4 text-[#608c7d]" />
              <span>Direct Root Cause Assessment</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 bg-white text-slate-700 rounded-full border border-slate-200">
                Confidence: {Math.round((rootCause.confidence || 0.9) * 100)}%
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed font-sans">
              {rootCause.directAnswer}
            </p>
          </div>

          {/* Evidence Checklist */}
          {rootCause.evidence && rootCause.evidence.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Empirical Trial Evidence</span>
              </h4>
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100">
                {rootCause.evidence.map((ev, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#608c7d] mt-1.5 shrink-0" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Underlying Root Causes */}
          {rootCause.rootCauses && rootCause.rootCauses.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Underlying Operational Bottlenecks</span>
              </h4>
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60 divide-y divide-amber-100/80">
                {rootCause.rootCauses.map((rc, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{rc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {rootCause.recommendedActions && rootCause.recommendedActions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4 text-[#608c7d]" />
                <span>Recommended Operational Interventions</span>
              </h4>
              <div className="space-y-2">
                {rootCause.recommendedActions.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-[#e4ede9]/50 rounded-xl border border-[#a3c5b3]/60 flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-[#608c7d] text-white text-[10px] font-bold font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Safeguard Disclaimer */}
          <p className="text-[10px] text-slate-400 font-medium text-center pt-2 border-t border-slate-100">
            AI-generated operational diagnostic. Verify important decisions with qualified trial personnel.
          </p>
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-slate-500 font-medium">
          Insufficient data available to determine the root cause for this parameter.
        </div>
      )}
    </Modal>
  );
};

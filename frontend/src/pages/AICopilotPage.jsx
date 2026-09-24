import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  HelpCircle,
  Cpu,
  CornerDownRight,
  Zap,
} from 'lucide-react';
import { AyurvedicTridosha3D } from '../components/3d/AyurvedicTridosha3D';
import { FloatingHerbalParticles } from '../components/3d/FloatingHerbalParticles';

export const AICopilotPage = () => {
  const location = useLocation();
  const { addToast } = useNotification();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState({ hasKey: false, model: 'gemini-1.5-flash', mode: 'HEURISTIC_LOCAL' });
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      directAnswer: 'Namaste! I am Nadi AI, the Real-Time Clinical Pulse & Intelligence Engine for AIIA. I continuously sense and analyze structured telemetry across all 25 Ayurvedic clinical protocols to diagnose risk anomalies, track regulatory expiration horizons, and recommend evidence-based interventions.',
      supportingData: 'Integrated with live database state (Trials, Sites, Pharmacovigilance, IEC Ethics, CTRI).',
      reasoning: 'I evaluate multi-center recruitment pacing, milestone velocity, serious adverse events, and data completeness to assist clinical investigators and institutional leadership.',
      recommendedActions: [
        'Ask which clinical protocols are operating in High or Critical risk thresholds.',
        'Inquire about upcoming IEC ethics clearance expirations (<15 days).',
        'Request root-cause analysis for recruitment bottlenecks at regional sites.',
      ],
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/ai/status');
        if (res.data.success && res.data.data) {
          setAiStatus(res.data.data);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchStatus();
  }, []);

  const suggestedQueries = [
    { text: 'Brief Me — Executive Management Summary', category: 'BRIEF' },
    { text: 'Which trial is likely to be delayed?', category: 'PREDICTION' },
    { text: 'What happens if I add two research sites to AYU-002?', category: 'SCENARIO' },
    { text: 'Why is AYU-002 considered high risk?', category: 'DIAGNOSIS' },
    { text: 'Which Ayurvedic interventions are being studied most frequently?', category: 'AYURVEDA' },
    { text: 'Compare AYU-002 and AYU-005.', category: 'COMPARISON' },
    { text: 'What compliance deadlines are coming in next 10 days?', category: 'COMPLIANCE' },
    { text: 'Which research site is performing the best?', category: 'SITES' },
  ];

  // Auto-run if query param ?trial=AYU-002 exists
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trialParam = params.get('trial');
    if (trialParam) {
      handleSend(`Why is ${trialParam} considered high risk?`);
    }
  }, [location.search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const queryToSend = queryText || prompt;
    if (!queryToSend.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: queryToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/ai/copilot', { prompt: queryToSend }, { timeout: 50000 });
      if (res.data.success && res.data.data) {
        const aiData = res.data.data;
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          directAnswer: aiData.directAnswer,
          supportingData: aiData.supportingData,
          reasoning: aiData.reasoning,
          recommendedActions: aiData.recommendedActions || [],
          source: aiData.source,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      addToast({ title: 'Nadi AI Error', message: err.message, type: 'danger' });
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          directAnswer: 'Insufficient telemetry data available or connection timed out.',
          supportingData: 'Telemetry stream interrupted.',
          reasoning: err.message,
          recommendedActions: ['Verify that the backend server is active on Port 5000.'],
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-h-[920px] space-y-4 pb-2 font-sans bg-[#edf2ef]">
      {/* 1. Header Banner */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 p-5 bg-gradient-to-r from-[#608c7d] via-[#537e70] to-[#456c5f] text-white rounded-[28px] shadow-soft-lg overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-2xl text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
              <span>Nadi AI</span>
              <span className="px-2.5 py-0.5 bg-[#f4a28c] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                Clinical Pulse & Intelligence
              </span>
            </h1>
            <p className="text-xs text-white/80 font-medium">
              Real-time pulse diagnostics, causal telemetry & predictive risk synthesis over 25 Ayurvedic trial cohorts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {/* AI Engine Status Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#f4a28c]" />
            <span>
              {aiStatus.hasKey
                ? `Gemini ${aiStatus.model?.includes('pro') ? '1.5 Pro' : '1.5 Flash'} Live`
                : 'Vedic Heuristic Engine'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pr-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <AyurvedicTridosha3D className="w-10 h-10" interactive={false} />
            </div>
            <span className="text-[10px] font-mono text-white/80">3D Bio-Engine</span>
          </div>
        </div>
      </div>

      {/* 2. Suggested Quick Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[10px] font-bold uppercase text-slate-400 font-display whitespace-nowrap pl-1">
          SUGGESTED:
        </span>
        {suggestedQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.text)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#f4f8f6] text-slate-800 rounded-full border border-slate-200/80 shadow-xs text-xs font-medium whitespace-nowrap transition-all shrink-0 active:scale-[0.98]"
          >
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-[#e4ede9] text-[#2b423b] rounded-full">
              {q.category}
            </span>
            <span>{q.text}</span>
          </button>
        ))}
      </div>

      {/* 3. Main Chat Thread */}
      <div className="flex-1 bg-white rounded-[28px] border border-slate-200/80 shadow-soft-xl p-5 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-xl p-4 bg-[#608c7d] text-white rounded-[24px] rounded-tr-xs shadow-soft-lg text-xs sm:text-sm font-medium leading-relaxed">
                  {msg.text}
                </div>
              </div>
            );
          }

          // Assistant Output
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-3xl w-full p-6 bg-[#f4f8f6] rounded-[28px] rounded-tl-xs space-y-4 text-xs text-slate-800">
                {/* 1. Direct Answer */}
                <div className="pb-3 border-b border-slate-200/80">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase text-slate-500 font-display">
                      <Sparkles className="w-4 h-4 text-[#f4a28c]" />
                      <span>Direct Diagnostic Findings:</span>
                    </div>
                    {msg.source && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-full border border-emerald-200">
                        ✨ {msg.source}
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 font-display leading-relaxed">
                    {msg.directAnswer}
                  </p>
                </div>

                {/* 2. Supporting Data */}
                {msg.supportingData && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display block mb-1.5">
                      Supporting Clinical Telemetry & Metrics:
                    </span>
                    {typeof msg.supportingData === 'string' ? (
                      <p className="p-3.5 bg-white rounded-2xl border border-slate-200/60 text-slate-800 font-mono text-[11px] leading-relaxed">
                        {msg.supportingData}
                      </p>
                    ) : Array.isArray(msg.supportingData) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.supportingData.map((item, i) => (
                          <div key={i} className="p-3 bg-white rounded-2xl border border-slate-200/60 text-[11px] font-mono">
                            {typeof item === 'object' ? (
                              Object.entries(item).map(([k, v]) => (
                                <div key={k} className="flex justify-between py-0.5">
                                  <span className="text-slate-500 capitalize font-sans">{k}:</span>
                                  <span className="font-bold text-slate-900 text-right">{String(v)}</span>
                                </div>
                              ))
                            ) : (
                              <span>{String(item)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded-2xl border border-slate-200/60 text-[11px] space-y-1 font-mono">
                        {Object.entries(msg.supportingData).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-slate-500 capitalize font-sans">{k}:</span>
                            <span className="font-bold text-slate-900">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Reasoning */}
                {msg.reasoning && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display block mb-1">
                      Causal Reasoning & Root Cause Analysis:
                    </span>
                    <p className="p-4 bg-white rounded-2xl border border-slate-200/60 text-slate-700 leading-relaxed whitespace-pre-line text-xs font-medium">
                      {msg.reasoning}
                    </p>
                  </div>
                )}

                {/* 4. Actions */}
                {msg.recommendedActions && msg.recommendedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display block mb-1.5">
                      Prioritized Operational Next Steps:
                    </span>
                    <div className="space-y-2">
                      {msg.recommendedActions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-slate-800 font-semibold">
                          <CornerDownRight className="w-4 h-4 text-[#608c7d] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 p-3.5 bg-[#f4f8f6] rounded-2xl w-fit">
            <Loader2 className="w-4 h-4 text-[#608c7d] animate-spin" />
            <span className="text-xs font-semibold text-slate-700">
              Nadi AI sensing telemetry pulse & calculating risk differentials...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="shrink-0 flex items-center gap-3 p-2 bg-white rounded-full border border-slate-200/80 shadow-soft-lg"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything regarding trial risks, recruitment velocity, adverse events, or compliance horizons..."
          className="flex-1 px-5 py-2.5 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="p-3 bg-[#f4a28c] hover:bg-[#e26b4e] text-white rounded-full font-bold shadow-peach-glow transition-all disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
};

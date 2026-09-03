import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';

export const Timeline = ({ milestones = [] }) => {
  const getStageIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-white stroke-[2.5]" />;
      case 'ACTIVE':
        return <Clock className="w-5 h-5 text-white animate-spin stroke-[2.5]" style={{ animationDuration: '8s' }} />;
      case 'DELAYED':
        return <AlertTriangle className="w-5 h-5 text-white stroke-[2.5]" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400 stroke-2" />;
    }
  };

  const getStageBg = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-[#608c7d] text-white shadow-sage-glow';
      case 'ACTIVE':
        return 'bg-[#f4a28c] text-white shadow-peach-glow scale-105';
      case 'DELAYED':
        return 'bg-amber-400 text-white shadow-sm';
      default:
        return 'bg-white border-2 border-slate-200 text-slate-400';
    }
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-[#e4ede9] text-[#2b423b] font-bold';
      case 'ACTIVE':
        return 'bg-[#fdede8] text-[#9d442e] font-bold';
      case 'DELAYED':
        return 'bg-[#fff5e6] text-[#b45309] font-bold';
      default:
        return 'bg-slate-100 text-slate-500 font-medium';
    }
  };

  return (
    <div className="w-full">
      {/* Desktop View: Horizontal Stepper with horizontal overflow protection */}
      <div className="hidden xl:block w-full overflow-x-auto pb-4 pt-2">
        <div className="flex items-center min-w-[860px] justify-between relative px-2">
          {/* Connecting track line */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200/80 -z-0 rounded-full" />

          {milestones.map((m, idx) => {
            return (
              <div key={m.id || idx} className="relative z-10 flex flex-col items-center text-center max-w-[110px] group">
                {/* Node Circle */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${getStageBg(m.status)}`}
                >
                  {getStageIcon(m.status)}
                </div>

                {/* Stage Title */}
                <div className="mt-2.5 space-y-1">
                  <span className={`inline-block text-[9px] uppercase px-2 py-0.5 rounded-full ${getBadgeStyle(m.status)}`}>
                    {m.stage || m.title}
                  </span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight font-display">
                    {m.title}
                  </p>
                  {m.plannedDate && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      {new Date(m.plannedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Responsive View: Adaptive Grid / Vertical Flow */}
      <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {milestones.map((m, idx) => {
          const isCompleted = m.status === 'COMPLETED';

          return (
            <div
              key={m.id || idx}
              className={`p-3.5 rounded-2xl flex items-start gap-3 transition-all ${
                isCompleted
                  ? 'bg-[#e4ede9]/60 border border-[#a3c5b3]'
                  : m.status === 'ACTIVE'
                  ? 'bg-[#fdede8]/60 border border-[#f8947b]'
                  : m.status === 'DELAYED'
                  ? 'bg-[#fff5e6] border border-[#fcd34d]'
                  : 'bg-white border border-slate-200/80 shadow-xs'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${getStageBg(m.status)}`}>
                {getStageIcon(m.status)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full ${getBadgeStyle(m.status)}`}>
                    {m.stage || `Stage ${idx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {m.plannedDate ? new Date(m.plannedDate).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-2 leading-tight font-display">
                  {m.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

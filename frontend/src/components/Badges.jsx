import React from 'react';

export const RiskBadge = ({ category, score }) => {
  const cat = (category || 'Low').toLowerCase();

  let styles = 'bg-[#e4ede9] text-[#2b423b] border border-[#a3c5b3]';

  if (cat === 'critical' || score >= 81) {
    styles = 'bg-[#fdede8] text-[#9d442e] border border-[#f8947b] font-bold animate-pulse';
  } else if (cat === 'high' || score >= 61) {
    styles = 'bg-[#fff5e6] text-[#b45309] border border-[#fcd34d] font-bold';
  } else if (cat === 'medium' || score >= 31) {
    styles = 'bg-[#fef9c3] text-[#854d0e] border border-[#fde047]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-tight shadow-xs ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {score !== undefined ? `${score}/100 • ${category || 'Low'}` : category || 'Low Risk'}
    </span>
  );
};

export const HealthBadge = ({ category, score }) => {
  const s = score !== undefined ? score : 80;
  let styles = 'bg-[#e4ede9] text-[#2b423b] border border-[#a3c5b3]';
  let cat = category || (s >= 80 ? 'Healthy' : s >= 60 ? 'Watchlist' : s >= 40 ? 'At-Risk' : 'Critical');

  if (s < 40) {
    styles = 'bg-[#fdede8] text-[#9d442e] border border-[#f8947b] font-bold animate-pulse';
  } else if (s < 60) {
    styles = 'bg-[#fff5e6] text-[#b45309] border border-[#fcd34d] font-bold';
  } else if (s < 80) {
    styles = 'bg-[#fef9c3] text-[#854d0e] border border-[#fde047]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-tight shadow-xs ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {score !== undefined ? `${score}/100 • ${cat}` : `${cat} Health`}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const s = (status || 'Active').toLowerCase();

  let styles = 'bg-[#e4ede9] text-[#2b423b] border border-[#a3c5b3]';

  if (s === 'delayed') {
    styles = 'bg-[#fff5e6] text-[#b45309] border border-[#fcd34d] font-bold';
  } else if (s === 'completed') {
    styles = 'bg-[#e0f2fe] text-[#0369a1] border border-[#7dd3fc] font-bold';
  } else if (s === 'suspended') {
    styles = 'bg-[#fdede8] text-[#9d442e] border border-[#f8947b] font-bold';
  } else if (s === 'recruiting') {
    styles = 'bg-[#f3e8ff] text-[#6b21a8] border border-[#d8b4fe] font-bold';
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wide shadow-xs ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status || 'Active'}
    </span>
  );
};

export const SeverityBadge = ({ severity }) => {
  const sev = (severity || 'Mild').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border border-slate-200';

  if (sev === 'serious') {
    styles = 'bg-[#fdede8] text-[#9d442e] border border-[#f8947b] font-bold';
  } else if (sev === 'severe') {
    styles = 'bg-[#fff5e6] text-[#b45309] border border-[#fcd34d] font-bold';
  } else if (sev === 'moderate') {
    styles = 'bg-[#fef9c3] text-[#854d0e] border border-[#fde047]';
  } else if (sev === 'mild') {
    styles = 'bg-[#e4ede9] text-[#2b423b] border border-[#a3c5b3]';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight shadow-xs ${styles}`}
    >
      {severity || 'Mild'}
    </span>
  );
};

export const PhaseBadge = ({ phase }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-slate-800 border border-slate-200 shadow-xs">
      {phase || 'Phase II'}
    </span>
  );
};

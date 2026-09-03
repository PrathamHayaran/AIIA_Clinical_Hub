import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'sage',
  onClick,
}) => {
  const colorMap = {
    sage: {
      bg: 'bg-white',
      iconBg: 'bg-[#f4f8f6] text-[#608c7d]',
      badge: 'bg-[#e4ede9] text-[#345047]',
    },
    peach: {
      bg: 'bg-white',
      iconBg: 'bg-[#fdede8] text-[#f4a28c]',
      badge: 'bg-[#fed7cd] text-[#9d442e]',
    },
    blue: {
      bg: 'bg-white',
      iconBg: 'bg-[#e0f2fe] text-[#0284c7]',
      badge: 'bg-[#bae6fd] text-[#0369a1]',
    },
    amber: {
      bg: 'bg-white',
      iconBg: 'bg-[#fef3c7] text-[#d97706]',
      badge: 'bg-[#fde68a] text-[#b45309]',
    },
    rose: {
      bg: 'bg-white',
      iconBg: 'bg-[#ffe4e6] text-[#e11d48]',
      badge: 'bg-[#fecdd3] text-[#be123c]',
    },
  };

  const scheme = colorMap[color] || colorMap.sage;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`rounded-[26px] p-5 bg-white border border-slate-200/70 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {value}
            </span>
            {trend && (
              <span className="text-xs font-bold text-[#608c7d]">
                {trend}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl ${scheme.iconBg} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

import React from 'react';

export const AyurvedicHerbalCanopy = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Subtle, Minimalist Sage Botanical Top Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#608c7d]/40 to-transparent" />

      {/* Delicate, Minimalist Botanical Leaf Garland along Top Edge */}
      <svg
        className="absolute top-0 left-0 w-full h-10 object-cover opacity-35 transition-opacity hover:opacity-55"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Sage & Peach Gradients */}
          <linearGradient id="simpleSage" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#608c7d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#456c5f" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="simplePeach" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4a28c" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e26b4e" stopOpacity="0.75" />
          </linearGradient>

          {/* Minimalist 3-leaf sprig */}
          <g id="miniSprig">
            <path
              d="M0,0 Q12,12 28,15"
              stroke="#608c7d"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Small subtle leaves */}
            <path
              d="M10,8 C7,2 2,4 4,9 C6,13 13,11 10,8 Z"
              fill="url(#simpleSage)"
              className="animate-herb-sway"
            />
            <path
              d="M18,11 C22,5 26,8 24,13 C22,16 16,13 18,11 Z"
              fill="url(#simpleSage)"
              className="animate-herb-sway-delayed"
            />
            <path
              d="M28,15 C33,12 36,16 33,20 C30,23 25,18 28,15 Z"
              fill="url(#simplePeach)"
              className="animate-herb-sway"
            />
            {/* Micro pollen dot */}
            <circle cx="20" cy="10" r="1.5" fill="url(#simplePeach)" />
          </g>
        </defs>

        {/* Continuous repeating minimalist botanical ribbon */}
        <g>
          {/* Stem wave along top */}
          <path
            d="M0,2 Q100,12 200,3 Q300,14 400,2 Q500,13 600,3 Q700,14 800,2 Q900,13 1000,3 Q1100,12 1200,2"
            stroke="#608c7d"
            strokeWidth="1"
            strokeOpacity="0.4"
            fill="none"
          />

          {/* Distributed delicate sprigs */}
          <use href="#miniSprig" x="40" y="0" />
          <use href="#miniSprig" x="180" y="0" transform="scale(0.9) scale(1, -1) translate(0, -10)" />
          <use href="#miniSprig" x="320" y="0" />
          <use href="#miniSprig" x="460" y="0" transform="scale(0.85) scale(1, -1) translate(0, -8)" />
          <use href="#miniSprig" x="600" y="0" />
          <use href="#miniSprig" x="740" y="0" transform="scale(0.9) scale(1, -1) translate(0, -10)" />
          <use href="#miniSprig" x="880" y="0" />
          <use href="#miniSprig" x="1020" y="0" transform="scale(0.85) scale(1, -1) translate(0, -8)" />
          <use href="#miniSprig" x="1140" y="0" />
        </g>
      </svg>
    </div>
  );
};

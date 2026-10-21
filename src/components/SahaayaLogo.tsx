import React from 'react';

export interface SahaayaLogoProps {
  className?: string;
  size?: number | string;
  animatedStage?: number; // 1 to 6 for splash animation, undefined for static full logo
  showGlow?: boolean;
}

export const SahaayaLogo: React.FC<SahaayaLogoProps> = ({
  className = 'w-8 h-8',
  size,
  animatedStage,
  showGlow = false,
}) => {
  // If animatedStage is undefined or >= 4, render the complete logo
  const stage = animatedStage !== undefined ? animatedStage : 4;

  const styleObj: React.CSSProperties = size
    ? { width: size, height: size }
    : {};

  // Outline drawing calculation (perimeter ~220px)
  // Stage 1: strokeDashoffset 220 -> 0
  const isOutlineVisible = stage >= 1;
  const isFillVisible = stage >= 2;
  const isHumanVisible = stage >= 3;
  const isCompletedGlow = stage >= 4 || showGlow;

  return (
    <div
      style={styleObj}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      {/* Glow effect behind heart */}
      {isCompletedGlow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40 -z-10 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(21,155,120,0.45) 0%, rgba(23,63,145,0.3) 60%, transparent 80%)'
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transition-transform duration-500 ${
          stage === 4 ? 'scale-105 sm:scale-100' : 'scale-100'
        }`}
        aria-hidden="true"
      >
        <defs>
          {/* Subtle soft gradient highlights */}
          <linearGradient id="logoBlueGrad" x1="15" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#173F91" />
          </linearGradient>
          <linearGradient id="logoTealGrad" x1="85" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1EC298" />
            <stop offset="1" stopColor="#108665" />
          </linearGradient>
        </defs>

        {/* Stage 2+: Left Blue Half Fill */}
        <path
          d="M50,24 C40,13 22,12 13,24 C4,36 5,55 22,71 C33,81 44,86 50,88 Z"
          fill="url(#logoBlueGrad)"
          className="transition-opacity duration-500 ease-out"
          style={{ opacity: isFillVisible ? 1 : 0 }}
        />

        {/* Stage 2+: Right Teal/Green Half Fill */}
        <path
          d="M50,24 C60,13 78,12 87,24 C96,36 95,55 78,71 C67,81 56,86 50,88 Z"
          fill="url(#logoTealGrad)"
          className="transition-opacity duration-500 ease-out"
          style={{ opacity: isFillVisible ? 1 : 0 }}
        />

        {/* Stage 1+: Outer Heart Outline Stroke */}
        <path
          d="M50,24 C40,13 22,12 13,24 C4,36 5,55 22,71 C33,81 44,86 50,88 C56,86 67,81 78,71 C95,55 96,36 87,24 C78,12 60,13 50,24 Z"
          fill="none"
          stroke="#0F2B66"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-400 ease-out"
          style={{
            strokeDasharray: 230,
            strokeDashoffset: isOutlineVisible ? 0 : 230,
            opacity: isOutlineVisible ? 1 : 0,
          }}
        />

        {/* Stage 3+: White Human Figure (Care & Protection Silhouette) */}
        <g
          className="transition-all duration-500 ease-out"
          style={{
            opacity: isHumanVisible ? 1 : 0,
            transform: isHumanVisible ? 'translateY(0)' : 'translateY(6px)',
          }}
        >
          {/* Head */}
          <circle cx="50" cy="37.5" r="5.8" fill="#FFFFFF" />

          {/* Torso and Embracing Raised Arms */}
          <path
            d="M50,78 C48.5,74 47.5,63 47,56 C42.5,53.5 37,49 32.5,43 C31.5,41.5 33,39.5 35,40.5 C39,42.5 44,47 47.5,49.5 C48,47.5 48.5,46 50,46 C51.5,46 52,47.5 52.5,49.5 C56,47 61,42.5 65,40.5 C67,39.5 68.5,41.5 67.5,43 C63,49 57.5,53.5 53,56 C52.5,63 51.5,74 50,78 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
};

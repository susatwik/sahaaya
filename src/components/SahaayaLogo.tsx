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
  // If animatedStage is undefined, render the complete static logo
  const isStatic = animatedStage === undefined;
  const stage = isStatic ? 6 : animatedStage;

  const styleObj: React.CSSProperties = size
    ? { width: size, height: size }
    : {};

  // Outline perimeter ~236px
  const isOutlineVisible = stage >= 1;
  const isFillVisible = stage >= 2;
  const isHeadVisible = stage >= 3;
  const isBodyVisible = stage >= 3;
  const isLocked = stage >= 4;

  // Geometry paths (viewBox: 0 0 100 100)
  // Heart left & right contours meeting at cleft (50, 24) and rounded tip (50, 87)
  const leftContour = "M 50 24 C 38 12, 16 14, 12 34 C 8 52, 22 69, 38 79 C 44 83, 48 86, 50 87";
  const rightContour = "C 52 86, 56 83, 62 79 C 78 69, 92 52, 88 34 C 84 14, 62 12, 50 24";
  const fullHeart = `${leftContour} ${rightContour} Z`;
  const leftHalf = `${leftContour} L 50 24 Z`;
  const rightHalf = `M 50 87 ${rightContour} L 50 87 Z`;
  
  // Cohesive human figure (Head + Embracing Torso Silhouette)
  const bodySilhouette = "M 50 78 C 47.5 73, 46 64, 45 56 C 39.5 53, 34 48.5, 30.5 42 C 29 39.5, 31.5 38, 33.5 39.5 C 37.5 42, 42.5 46.5, 46.5 49 C 47.5 47, 48.5 45.5, 50 45.5 C 51.5 45.5, 52.5 47, 53.5 49 C 57.5 46.5, 62.5 42, 66.5 39.5 C 68.5 38, 71 39.5, 69.5 42 C 66 48.5, 60.5 53, 55 56 C 54 64, 52.5 73, 50 78 Z";

  return (
    <div
      style={styleObj}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <style>{`
        @keyframes drawSahaayaHeart {
          0% {
            stroke-dashoffset: 240;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>

      {/* Faint, restrained highlight on lock-in (no heavy neon glow) */}
      {(showGlow || (stage >= 4 && !isStatic)) && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-25 -z-10 pointer-events-none transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(21,155,120,0.3) 0%, rgba(23,63,145,0.15) 60%, transparent 80%)'
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transform-gpu ${
          isStatic
            ? ''
            : 'transition-transform duration-400 ease-out ' + (isLocked ? 'scale-100' : 'scale-104')
        }`}
        aria-hidden="true"
      >
        <defs>
          {/* Vivid healthcare blue (#2563EB) and rich teal green (#159B78) */}
          <linearGradient id="logoBlueGrad" x1="15" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="logoTealGrad" x1="85" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#159B78" />
            <stop offset="1" stopColor="#0D7A5C" />
          </linearGradient>
        </defs>

        {/* Stage 2+: Left Blue Half Fill (#2563EB) */}
        <path
          id="logoLeftFill"
          d={leftHalf}
          fill="url(#logoBlueGrad)"
          className={isStatic ? '' : 'transition-all duration-400 ease-out'}
          style={{
            opacity: isFillVisible ? 1 : 0,
            transformOrigin: '50% 50%',
            transform: isStatic || isFillVisible ? 'scale(1)' : 'scale(0.96)',
          }}
        />

        {/* Stage 2+: Right Teal Green Half Fill (#159B78) */}
        <path
          id="logoRightFill"
          d={rightHalf}
          fill="url(#logoTealGrad)"
          className={isStatic ? '' : 'transition-all duration-400 ease-out'}
          style={{
            opacity: isFillVisible ? 1 : 0,
            transformOrigin: '50% 50%',
            transform: isStatic || isFillVisible ? 'scale(1)' : 'scale(0.96)',
          }}
        />

        {/* Stage 1+: Outer Heart Outline Stroke (Navy #173F91) */}
        <path
          id="logoOutline"
          d={fullHeart}
          fill="none"
          stroke="#173F91"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: isStatic ? 'none' : 240,
            strokeDashoffset: isStatic ? 0 : (isOutlineVisible ? 0 : 240),
            opacity: isOutlineVisible ? 1 : 0,
            animation: !isStatic && stage === 1 ? 'drawSahaayaHeart 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          }}
        />

        {/* Stage 3+: White Human Figure (Head + Embracing Torso Silhouette) */}
        <g id="logoHumanFigure">
          {/* Head - Reveals first in Stage 3 */}
          <circle
            id="logoHead"
            cx="50"
            cy="35.5"
            r="5.5"
            fill="#FFFFFF"
            className={isStatic ? '' : 'transition-all duration-300 ease-out'}
            style={{
              opacity: isHeadVisible ? 1 : 0,
              transformOrigin: '50px 35.5px',
              transform: isStatic || isHeadVisible ? 'scale(1)' : 'scale(0.3)',
            }}
          />

          {/* Torso & Embracing Arms - Glides upward smoothly from base */}
          <path
            id="logoBody"
            d={bodySilhouette}
            fill="#FFFFFF"
            className={isStatic ? '' : 'transition-all duration-400 ease-out'}
            style={{
              opacity: isBodyVisible ? 1 : 0,
              transform: isStatic || isBodyVisible ? 'translateY(0)' : 'translateY(10px)',
            }}
          />
        </g>
      </svg>
    </div>
  );
};

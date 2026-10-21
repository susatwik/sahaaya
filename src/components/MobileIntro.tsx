import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SahaayaLogo } from './SahaayaLogo';

interface MobileIntroProps {
  onComplete: () => void;
}

export const MobileIntro: React.FC<MobileIntroProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  // Animation Stage:
  // 1: (0.0s - 0.3s) Draw heart outline
  // 2: (0.3s - 0.7s) Fill heart (Blue + Green)
  // 3: (0.7s - 1.1s) Human figure emerges
  // 4: (1.1s - 1.5s) Logo completes with glow and scale
  // 5: (1.5s - 1.9s) App name, tagline, and offline badge appear
  // 6: (1.9s - 2.4s) Holds briefly, then fades out to dashboard
  const [stage, setStage] = useState<number>(1);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);
  const completedRef = useRef<boolean>(false);

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsDismissing(true);
    try {
      sessionStorage.setItem('sahaaya_intro_seen', 'true');
    } catch {
      // Storage restricted
    }
    setTimeout(() => {
      onComplete();
    }, 280);
  };

  useEffect(() => {
    // 1. Accessibility guard: respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleFinish();
      return;
    }

    // 2. Desktop guard: target mobile viewport (< 768px)
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      handleFinish();
      return;
    }

    // 3. Session guard: only once per browser session
    try {
      if (sessionStorage.getItem('sahaaya_intro_seen') === 'true') {
        handleFinish();
        return;
      }
    } catch {
      // Ignore sessionStorage issues
    }

    // Stage timeline matching the 6-stage specification
    const t1 = setTimeout(() => setStage(2), 320);   // 0.3s: Fill heart
    const t2 = setTimeout(() => setStage(3), 720);   // 0.7s: Reveal human figure
    const t3 = setTimeout(() => setStage(4), 1150);  // 1.2s: Complete logo with scale & glow
    const t4 = setTimeout(() => setStage(5), 1550);  // 1.6s: App name & badge appear
    const t5 = setTimeout(() => {
      setStage(6);
      handleFinish();
    }, 2350);                                        // 2.3s: Hold & transition to dashboard

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sahaaya Health Introduction"
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center bg-white px-6 py-8 transition-opacity duration-300 select-none ${
        isDismissing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Bar with Discreet Skip Button */}
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={handleFinish}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200/70"
          aria-label={isTe ? 'ఇంట్రో దాటవేయి' : 'Skip intro'}
        >
          {isTe ? 'దాటవేయి' : 'Skip'}
        </button>
      </div>

      {/* Center Logo & Brand Reveal Sequence */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm -mt-8">
        {/* Animated Heart Logo */}
        <div className="relative mb-6">
          <SahaayaLogo
            className="w-28 h-28 sm:w-32 sm:h-32"
            animatedStage={stage}
            showGlow={stage >= 4}
          />
        </div>

        {/* Stage 5+: Brand Name */}
        <div
          className={`transition-all duration-500 ease-out transform ${
            stage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <h1 className="text-3xl font-black tracking-tight leading-none">
            <span className="text-[#173F91]">SAHAAYA </span>
            <span className="text-[#159B78]">HEALTH</span>
          </h1>

          <p className="text-sm font-medium text-slate-600 mt-2">
            {isTe ? 'మీ ఆఫ్‌లైన్ ఆరోగ్య సహచరి' : 'Your Offline Health Companion'}
          </p>

          {/* 100% Offline Ready Badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E7F7EF] border border-[#159B78]/40 text-[#159B78] text-xs font-bold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#159B78] shrink-0" />
            <span>{isTe ? '100% ఆఫ్‌లైన్ సిద్ధంగా ఉంది' : '100% Offline Ready'}</span>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Spacer */}
      <div className="h-6" />
    </div>
  );
};

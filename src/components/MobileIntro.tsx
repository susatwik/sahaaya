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

  // 6-Stage Animation Lifecycle:
  // Stage 1: (0.0s - 0.4s) Thin navy stroke traces heart outline
  // Stage 2: (0.4s - 0.8s) Heart fills with blue (left) and teal (right)
  // Stage 3: (0.8s - 1.25s) Human figure emerges: head first, body/arms upward
  // Stage 4: (1.25s - 1.65s) Logo locks into place with subtle settle
  // Stage 5: (1.65s - 2.05s) Brand name typography & truthful offline badge
  // Stage 6: (2.05s - 2.4s) Hold briefly, then gentle fade-out to dashboard
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
    }, 200);
  };

  useEffect(() => {
    // 1. Accessibility guard: respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleFinish();
      return;
    }

    // 2. Desktop guard: target mobile viewports (< 768px)
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      handleFinish();
      return;
    }

    // 3. Session guard: display once per browser session
    try {
      if (sessionStorage.getItem('sahaaya_intro_seen') === 'true') {
        handleFinish();
        return;
      }
    } catch {
      // Ignore sessionStorage restriction
    }

    // Coordinated 6-stage timeline (target 2.4s total)
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setStage(2), 400),   // 0.4s: Heart fills with color
      setTimeout(() => setStage(3), 800),   // 0.8s: Human figure emerges
      setTimeout(() => setStage(4), 1250),  // 1.25s: Logo locks into place
      setTimeout(() => setStage(5), 1650),  // 1.65s: Brand name & companion tagline
      setTimeout(() => setStage(6), 2050),  // 2.05s: Brief hold
      setTimeout(() => handleFinish(), 2400) // 2.4s: Transition to dashboard
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sahaaya Health Introduction"
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center bg-white px-6 select-none transition-opacity duration-200 ${
        isDismissing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        paddingTop: 'max(1.25rem, env(safe-area-inset-top, 1.25rem))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))',
      }}
    >
      {/* Top Bar with Accessible Skip Button */}
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

      {/* Centered Logo & Brand Reveal Sequence */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm my-auto">
        {/* Animated Heart Logo with Synchronized Vector Stages */}
        <div className="relative mb-6">
          <SahaayaLogo
            className="w-28 h-28 sm:w-32 sm:h-32"
            animatedStage={stage}
            showGlow={stage >= 4}
          />
        </div>

        {/* Stage 5+: Brand Name & Truthful Offline Companion Subtitle */}
        <div
          className={`transition-all duration-400 ease-out transform ${
            stage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
            <span className="text-[#173F91]">Sahaaya</span>{' '}
            <span className="text-[#159B78]">Health</span>
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-2">
            {isTe ? 'మీ ఆఫ్‌లైన్ ఆరోగ్య సహచరి' : 'Your Offline Health Companion'}
          </p>

          {/* Truthful Offline Readiness Badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E7F7EF] border border-[#159B78]/40 text-[#159B78] text-xs font-semibold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#159B78] shrink-0" />
            <span>{isTe ? '100% ఆఫ్‌లైన్ సిద్ధంగా ఉంది' : '100% Offline Ready'}</span>
          </div>
        </div>
      </div>

      {/* Symmetrical Bottom Spacer to keep Center Exactly in Viewport Midpoint */}
      <div className="h-8" aria-hidden="true" />
    </div>
  );
};

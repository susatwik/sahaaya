import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileIntroProps {
  onComplete: () => void;
}

export const MobileIntro: React.FC<MobileIntroProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  // Animation phase: 0=init, 1=logo, 2=title, 3=subtitle, 4=offline_ready, 5=exit
  const [phase, setPhase] = useState<number>(0);
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
    }, 300);
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

    // Phase schedule: total sequence ~2.0s
    setPhase(1); // Logo appears (0ms)

    const t1 = setTimeout(() => setPhase(2), 350);  // Title appears (350ms)
    const t2 = setTimeout(() => setPhase(3), 750);  // Subtitle appears (750ms)
    const t3 = setTimeout(() => setPhase(4), 1200); // Offline Ready badge (1200ms)
    const t4 = setTimeout(() => {
      setPhase(5);
      handleFinish();
    }, 2100); // Transition out

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sahaaya Health Introduction"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-6 py-10 bg-gradient-to-b from-white via-slate-50 to-blue-50/50 transition-opacity duration-300 ${
        isDismissing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Bar with Skip Action */}
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={handleFinish}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all shadow-sm border border-slate-200/80"
          aria-label={isTe ? 'ఇంట్రో దాటవేయి' : 'Skip intro'}
        >
          {isTe ? 'దాటవేయి' : 'Skip'}
        </button>
      </div>

      {/* Center Cinematic Logo & Brand Reveal */}
      <div className="flex flex-col items-center text-center max-w-xs -mt-8">
        {/* Step 1: Animated Heart-and-Shield Logo */}
        <div
          className={`relative mb-5 transition-all duration-500 ease-out transform ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="w-24 h-24 rounded-3xl bg-white p-3 shadow-xl shadow-blue-900/10 border border-blue-100 flex items-center justify-center">
            <img
              src="/logo.svg"
              alt="Sahaaya Health Shield Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Subtle pulse ring */}
          <div
            className={`absolute -inset-1.5 rounded-3xl bg-teal-500/10 -z-10 transition-opacity duration-700 ${
              phase >= 2 ? 'opacity-100 animate-pulse' : 'opacity-0'
            }`}
          />
        </div>

        {/* Step 2: Application Title */}
        <h1
          className={`text-2xl font-bold tracking-tight text-[#173F91] transition-all duration-500 ease-out transform ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {isTe ? 'సహాయ హెల్త్' : 'Sahaaya Health'}
        </h1>

        {/* Step 3: Subtitle */}
        <p
          className={`text-sm font-medium text-slate-600 mt-1.5 transition-all duration-500 ease-out transform ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {isTe ? 'మీ ఆఫ్‌లైన్ ఆరోగ్య సహచరి' : 'Your Offline Health Companion'}
        </p>

        {/* Step 4: Offline Ready Verified Badge */}
        <div
          className={`mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F7EF] border border-[#159B78]/30 text-[#159B78] text-xs font-semibold shadow-sm transition-all duration-500 ease-out transform ${
            phase >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-[#159B78]" />
          <span>{isTe ? '100% ఆఫ్‌లైన్ సిద్ధంగా ఉంది' : '100% Offline Ready'}</span>
        </div>
      </div>

      {/* Bottom Core Philosophy Tagline */}
      <div
        className={`text-center max-w-xs transition-all duration-500 ease-out transform ${
          phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <p className="text-xs font-medium text-slate-500">
          {isTe
            ? 'సరైన ప్రొటోకాల్. సరైన ప్రాధాన్యత. ఆఫ్‌లైన్‌లో కూడా.'
            : 'Right protocol. Right priority. Even offline.'}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {isTe ? 'ASHA & ANM ఆరోగ్య కార్యకర్తల కోసం' : 'Designed for ASHA & ANM Frontline Workers'}
        </p>
      </div>
    </div>
  );
};

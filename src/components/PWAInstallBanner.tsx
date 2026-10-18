import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if already installed in standalone display mode
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true);

    if (isStandalone) {
      return;
    }

    // 2. Check if user already dismissed recently
    try {
      const dismissed = localStorage.getItem('sahaaya_pwa_dismissed');
      if (dismissed === 'true') {
        return;
      }
    } catch {
      // Storage unavailable
    }

    // 3. Listen for Android Chrome native PWA prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
    } catch (err) {
      console.warn('PWA install prompt error:', err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('sahaaya_pwa_dismissed', 'true');
    } catch {
      // Storage unavailable
    }
  };

  if (!isVisible || !installPrompt) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label={isTe ? 'యాప్ ఇన్‌స్టాలేషన్ నోటీసు' : 'App installation notice'}
      className="mx-3 sm:mx-4 mt-2 sm:mt-3 mb-2 p-3 sm:p-4 bg-gradient-to-r from-[#173F91] to-[#159B78] rounded-2xl text-white shadow-md animate-fade-in transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Top / Left Header: Logo, Text & Mobile Dismiss */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/20 p-2 shrink-0 flex items-center justify-center backdrop-blur-sm border border-white/20 mt-0.5 sm:mt-0">
            <img src="/logo.svg" alt="Sahaaya Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-bold leading-tight text-white">
                {isTe ? 'సహాయ హెల్త్ యాప్‌ను ఇన్‌స్టాల్ చేయండి' : 'Install Sahaaya Health App'}
              </h3>
              {/* Dismiss button visible on top right for narrow screens */}
              <button
                type="button"
                onClick={handleDismiss}
                className="sm:hidden p-1.5 -mr-1 -mt-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={isTe ? 'మూసివేయి' : 'Dismiss install prompt'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] sm:text-xs text-white/90 leading-relaxed mt-1">
              {isTe ? 'నెట్ లేకపోయినా ఒకే ట్యాప్‌తో నేరుగా తెరవండి' : 'One-tap access even completely offline'}
            </p>
          </div>
        </div>

        {/* Action Button Row: Stacked on small screens, flex on larger screens */}
        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-4 py-2.5 bg-white text-[#173F91] text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-100 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <Download className="w-4 h-4 text-[#173F91]" />
            <span>{isTe ? 'ఇన్‌స్టాల్ చేయండి' : 'Install App'}</span>
          </button>

          {/* Dismiss button for desktop / tablet view */}
          <button
            type="button"
            onClick={handleDismiss}
            className="hidden sm:flex p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/15 transition-colors min-w-[44px] min-h-[44px] items-center justify-center"
            aria-label={isTe ? 'మూసివేయి' : 'Dismiss install prompt'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

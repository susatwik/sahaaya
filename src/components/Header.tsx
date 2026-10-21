import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Wifi, WifiOff, X, Database, RefreshCw, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SyncQueueManager } from '../core/sync/syncQueue';
import { SahaayaLogo } from './SahaayaLogo';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [showNetworkPanel, setShowNetworkPanel] = useState<boolean>(false);
  const networkPanelRef = useRef<HTMLDivElement>(null);

  const isTe = language === 'te';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const updatePending = async () => {
      const count = await SyncQueueManager.getInstance().getPendingCount();
      setPendingCount(count);
    };

    updatePending();
    const unsubscribe = SyncQueueManager.getInstance().subscribe(updatePending);

    // Dismiss network panel on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (networkPanelRef.current && !networkPanelRef.current.contains(e.target as Node)) {
        setShowNetworkPanel(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('mousedown', handleOutsideClick);
      unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2 select-none">
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 max-w-[1200px] mx-auto min-w-0">
        {/* Left: Brand Logo + Name + ASHA/ANM Subtitle */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer min-w-0 shrink group py-1"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/');
          }}
          aria-label="Sahaaya Health Home"
        >
          <SahaayaLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-2xs transition-transform group-hover:scale-105" />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-black text-sahaaya-navy tracking-tight leading-none truncate">
              {t.appName}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none mt-1 truncate">
              {isTe ? 'ఆశా / ANM సహాయకుడు' : 'ASHA / ANM Companion'}
            </p>
          </div>
        </div>

        {/* Right side controls: Language toggle, Network status, Direct Settings access */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Toggle Pill */}
          <div
            className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs font-semibold"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all text-[11px] sm:text-xs min-h-[34px] sm:min-h-[32px] flex items-center justify-center ${
                language === 'en'
                  ? 'bg-sahaaya-navy text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={language === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all text-[11px] sm:text-xs min-h-[34px] sm:min-h-[32px] flex items-center justify-center ${
                language === 'te'
                  ? 'bg-sahaaya-teal text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={language === 'te'}
            >
              <span className="sm:hidden">తె</span>
              <span className="hidden sm:inline">తెలుగు</span>
            </button>
          </div>

          {/* Network Status Button */}
          <div className="relative" ref={networkPanelRef}>
            <button
              type="button"
              onClick={() => setShowNetworkPanel(!showNetworkPanel)}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border shadow-2xs transition-colors min-h-[44px] min-w-[44px] ${
                isOnline
                  ? 'bg-[#E7F7EF] text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
              title={isOnline ? 'Online - All local records active' : 'Offline Mode - Local storage active'}
              aria-label={isOnline ? 'Online Status' : 'Offline Status'}
              aria-expanded={showNetworkPanel}
            >
              {isOnline ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
              ) : (
                <span className="inline-flex rounded-full h-2 w-2 bg-amber-500" />
              )}
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              )}
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Offline/Network Status Popover */}
            {showNetworkPanel && (
              <div className="absolute right-0 top-12 mt-1 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-scale-in text-left">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-xs font-bold text-slate-900">
                      {isOnline
                        ? (isTe ? 'కనెక్ట్ అయింది (ఆన్‌లైన్)' : 'Connected (Online)')
                        : (isTe ? 'ఆఫ్‌లైన్ మోడ్ (100% సిద్ధంగా ఉంది)' : 'Offline Mode (100% Ready)')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNetworkPanel(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    aria-label="Close status panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 py-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Database className="w-3.5 h-3.5 text-sahaaya-navy" />
                      {isTe ? 'స్థానిక డేటాబేస్' : 'Local IndexedDB'}
                    </span>
                    <span className="font-bold text-emerald-700">{isTe ? 'ఆరోగ్యంగా ఉంది' : 'Active (Healthy)'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <RefreshCw className="w-3.5 h-3.5 text-sahaaya-teal" />
                      {isTe ? 'సింక్ క్యూ' : 'Pending Sync'}
                    </span>
                    <span className="font-bold text-slate-900">
                      {pendingCount > 0 ? `${pendingCount} ${isTe ? 'మార్పులు' : 'items'}` : (isTe ? 'పూర్తిగా సింక్ అయింది' : '0 items')}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed">
                    {isTe
                      ? 'ఇంటర్నెట్ లేకపోయినా 500 కుటుంబాలు, సందర్శనలు మరియు క్లినికల్ ప్రోటోకాల్స్ పనిచేస్తాయి.'
                      : 'All 500 households, daily visits, and clinical protocols operate completely offline.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNetworkPanel(false);
                      navigate('/sync');
                    }}
                    className="px-2.5 py-2 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors"
                  >
                    {isTe ? 'సింక్ క్యూ' : 'Sync Queue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNetworkPanel(false);
                      navigate('/readiness');
                    }}
                    className="px-2.5 py-2 text-center rounded-xl bg-sahaaya-navy hover:bg-sahaaya-navy-light text-white text-[11px] font-bold transition-colors"
                  >
                    {isTe ? 'డయాగ్నస్టిక్స్' : 'Diagnostics'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button (Direct Access to /settings, replaces hamburger menu) */}
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className={`p-2 rounded-full text-slate-700 hover:text-sahaaya-navy hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center border border-slate-200/80 shadow-2xs ${
              location.pathname === '/settings' ? 'bg-sahaaya-soft-blue text-sahaaya-navy border-blue-300' : 'bg-white'
            }`}
            title={t.navSettings}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-slate-700 hover:text-sahaaya-navy transition-transform hover:rotate-45" />
          </button>
        </div>
      </div>
    </header>
  );
};

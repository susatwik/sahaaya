import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Wifi, WifiOff, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SyncQueueManager } from '../core/sync/syncQueue';

interface HeaderProps {
  onOpenMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(0);

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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2 sm:py-2.5 select-none">
      <div className="flex items-center justify-between gap-1.5 sm:gap-4 max-w-[1200px] mx-auto min-w-0">
        {/* Left: Brand Logo, Compact Title & ASHA/ANM Badge (Badge on sm+) */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer min-w-0 shrink group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/');
          }}
          aria-label="Sahaaya Health Home"
        >
          <img
            src="/logo.svg"
            alt="Sahaaya Health Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow-2xs transition-transform group-hover:scale-105"
          />
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base md:text-lg font-black text-sahaaya-navy tracking-tight leading-none truncate">
                {t.appName}
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold bg-[#E7F7EF] text-emerald-800 border border-emerald-300 rounded-full leading-none shrink-0">
                {t.ashaAnmBadge}
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium leading-none mt-1 truncate">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right side controls: Language toggle, Connectivity status, Settings/Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Toggle Pill - Ultra compact on small mobile */}
          <div
            className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs font-semibold"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all text-[11px] sm:text-xs min-h-[32px] sm:min-h-[auto] flex items-center justify-center ${
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
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all text-[11px] sm:text-xs min-h-[32px] sm:min-h-[auto] flex items-center justify-center ${
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

          {/* Connectivity indicator: Icon + badge on mobile, full label on desktop */}
          <button
            type="button"
            onClick={() => navigate('/sync')}
            className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E7F7EF] text-emerald-800 border border-emerald-300/80 shadow-2xs transition-colors hover:bg-emerald-100 min-h-[32px] min-w-[32px]"
            title={isOnline ? t.worksOffline : 'Offline mode'}
            aria-label={isOnline ? 'Online - All records local' : 'Offline Mode'}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            )}
            <span className="hidden md:inline">
              {t.offlineMode}
            </span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          {/* Mobile Drawer / Desktop Settings button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenMobileDrawer && window.innerWidth < 640) {
                onOpenMobileDrawer();
              } else {
                navigate('/settings');
              }
            }}
            className={`p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-sahaaya-navy hover:bg-slate-100 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
              location.pathname === '/settings' ? 'bg-slate-100 text-sahaaya-navy' : ''
            }`}
            title={t.navSettings}
            aria-label="Navigation Menu & Settings"
          >
            <Settings className="w-5 h-5 hidden sm:block" />
            <Menu className="w-5 h-5 sm:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
};

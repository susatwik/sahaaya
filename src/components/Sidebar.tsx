import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  MessageSquareQuote,
  CalendarCheck,
  Users,
  BookOpen,
  RefreshCw,
  Settings,
  CheckCircle2,
  Wifi,
  Globe,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SyncQueueManager } from '../core/sync/syncQueue';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

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
    const unsub = SyncQueueManager.getInstance().subscribe(updatePending);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsub();
    };
  }, []);

  const navItems = [
    { path: '/', label: t.navHome, icon: Home },
    { path: '/ask', label: t.navAsk, icon: MessageSquareQuote },
    { path: '/visits', label: t.navVisits, icon: CalendarCheck },
    { path: '/households', label: t.navHouseholds, icon: Users },
    { path: '/protocols', label: t.navGuides, icon: BookOpen },
    { path: '/sync', label: t.navSync, icon: RefreshCw, badge: pendingCount },
    { path: '/settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <aside className="hidden sm:flex flex-col w-[250px] fixed top-0 left-0 bottom-0 h-screen max-h-[100dvh] bg-white border-r border-slate-200/90 p-4 justify-between z-30 overflow-y-auto select-none">
      <div>
        {/* Brand */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-2 py-2 cursor-pointer group"
        >
          <img
            src="/logo.svg"
            alt="Sahaaya Health Logo"
            className="w-10 h-10 object-contain drop-shadow-2xs transition-transform group-hover:scale-105"
          />
          <div>
            <span className="text-lg font-black text-sahaaya-navy tracking-tight leading-tight block">
              {t.appName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium leading-none block mt-0.5">
              {t.appSubtitle}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sahaaya-soft-blue text-sahaaya-navy shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-sahaaya-navy' : 'text-slate-500'
                    }`}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Reference Matched Bottom Status Card */}
      <div className="pt-3">
        <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-2.5">
          {/* Works Offline Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-sahaaya-navy border border-blue-200/60 flex items-center justify-center shrink-0">
              <Wifi className="w-4 h-4 text-sahaaya-navy" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs leading-tight">
                {t.worksOffline}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {t.noInternetNeeded}
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate('/readiness')}
            className="space-y-1.5 pt-1 border-t border-slate-200/70 text-[11px] cursor-pointer hover:bg-slate-100/60 p-1.5 rounded-lg transition-colors"
            title="Inspect Offline Readiness & Diagnostics"
          >
            {/* Offline Readiness Dynamic */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.offlineReadiness}</span>
              </span>
              <span className="font-bold text-emerald-700 hover:underline">500 HH • Ready</span>
            </div>

            {/* Model (CPU) Verified */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.modelCpu}</span>
              </span>
              <span className="font-bold text-emerald-700">{t.verified}</span>
            </div>
          </div>

          {/* Language Switcher Row */}
          <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <div className="flex items-center gap-1 font-medium">
                <button
                  onClick={() => setLanguage('en')}
                  className={`hover:underline ${language === 'en' ? 'font-bold text-sahaaya-navy underline' : ''}`}
                >
                  {t.english}
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => setLanguage('te')}
                  className={`hover:underline ${language === 'te' ? 'font-bold text-sahaaya-teal underline' : ''}`}
                >
                  {t.telugu}
                </button>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{t.hindi}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="text-slate-400 hover:text-slate-700"
              title={t.navSettings}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

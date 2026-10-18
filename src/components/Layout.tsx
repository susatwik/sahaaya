import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { X, RefreshCw, Settings, Info, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SyncQueueManager } from '../core/sync/syncQueue';

export const Layout: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [pendingCount, setPendingCount] = useState<number>(0);

  React.useEffect(() => {
    const updatePending = async () => {
      const count = await SyncQueueManager.getInstance().getPendingCount();
      setPendingCount(count);
    };
    updatePending();
    const unsub = SyncQueueManager.getInstance().subscribe(updatePending);
    return () => unsub();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area - Offset by fixed sidebar width (250px) on desktop */}
      <div className="flex-1 flex flex-col min-w-0 sm:pl-[250px] pb-24 sm:pb-6 transition-all">
        <Header onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 transition-all">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav onOpenMore={() => setMobileDrawerOpen(true)} />

      {/* Slide-out Mobile Drawer for Secondary Actions */}
      {mobileDrawerOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-5 animate-scale-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.svg" alt="Sahaaya" className="w-8 h-8 object-contain" />
                  <div>
                    <h3 className="font-extrabold text-sahaaya-navy text-base leading-none">
                      Sahaaya Health
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">ASHA / ANM Menu</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavigate('/sync')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    location.pathname === '/sync'
                      ? 'bg-sahaaya-soft-blue text-sahaaya-navy shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-sahaaya-teal" />
                    <span>{t.navSync}</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavigate('/settings')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    location.pathname === '/settings'
                      ? 'bg-sahaaya-soft-blue text-sahaaya-navy shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-5 h-5 text-sahaaya-navy" />
                  <span>{t.navSettings}</span>
                </button>
              </div>
            </div>

            {/* Bottom info */}
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Offline Grounded NHM Protocols</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Sahaaya Health v1.0.0 • Designed for Andhra Pradesh Frontline Health Workers
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

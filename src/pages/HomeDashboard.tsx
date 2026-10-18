import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquareQuote,
  CalendarCheck,
  Users,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getDB, Visit, Household } from '../core/storage/db';
import { SyncQueueManager } from '../core/sync/syncQueue';
import { MobileIntro } from '../components/MobileIntro';
import { PWAInstallBanner } from '../components/PWAInstallBanner';

export const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.innerWidth >= 768) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      return sessionStorage.getItem('sahaaya_intro_seen') !== 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      const db = await getDB();
      const allVisits = await db.getAll('visits');
      const allHH = await db.getAll('households');
      setVisits(allVisits);
      setHouseholds(allHH);
    };

    loadDashboardData();
    const unsub = SyncQueueManager.getInstance().subscribe(loadDashboardData);
    return () => unsub();
  }, []);

  // Derive counts dynamically from real application data
  const highPriorityCount = visits.filter(
    (v) => v.priority === 'HIGH' && v.status === 'PENDING'
  ).length;

  const dueTodayCount = visits.filter(
    (v) => (v.dueDate === '2026-10-15' || v.priority === 'DUE') && v.status === 'PENDING'
  ).length;

  const overdueCount = visits.filter(
    (v) => (v.isOverdue || v.priority === 'OVERDUE') && v.status === 'PENDING'
  ).length;

  const totalVisitsCount = visits.length;

  const isTe = language === 'te';

  return (
    <>
      {showIntro && <MobileIntro onComplete={() => setShowIntro(false)} />}
      <PWAInstallBanner />
      <div className="space-y-5 animate-fade-in pb-12 select-none">
        {/* 1. Large Illustrated Hero Banner (matching the reference image) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 shadow-xs min-h-[360px] md:h-[400px] flex items-center justify-center text-center p-6 sm:p-10 bg-slate-100">
        {/* Full-width landscape illustration background */}
        <img
          src="/illustrations/home-banner.png"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/illustrations/hero-landscape-bg.png';
          }}
          alt="Sahaaya Health Rural Village Landscape"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Controlled luminous daylight gradient for pristine text contrast on all viewports */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/85 to-white/95 sm:bg-gradient-to-r sm:from-transparent sm:via-white/50 sm:to-transparent pointer-events-none" />

        {/* Foreground Content Layer: Real HTML Text & Buttons layered cleanly over image */}
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Works Offline Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-800 shadow-2xs border border-white/70 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.worksOffline} • {t.noInternetNeeded}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-sahaaya-navy tracking-tight leading-none mb-1">
            {t.namaste}
          </h1>

          {/* Telugu Heading */}
          <p className="text-xl sm:text-2xl lg:text-[28px] font-black text-sahaaya-navy leading-snug mb-2">
            {t.greetingSubtitle}
          </p>

          {/* Supporting Heading */}
          <p className="text-sm sm:text-base font-bold text-slate-800 mb-1">
            {t.heroTagline}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed mb-6 font-medium">
            {t.heroDescription}
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto max-w-xs sm:max-w-none">
            <button
              onClick={() => navigate('/ask')}
              className="px-5 py-3 sm:py-2.5 bg-sahaaya-navy hover:bg-[#1E4CB0] active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 group transition-all min-h-[44px]"
            >
              <MessageSquareQuote className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>{t.heroAskBtn}</span>
            </button>

            <button
              onClick={() => navigate('/visits')}
              className="px-5 py-3 sm:py-2.5 bg-white/95 hover:bg-white active:scale-95 text-emerald-800 border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.heroVisitsBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Four Illustrated Feature Cards (using user-provided illustrations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Ask a Question */}
        <div
          onClick={() => navigate('/ask')}
          className="relative overflow-hidden rounded-2xl border border-blue-200/80 p-4 sm:p-5 flex items-center justify-between min-h-[145px] transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group bg-[#EFF6FF]"
        >
          {/* High-res card illustration */}
          <img
            src="/illustrations/feature-card-ask.png"
            alt="Ask a Question"
            className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none group-hover:scale-105 transition-transform duration-300"
          />
          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EFF6FF] via-[#EFF6FF]/92 to-transparent w-3/4 sm:w-2/3 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquareQuote className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                {t.cardAskTitle}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5 truncate font-medium">
                {t.cardAskDesc}
              </p>
            </div>
          </div>

          <div className="relative z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-2xs text-blue-600 flex items-center justify-center shrink-0 border border-white/80 group-hover:translate-x-0.5 transition-transform">
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        {/* Card 2: Daily Visit List */}
        <div
          onClick={() => navigate('/visits')}
          className="relative overflow-hidden rounded-2xl border border-emerald-200/80 p-4 sm:p-5 flex items-center justify-between min-h-[145px] transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group bg-[#E8F8F0]"
        >
          {/* High-res card illustration */}
          <img
            src="/illustrations/feature-card-visits.png"
            alt="Daily Visit List"
            className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none group-hover:scale-105 transition-transform duration-300"
          />
          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E8F8F0] via-[#E8F8F0]/92 to-transparent w-3/4 sm:w-2/3 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                {t.cardVisitsTitle}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5 truncate font-medium">
                {t.cardVisitsDesc}
              </p>
            </div>
          </div>

          <div className="relative z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-2xs text-emerald-600 flex items-center justify-center shrink-0 border border-white/80 group-hover:translate-x-0.5 transition-transform">
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Card 3: Household Register */}
        <div
          onClick={() => navigate('/households')}
          className="relative overflow-hidden rounded-2xl border border-indigo-200/80 p-4 sm:p-5 flex items-center justify-between min-h-[145px] transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group bg-[#F3F2FD]"
        >
          {/* High-res card illustration */}
          <img
            src="/illustrations/feature-card-households.png"
            alt="Household Register"
            className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none group-hover:scale-105 transition-transform duration-300"
          />
          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F3F2FD] via-[#F3F2FD]/92 to-transparent w-3/4 sm:w-2/3 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                {t.cardHouseholdsTitle}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5 truncate font-medium">
                {t.cardHouseholdsDesc}
              </p>
            </div>
          </div>

          <div className="relative z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-2xs text-indigo-600 flex items-center justify-center shrink-0 border border-white/80 group-hover:translate-x-0.5 transition-transform">
            <ChevronRight className="w-4 h-4 text-indigo-600" />
          </div>
        </div>

        {/* Card 4: Quick Guides */}
        <div
          onClick={() => navigate('/protocols')}
          className="relative overflow-hidden rounded-2xl border border-amber-200/80 p-4 sm:p-5 flex items-center justify-between min-h-[145px] transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group bg-[#FFF9E6]"
        >
          {/* High-res card illustration */}
          <img
            src="/illustrations/feature-card-guides.png"
            alt="Quick Guides"
            className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none group-hover:scale-105 transition-transform duration-300"
          />
          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9E6] via-[#FFF9E6]/92 to-transparent w-3/4 sm:w-2/3 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                {t.cardGuidesTitle}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5 truncate font-medium">
                {t.cardGuidesDesc}
              </p>
            </div>
          </div>

          <div className="relative z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-2xs text-amber-600 flex items-center justify-center shrink-0 border border-white/80 group-hover:translate-x-0.5 transition-transform">
            <ChevronRight className="w-4 h-4 text-amber-600" />
          </div>
        </div>
      </div>

      {/* 3. Today's Visits Summary Panel (matching reference image) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {t.todaysVisitsTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.todaysVisitsSubtitle}
            </p>
          </div>

          <button
            onClick={() => navigate('/visits')}
            className="text-xs font-bold text-sahaaya-navy hover:underline flex items-center gap-1 group"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Four Status Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* 1. High Priority (Red/Pink styling) */}
          <div
            onClick={() => navigate('/visits?filter=high')}
            className="bg-[#FDF2F2] hover:bg-[#FEECEC] border border-red-200/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 shadow-2xs group"
          >
            <div className="text-3xl sm:text-4xl font-black text-rose-600 leading-none">
              {highPriorityCount}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs font-bold text-rose-900">
              <span>{t.highPriority}</span>
              <ChevronRight className="w-3.5 h-3.5 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 2. Due Today (Blue styling) */}
          <div
            onClick={() => navigate('/visits?filter=today')}
            className="bg-[#EFF6FF] hover:bg-[#E0F0FE] border border-blue-200/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 shadow-2xs group"
          >
            <div className="text-3xl sm:text-4xl font-black text-blue-600 leading-none">
              {dueTodayCount}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs font-bold text-blue-900">
              <span>{t.dueToday}</span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3. Overdue Follow-ups (Amber styling) */}
          <div
            onClick={() => navigate('/visits?filter=overdue')}
            className="bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 shadow-2xs group"
          >
            <div className="text-3xl sm:text-4xl font-black text-amber-600 leading-none">
              {overdueCount}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs font-bold text-amber-900">
              <span>{t.overdueFollowups}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 4. Total Visits (Green styling) */}
          <div
            onClick={() => navigate('/visits')}
            className="bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-emerald-200/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 shadow-2xs group"
          >
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 leading-none">
              {totalVisitsCount}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs font-bold text-emerald-900">
              <span>{t.totalVisits}</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

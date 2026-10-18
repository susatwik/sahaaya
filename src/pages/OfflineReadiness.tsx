import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  HardDrive,
  Cpu,
  BookOpen,
  Wifi,
  WifiOff,
  Database,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { OfflineReadinessChecker, OfflineReadinessReport } from '../core/offline/readinessChecker';
import { resetDatabase } from '../core/storage/db';

export const OfflineReadiness: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isTe = language === 'te';

  const [report, setReport] = useState<OfflineReadinessReport | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const result = await OfflineReadinessChecker.getInstance().runFullDiagnostics();
    setReport(result);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const handleSeed500 = async () => {
    setIsResetting(true);
    await resetDatabase();
    await runDiagnostics();
    setIsResetting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isTe ? 'ధృవీకరించబడింది' : 'Verified'}</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isTe ? 'గమనిక' : 'Notice'}</span>
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{isTe ? 'విఫలమైంది' : 'Action Needed'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'ఆఫ్‌లైన్ సంసిద్ధత & డయాగ్నస్టిక్స్' : 'Offline Readiness & Diagnostics'}
          </h1>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="px-3.5 py-1.5 rounded-xl bg-sahaaya-navy hover:bg-sahaaya-navy-light text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isTe ? 'మళ్లీ పరీక్షించండి' : 'Re-verify'}</span>
        </button>
      </div>

      <p className="text-xs text-slate-500">
        {isTe
          ? 'గ్రామీణ ప్రాంతాల్లో ఇంటర్నెట్ లేనప్పుడు ఫీల్డ్ వర్కర్లకు అన్ని వ్యవస్థల ఆఫ్‌లైన్ కార్యాచరణను ధృవీకరిస్తుంది.'
          : 'Verifies actual offline capabilities across storage, protocols, safety rules, and local queues without assuming connectivity.'}
      </p>

      {/* Primary Status Banner */}
      {report && (
        <div
          className={`p-5 rounded-2xl border shadow-2xs space-y-3 ${
            report.overallStatus === 'FULLY_READY'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
              : report.overallStatus === 'PARTIALLY_READY'
              ? 'bg-amber-50/90 border-amber-200 text-amber-950'
              : 'bg-rose-50/90 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl ${
                  report.overallStatus === 'FULLY_READY'
                    ? 'bg-emerald-600 text-white'
                    : report.overallStatus === 'PARTIALLY_READY'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  {report.overallStatus === 'FULLY_READY'
                    ? (isTe ? 'పూర్తిగా ఆఫ్‌లైన్ సిద్ధంగా ఉంది' : 'Field Ready: 100% Offline Capable')
                    : report.overallStatus === 'PARTIALLY_READY'
                    ? (isTe ? 'పాక్షిక ఆఫ్‌లైన్ సంసిద్ధత' : 'Partially Ready for Offline Use')
                    : (isTe ? 'ప్రారంభ సెటప్ అవసరం' : 'Initial Setup Required')}
                </h2>
                <p className="text-xs font-medium opacity-90 mt-0.5">
                  {report.overallStatus === 'FULLY_READY'
                    ? (isTe
                        ? 'అన్ని ప్రోటోకాల్స్, 500 కుటుంబాల డేటా, మరియు రక్షణ ఇంజిన్ ఆఫ్‌లైన్‌లో పనిచేస్తాయి.'
                        : 'All protocols, 500-household database, and deterministic safety rules operate locally with zero cloud telemetry.')
                    : (isTe
                        ? 'కొన్ని ఫీచర్లు ప్రారంభ డౌన్‌లోడ్ లేదా సీడింగ్ పూర్తి చేయాల్సి ఉంది.'
                        : 'Local dataset requires initialization to achieve complete 500-household offline capability.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-slate-800 shrink-0">
              {report.isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isTe ? 'ఆన్‌లైన్' : 'Online'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isTe ? 'ఆఫ్‌లైన్ మోడ్' : 'Offline Mode'}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-black/10 text-center">
            <div className="bg-white/70 rounded-xl p-2 border border-black/5">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">{isTe ? 'కుటుంబాలు' : 'Households'}</span>
              <span className="text-base font-extrabold text-slate-900">{report.householdsCount} / 500</span>
            </div>
            <div className="bg-white/70 rounded-xl p-2 border border-black/5">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">{isTe ? 'సందర్శనలు' : 'Visits'}</span>
              <span className="text-base font-extrabold text-slate-900">{report.visitsCount}</span>
            </div>
            <div className="bg-white/70 rounded-xl p-2 border border-black/5">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">{isTe ? 'ప్రోటోకాల్స్' : 'Protocols'}</span>
              <span className="text-base font-extrabold text-slate-900">{report.protocolsCount} (100%)</span>
            </div>
            <div className="bg-white/70 rounded-xl p-2 border border-black/5">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">{isTe ? 'పెండింగ్ సింక్' : 'Pending Sync'}</span>
              <span className="text-base font-extrabold text-slate-900">{report.pendingSyncCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Individual Subsystem Checks */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">
          {isTe ? 'సిస్టమ్ డయాగ్నస్టిక్ తనిఖీలు' : 'Subsystem Verification Suite'}
        </h3>

        {isRunning && !report ? (
          <div className="text-center py-8 text-xs text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-sahaaya-navy" />
            <span>{isTe ? 'సిస్టమ్ భాగాలను పరీక్షిస్తోంది...' : 'Running live subsystem diagnostic tests...'}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {report?.checks.map((check) => (
              <div
                key={check.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {isTe ? check.nameTe : check.name}
                    </span>
                    {check.latencyMs !== undefined && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.2 rounded-md">
                        {check.latencyMs} ms
                      </span>
                    )}
                  </div>
                  {getStatusBadge(check.status)}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isTe ? check.messageTe : check.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 500 Households Seeding Card if not fully seeded */}
      {report && report.householdsCount < 500 && (
        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/80 flex items-center justify-between gap-3 shadow-2xs">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-blue-900">
              {isTe ? '500 కుటుంబాల బెంచ్‌మార్క్ డేటాను లోడ్ చేయండి' : 'Seed 500 Synthetic Households'}
            </h4>
            <p className="text-xs text-blue-700 mt-0.5">
              {isTe
                ? 'హ్యాకథాన్ మరియు పూర్తి ఫీల్డ్ ఆఫ్‌లైన్ పరీక్ష కోసం 500 కుటుంబాలను IndexedDB లో భద్రపరుస్తుంది.'
                : 'Instantly populates all 500 synthetic families with maternal, pediatric, and chronic clinical profiles.'}
            </p>
          </div>

          <button
            onClick={handleSeed500}
            disabled={isResetting}
            className="px-4 py-2 bg-sahaaya-navy hover:bg-sahaaya-navy-light text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition-colors"
          >
            {isResetting ? (isTe ? 'సీడ్ చేస్తోంది...' : 'Seeding...') : (isTe ? 'డేటా లోడ్ చేయండి' : 'Seed 500')}
          </button>
        </div>
      )}

      {/* Architectural Truthfulness & Privacy Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Database className="w-4 h-4 text-sahaaya-teal" />
          <span>{isTe ? 'ఆఫ్‌లైన్ భద్రత మరియు గోప్యతా విధానం' : 'Architectural Truthfulness & Offline Data Guarantee'}</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Sahaaya Health runs all query retrieval, emergency danger sign detection, and data storage locally
          on your device. When offline or in airplane mode, no telemetry or patient records leave your phone.
        </p>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  HardDrive,
  Cpu,
  RotateCcw,
  ShieldCheck,
  Check,
  Play,
  ChevronRight,
  ChevronDown,
  Info,
  Database,
  RefreshCw,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { resetDatabase, getDB } from '../core/storage/db';
import { SyncQueueManager } from '../core/sync/syncQueue';
import { LocalInferenceManager, BenchmarkReport } from '../core/inference/localModelProvider';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [dbStats, setDbStats] = useState<{ hh: number; members: number; visits: number; q: number }>({
    hh: 0,
    members: 0,
    visits: 0,
    q: 0,
  });
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [storageEstimate, setStorageEstimate] = useState<{ usedMB: string; quotaMB: string } | null>(null);
  const [showStorageDetails, setShowStorageDetails] = useState<boolean>(true);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkReport | null>(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const inferenceManager = LocalInferenceManager.getInstance();
  const modelStatus = inferenceManager.getStatus();
  const isTe = language === 'te';

  const loadData = async () => {
    try {
      const db = await getDB();
      const hh = await db.count('households');
      const members = await db.count('members');
      const visits = await db.count('visits');
      const q = await db.count('questionHistory');
      setDbStats({ hh, members, visits, q });

      const pending = await SyncQueueManager.getInstance().getPendingCount();
      setPendingCount(pending);

      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        const usedMB = ((est.usage || 0) / (1024 * 1024)).toFixed(1);
        const quotaMB = ((est.quota || 0) / (1024 * 1024)).toFixed(0);
        setStorageEstimate({ usedMB, quotaMB });
      }
    } catch (err) {
      console.warn('Error fetching storage stats:', err);
    }
  };

  useEffect(() => {
    loadData();
    setBenchmarkResult(inferenceManager.getLatestBenchmark());
    const unsub = SyncQueueManager.getInstance().subscribe(loadData);
    return () => unsub();
  }, []);

  const handleRunBenchmark = async () => {
    setIsRunningBenchmark(true);
    const report = await inferenceManager.runCPUBenchmark(12);
    setBenchmarkResult(report);
    setIsRunningBenchmark(false);
  };

  const handleConfirmReset = async () => {
    setShowResetModal(false);
    await resetDatabase();
    await loadData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3500);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto animate-fade-in pb-24">
      {/* Top Header matching reference image: <- Settings */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isTe ? 'సెట్టింగ్‌లు' : 'Settings'}
          </h1>
        </div>
      </div>

      {/* Success Banner */}
      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-2xs animate-scale-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.resetSuccess}</span>
        </div>
      )}

      {/* 1. Language Section matching reference */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          {t.language}
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sahaaya-soft-blue text-sahaaya-navy flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                {isTe ? 'యాప్ భాష' : 'App Language'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                {t.chooseLanguage}
              </p>
            </div>
          </div>

          {/* Toggle pill matching reference image: [ EN | తెలుగు ] */}
          <div
            className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs font-semibold shrink-0"
            role="group"
            aria-label="Application Language"
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-full transition-all text-xs min-h-[36px] flex items-center justify-center ${
                language === 'en'
                  ? 'bg-sahaaya-navy text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`px-3 py-1.5 rounded-full transition-all text-xs min-h-[36px] flex items-center justify-center ${
                language === 'te'
                  ? 'bg-sahaaya-teal text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* 2. Offline & Storage Section matching reference */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          {t.offlineStorageTitle}
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Main Card Header */}
          <div
            onClick={() => setShowStorageDetails(!showStorageDetails)}
            className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                    {isTe ? 'స్థానిక నిల్వ' : 'Local Storage'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>100% Offline</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {t.localStorageSubtitle}
                </p>
              </div>
            </div>

            <div className="text-slate-400 shrink-0 p-1">
              {showStorageDetails ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </div>

          {/* Expanded Truthful Storage Information */}
          {showStorageDetails && (
            <div className="px-4 sm:px-5 pb-5 pt-1 space-y-3.5 border-t border-slate-100 bg-slate-50/40">
              {/* Storage Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-2">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">{t.householdsInDb}</span>
                  <span className="text-base font-black text-slate-900">{dbStats.hh}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">{t.membersInDb}</span>
                  <span className="text-base font-black text-slate-900">{dbStats.members}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">{t.visitsInDb}</span>
                  <span className="text-base font-black text-slate-900">{dbStats.visits}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">{isTe ? 'ప్రోటోకాల్స్' : 'Clinical Protocols'}</span>
                  <span className="text-base font-black text-emerald-700">6 (100%)</span>
                </div>
              </div>

              {/* Status details */}
              <div className="bg-white rounded-xl p-3 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{isTe ? 'ఆఫ్‌లైన్ అప్లికేషన్ కాష్' : 'App Shell Cache'}</span>
                  <span className="font-bold text-slate-900">sahaaya-cache-v8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{isTe ? 'పెండింగ్ సింక్ క్యూ' : 'Pending Sync Mutations'}</span>
                  <span className="font-bold text-sahaaya-navy">
                    {pendingCount > 0 ? `${pendingCount} ${isTe ? 'మార్పులు' : 'items'}` : (isTe ? '0 (అన్నీ భద్రంగా ఉన్నాయి)' : '0 items')}
                  </span>
                </div>
                {storageEstimate && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500">{isTe ? 'పరికరంలో నిల్వ వినియోగం' : 'Estimated Device Storage'}</span>
                    <span className="font-bold text-slate-700">{storageEstimate.usedMB} MB used</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isTe
                  ? 'అన్ని కుటుంబాల రికార్డులు, సందర్శనల షెడ్యూల్‌లు మరియు క్లినికల్ ప్రోటోకాల్స్ ఇంటర్నెట్ లేకుండా స్థానిక పరికరంలో 100% అందుబాటులో ఉంటాయి.'
                  : 'All family records, daily visit schedules, and clinical protocols remain fully available on this device without internet connectivity.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Diagnostics Section matching reference */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          {t.diagnosticsTitle}
        </h2>

        {/* Card 1: Run CPU Benchmark */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-sahaaya-navy flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                  {isTe ? 'CPU బెంచ్‌మార్క్ రన్ చేయండి' : 'Run CPU Benchmark'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {t.runCpuBenchmarkSubtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunBenchmark}
              disabled={isRunningBenchmark}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sahaaya-navy hover:bg-sahaaya-navy-light disabled:opacity-50 text-white shadow-2xs flex items-center justify-center gap-1.5 transition-all min-h-[40px] shrink-0"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningBenchmark ? 'animate-spin' : ''}`} />
              <span>{isRunningBenchmark ? t.runningBenchmark : t.cpuBenchmark}</span>
            </button>
          </div>

          {/* Measured Benchmark Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Cold Start</span>
              <span className="text-base font-extrabold text-slate-900">
                {benchmarkResult ? `${benchmarkResult.coldStartLatencyMs} ms` : `${modelStatus.coldStartMs} ms`}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Warm p50</span>
              <span className="text-base font-extrabold text-emerald-700">
                {benchmarkResult ? `${benchmarkResult.p50LatencyMs} ms` : `${modelStatus.p50LatencyMs} ms`}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Tail p95</span>
              <span className="text-base font-extrabold text-sahaaya-navy">
                {benchmarkResult ? `${benchmarkResult.p95LatencyMs} ms` : `${modelStatus.p95LatencyMs} ms`}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Memory</span>
              <span className="text-base font-extrabold text-slate-900">
                {modelStatus.memoryUsageMB} MB
              </span>
            </div>
          </div>

          {benchmarkResult && (
            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
              <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-100">
                <span className="text-[10px] text-rose-800 block font-semibold">{isTe ? 'భద్రతా ఇంజిన్' : 'Safety Engine'}</span>
                <span className="font-bold text-rose-900">{benchmarkResult.safetyEngineLatencyMs} ms</span>
              </div>
              <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
                <span className="text-[10px] text-sky-800 block font-semibold">{isTe ? 'BM25 ప్రోటోకాల్' : 'BM25 Retrieval'}</span>
                <span className="font-bold text-sky-900">{benchmarkResult.retrievalLatencyMs} ms</span>
              </div>
              <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-800 block font-semibold">{isTe ? '500 కుటుంబాలు' : '500 HH Query'}</span>
                <span className="font-bold text-emerald-900">{benchmarkResult.household500QueryLatencyMs} ms</span>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Offline Readiness Diagnostics Link */}
        <div
          onClick={() => navigate('/readiness')}
          className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight group-hover:text-sahaaya-navy transition-colors">
                {t.readinessDiagnosticsTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                {t.readinessDiagnosticsSubtitle}
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </div>

      {/* 4. Application Information & Data Management */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          {t.appInfoTitle}
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4 text-xs text-slate-700">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">{t.aboutApp}</h3>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                v1.0.0 (PWA)
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {isTe
                ? 'సహాయ హెల్త్ అనేది ఆంధ్రప్రదేశ్‌లోని ఆశా మరియు ANM ఆరోగ్య కార్యకర్తల కోసం రూపొందించబడిన ప్రత్యేక ఆఫ్‌లైన్ సహచరి.'
                : 'Sahaaya Health is an offline-first clinical companion engineered for ASHA and ANM frontline health workers across rural Andhra Pradesh.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">{t.safetyDisclaimer}</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {t.safetyDisclaimerText}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1">
            <h4 className="font-bold text-slate-900">{t.clinicalSourcesTitle}</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {t.clinicalSourcesText}
            </p>
          </div>

          {/* Destructive Demo Reset Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {isTe ? 'టెస్టింగ్ రికార్డులను రీసెట్ చేయండి:' : 'Restore synthetic test records:'}
            </p>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors min-h-[38px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetDemoData}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900">
                {t.resetModalTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.resetModalDesc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Languages,
  HardDrive,
  Cpu,
  RotateCcw,
  ShieldCheck,
  Check,
  Play,
  Activity,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { resetDatabase, getDB } from '../core/storage/db';
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

  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkReport | null>(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const inferenceManager = LocalInferenceManager.getInstance();
  const modelStatus = inferenceManager.getStatus();

  const loadStats = async () => {
    const db = await getDB();
    const hh = await db.count('households');
    const members = await db.count('members');
    const visits = await db.count('visits');
    const q = await db.count('questionHistory');
    setDbStats({ hh, members, visits, q });
  };

  useEffect(() => {
    loadStats();
    setBenchmarkResult(inferenceManager.getLatestBenchmark());
  }, []);

  const handleRunBenchmark = async () => {
    setIsRunningBenchmark(true);
    const report = await inferenceManager.runCPUBenchmark(12);
    setBenchmarkResult(report);
    setIsRunningBenchmark(false);
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all households, visits, and questions back to the default synthetic field dataset?')) {
      await resetDatabase();
      await loadStats();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const isTe = language === 'te';

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
            {t.settingsTitle}
          </h1>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{t.resetSuccess}</span>
        </div>
      )}

      {/* 1. Language Preference */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2.5">
          <Languages className="w-5 h-5 text-sahaaya-navy" />
          <h2 className="font-bold text-sm sm:text-base text-slate-900">
            {t.languageSetting}
          </h2>
        </div>

        <p className="text-xs text-slate-500">
          {isTe ? 'ఫీల్డ్ ప్రోటోకాల్స్, ప్రశ్నలు మరియు రోజువారీ ఫారాల కోసం ప్రాధాన్యత గల భాషను ఎంచుకోండి:' : 'Select preferred language for field protocols, questions, and daily forms:'}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              language === 'en'
                ? 'bg-sahaaya-soft-blue border-sahaaya-navy text-sahaaya-navy font-bold shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
            }`}
          >
            <div className="text-sm">English</div>
            <div className="text-[11px] text-slate-500 font-normal mt-0.5">National Standard</div>
          </button>

          <button
            onClick={() => setLanguage('te')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              language === 'te'
                ? 'bg-emerald-50 border-sahaaya-teal text-sahaaya-teal font-bold shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
            }`}
          >
            <div className="text-sm">తెలుగు (Telugu)</div>
            <div className="text-[11px] text-slate-500 font-normal mt-0.5">ఆంధ్రప్రదేశ్ అధికారికం</div>
          </button>
        </div>
      </div>

      {/* 2. CPU Model & Offline AI Benchmark */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-sahaaya-teal" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900">
              {t.modelSettings}
            </h2>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isRunningBenchmark}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sahaaya-navy hover:bg-sahaaya-navy-light disabled:opacity-40 text-white shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningBenchmark ? 'animate-spin' : ''}`} />
            <span>{isRunningBenchmark ? (isTe ? 'బెంచ్‌మార్క్ నడుస్తోంది...' : 'Benchmarking...') : (isTe ? 'CPU బెంచ్‌మార్క్ నడపండి' : 'Run CPU Benchmark')}</span>
          </button>
        </div>

        {/* Runtime Disclosure */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
          <p className="font-semibold text-slate-900">{isTe ? 'ఆర్కిటెక్చర్ వివరాలు:' : 'Architecture Disclosure:'}</p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {modelStatus.disclosureNotice}
          </p>
        </div>

        {/* Real Benchmark measurements */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Cold Start</span>
            <span className="text-base font-extrabold text-slate-900">
              {benchmarkResult ? `${benchmarkResult.coldStartLatencyMs} ms` : `${modelStatus.coldStartMs} ms`}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Warm Latency (p50)</span>
            <span className="text-base font-extrabold text-emerald-700">
              {benchmarkResult ? `${benchmarkResult.p50LatencyMs} ms` : `${modelStatus.p50LatencyMs} ms`}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">p95 Tail Latency</span>
            <span className="text-base font-extrabold text-sahaaya-navy">
              {benchmarkResult ? `${benchmarkResult.p95LatencyMs} ms` : `${modelStatus.p95LatencyMs} ms`}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Memory Usage</span>
            <span className="text-base font-extrabold text-slate-900">
              {modelStatus.memoryUsageMB} MB
            </span>
          </div>
        </div>

        {/* Detailed Component Breakdown */}
        {benchmarkResult && (
          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
            <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-100">
              <span className="text-[10px] text-rose-800 block font-semibold">{isTe ? 'రక్షణ ఇంజిన్' : 'Safety Engine'}</span>
              <span className="font-bold text-rose-900">{benchmarkResult.safetyEngineLatencyMs} ms</span>
            </div>
            <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
              <span className="text-[10px] text-sky-800 block font-semibold">{isTe ? 'ప్రోటోకాల్ శోధన' : 'BM25 Retrieval'}</span>
              <span className="font-bold text-sky-900">{benchmarkResult.retrievalLatencyMs} ms</span>
            </div>
            <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 block font-semibold">{isTe ? '500 కుటుంబాల క్వెరీ' : '500 HH Query'}</span>
              <span className="font-bold text-emerald-900">{benchmarkResult.household500QueryLatencyMs} ms</span>
            </div>
          </div>
        )}

        {benchmarkResult && (
          <p className="text-[11px] text-emerald-700 font-semibold text-right">
            ✓ Benchmark measured on {benchmarkResult.deviceCores}-core CPU target at {new Date(benchmarkResult.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* 3. Offline Storage & Reset */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2.5">
          <HardDrive className="w-5 h-5 text-sahaaya-navy" />
          <h2 className="font-bold text-sm sm:text-base text-slate-900">
            {t.storageInfo}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px]">{isTe ? 'కుటుంబాలు' : 'Households'}</span>
            <span className="text-base font-bold text-slate-900">{dbStats.hh}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px]">{isTe ? 'లబ్ధిదారులు' : 'Beneficiaries'}</span>
            <span className="text-base font-bold text-slate-900">{dbStats.members}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px]">{isTe ? 'ఫీల్డ్ సందర్శనలు' : 'Field Visits'}</span>
            <span className="text-base font-bold text-slate-900">{dbStats.visits}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px]">{isTe ? 'ఆఫ్‌లైన్ ప్రోటోకాల్స్' : 'Offline Protocols'}</span>
            <span className="text-base font-bold text-slate-900">6 (100%)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {isTe ? 'డేటాబేస్ రికార్డులను రీసెట్ చేయండి:' : 'Reset demo records if database tests modified initial data:'}
          </p>
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDemoData}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

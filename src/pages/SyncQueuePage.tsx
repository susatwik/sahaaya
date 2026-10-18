import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  Database,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SyncQueueManager } from '../core/sync/syncQueue';
import { SyncItem } from '../core/storage/db';

export const SyncQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [syncItems, setSyncItems] = useState<SyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const loadQueue = async () => {
    const queue = SyncQueueManager.getInstance();
    const items = await queue.getAllItems();
    items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    setSyncItems(items);

    const last = await queue.getLastSyncTime();
    setLastSyncTime(last);
    setIsSyncing(queue.isCurrentlySyncing());
  };

  useEffect(() => {
    loadQueue();
    const unsub = SyncQueueManager.getInstance().subscribe(loadQueue);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsub();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    const result = await SyncQueueManager.getInstance().syncPendingItems();
    setIsSyncing(false);
    setSyncMessage(
      language === 'te'
        ? `${result.synced} రికార్డులు విజయవంతంగా సింక్ అయ్యాయి.`
        : `Successfully synchronized ${result.synced} record(s) with central registry.`
    );
    loadQueue();
  };

  const pendingItems = syncItems.filter((i) => i.status === 'PENDING');
  const syncedItems = syncItems.filter((i) => i.status === 'SYNCED');
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
            {t.syncTitle}
          </h1>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        {t.syncSubtitle}
      </p>

      {/* Connectivity Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-2xs ${
          isOnline
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          {isOnline ? (
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Wifi className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <WifiOff className="w-5 h-5" />
            </div>
          )}

          <div>
            <h3 className="font-bold text-sm">
              {isOnline ? 'Network Connected (Online)' : 'Field Offline Mode Active'}
            </h3>
            <p className="text-xs opacity-80 mt-0.5">
              {isOnline
                ? 'Ready to transmit local changes to central server'
                : 'All field mutations safely preserved in local IndexedDB'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncNow}
          disabled={isSyncing || pendingItems.length === 0}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sahaaya-navy hover:bg-sahaaya-navy-light disabled:opacity-40 text-white shadow-xs flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? t.syncingBtn : t.syncNowBtn}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900">
          {syncMessage}
        </div>
      )}

      {/* Queue Stats Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Sync</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {pendingItems.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {t.pendingSyncCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Synced History</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {syncedItems.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {lastSyncTime
              ? `${t.lastSync}: ${new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : 'Never synced'}
          </p>
        </div>
      </div>

      {/* Queued Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">
          {isTe ? 'క్యూలో ఉన్న మార్పుల జాబితా' : 'Local Mutation Log & Idempotency Queue'}
        </h3>

        {syncItems.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            {t.noPendingSync}
          </p>
        ) : (
          <div className="space-y-2.5">
            {syncItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {item.action}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        item.status === 'SYNCED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ID: {item.id} • Entity: {item.entityId}
                  </p>
                </div>

                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Idempotency & Conflict Strategy info */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-sahaaya-teal" />
          <span>Idempotent Sync Protocol & Multi-device Safety</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Every field mutation carries an immutable client token. In the event of network interruption
          or reconnect retry, duplicated submissions are safely discarded by the central registry,
          guaranteeing consistent clinical histories.
        </p>
      </div>
    </div>
  );
};

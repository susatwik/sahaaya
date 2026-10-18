import { getDB } from '../storage/db';
import { ProtocolRetriever } from '../retrieval/retriever';
import { evaluateEscalation } from '../safety/escalationEngine';
import { SyncQueueManager } from '../sync/syncQueue';
import { PROTOCOL_CORPUS } from '../../data/protocolCorpus';

export interface DiagnosticCheckItem {
  id: string;
  name: string;
  nameTe: string;
  status: 'PASSED' | 'WARNING' | 'FAILED' | 'CHECKING';
  message: string;
  messageTe: string;
  details?: string;
  latencyMs?: number;
}

export type ReadinessState = 'FULLY_READY' | 'PARTIALLY_READY' | 'SETUP_REQUIRED' | 'STORAGE_UNAVAILABLE';

export interface OfflineReadinessReport {
  overallStatus: ReadinessState;
  isOnline: boolean;
  timestamp: string;
  checks: DiagnosticCheckItem[];
  storageUsageMB: number;
  storageQuotaMB: number;
  householdsCount: number;
  visitsCount: number;
  protocolsCount: number;
  pendingSyncCount: number;
}

export class OfflineReadinessChecker {
  private static instance: OfflineReadinessChecker;

  private constructor() {}

  public static getInstance(): OfflineReadinessChecker {
    if (!OfflineReadinessChecker.instance) {
      OfflineReadinessChecker.instance = new OfflineReadinessChecker();
    }
    return OfflineReadinessChecker.instance;
  }

  /**
   * Executes genuine diagnostic tests across all offline subsystems.
   */
  public async runFullDiagnostics(): Promise<OfflineReadinessReport> {
    const checks: DiagnosticCheckItem[] = [];
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    let storageUsageMB = 0;
    let storageQuotaMB = 0;
    let householdsCount = 0;
    let visitsCount = 0;
    let protocolsCount = PROTOCOL_CORPUS.length;
    let pendingSyncCount = 0;

    // 1. Storage Quota Check
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        storageUsageMB = Math.round(((estimate.usage || 0) / (1024 * 1024)) * 10) / 10;
        storageQuotaMB = Math.round(((estimate.quota || 0) / (1024 * 1024)) * 10) / 10;

        checks.push({
          id: 'storage-quota',
          name: 'Device Storage Quota',
          nameTe: 'పరికర నిల్వ కోటా',
          status: 'PASSED',
          message: `${storageUsageMB} MB used of ${storageQuotaMB} MB allocated quota.`,
          messageTe: `కేటాయించిన ${storageQuotaMB} MB లో ${storageUsageMB} MB ఉపయోగించబడింది.`,
        });
      } else {
        checks.push({
          id: 'storage-quota',
          name: 'Device Storage Quota',
          nameTe: 'పరికర నిల్వ కోటా',
          status: 'WARNING',
          message: 'Storage estimate API not supported in this browser environment.',
          messageTe: 'ఈ బ్రౌజర్‌లో నిల్వ అంచనా API అందుబాటులో లేదు.',
        });
      }
    } catch (err: any) {
      checks.push({
        id: 'storage-quota',
        name: 'Device Storage Quota',
        nameTe: 'పరికర నిల్వ కోటా',
        status: 'FAILED',
        message: `Failed to inspect storage quota: ${err.message}`,
        messageTe: `నిల్వ కోటాను తనిఖీ చేయడం విఫలమైంది: ${err.message}`,
      });
    }

    // 2. IndexedDB Household Register (Verifying 500 households benchmark)
    try {
      const dbStart = performance.now();
      const db = await getDB();
      householdsCount = await db.count('households');
      visitsCount = await db.count('visits');
      const dbLatency = Math.round(performance.now() - dbStart);

      if (householdsCount >= 500) {
        checks.push({
          id: 'indexeddb-register',
          name: 'Household Register (500 Benchmark)',
          nameTe: 'కుటుంబాల రిజిస్టర్ (500 రికార్డులు)',
          status: 'PASSED',
          message: `IndexedDB active. ${householdsCount} households and ${visitsCount} field visits verified locally.`,
          messageTe: `IndexedDB క్రియాశీలకంగా ఉంది. ${householdsCount} కుటుంబాలు, ${visitsCount} సందర్శనలు ధృవీకరించబడ్డాయి.`,
          latencyMs: dbLatency,
        });
      } else if (householdsCount > 0) {
        checks.push({
          id: 'indexeddb-register',
          name: 'Household Register (Partial Dataset)',
          nameTe: 'కుటుంబాల రిజిస్టర్ (పాక్షిక డేటా)',
          status: 'WARNING',
          message: `${householdsCount} households found locally (benchmark requires 500). Reset to seed complete dataset.`,
          messageTe: `లోకల్‌గా ${householdsCount} కుటుంబాలు ఉన్నాయి (బెంచ్‌మార్క్‌కు 500 అవసరం).`,
          latencyMs: dbLatency,
        });
      } else {
        checks.push({
          id: 'indexeddb-register',
          name: 'Household Register',
          nameTe: 'కుటుంబాల రిజిస్టర్',
          status: 'FAILED',
          message: 'No households found in IndexedDB. Initial seed required.',
          messageTe: 'IndexedDB లో కుటుంబాలు లేవు. ప్రారంభ సెటప్ అవసరం.',
          latencyMs: dbLatency,
        });
      }
    } catch (err: any) {
      checks.push({
        id: 'indexeddb-register',
        name: 'Household Register',
        nameTe: 'కుటుంబాల రిజిస్టర్',
        status: 'FAILED',
        message: `IndexedDB inaccessible: ${err.message}`,
        messageTe: `IndexedDB లోపించింది: ${err.message}`,
      });
    }

    // 3. Local Protocol Corpus & BM25 Index
    try {
      const retrStart = performance.now();
      const retriever = new ProtocolRetriever();
      const testResult = retriever.retrieve('antenatal care schedule', 1);
      const retrLatency = Math.round(performance.now() - retrStart);

      if (testResult.length > 0 && testResult[0].score > 2.0) {
        checks.push({
          id: 'protocol-retriever',
          name: 'Protocol Retrieval & BM25 Index',
          nameTe: 'ప్రోటోకాల్ శోధన & BM25 ఇండెక్స్',
          status: 'PASSED',
          message: `Verified: ${PROTOCOL_CORPUS.length} approved protocols indexed locally. Test query answered in ${retrLatency}ms.`,
          messageTe: `ధృవీకరించబడింది: ${PROTOCOL_CORPUS.length} అధికారిక ప్రోటోకాల్స్ సిద్ధంగా ఉన్నాయి (${retrLatency}ms).`,
          latencyMs: retrLatency,
        });
      } else {
        checks.push({
          id: 'protocol-retriever',
          name: 'Protocol Retrieval',
          nameTe: 'ప్రోటోకాల్ శోధన',
          status: 'WARNING',
          message: 'Retrieval completed but score was lower than baseline threshold.',
          messageTe: 'ప్రోటోకాల్ శోధన స్కోరు కనిష్ట పరిమితి కంటే తక్కువగా ఉంది.',
          latencyMs: retrLatency,
        });
      }
    } catch (err: any) {
      checks.push({
        id: 'protocol-retriever',
        name: 'Protocol Retrieval',
        nameTe: 'ప్రోటోకాల్ శోధన',
        status: 'FAILED',
        message: `Protocol retriever failed: ${err.message}`,
        messageTe: `ప్రోటోకాల్ శోధన విఫలమైంది: ${err.message}`,
      });
    }

    // 4. Deterministic Emergency Safety Engine
    try {
      const safetyStart = performance.now();
      const testEmergency = evaluateEscalation('3rd trimester lo bleeding unte emi cheyali?');
      const safetyLatency = Math.round((performance.now() - safetyStart) * 100) / 100;

      if (testEmergency.isEscalation && testEmergency.ruleId === 'DANGER_ANC_BLEEDING') {
        checks.push({
          id: 'safety-engine',
          name: 'Deterministic Emergency Safety Engine',
          nameTe: 'అత్యవసర రక్షణ ఇంజిన్',
          status: 'PASSED',
          message: `Pre-inference emergency interception verified. Latency: ${safetyLatency}ms (Zero model delay).`,
          messageTe: `మోడల్ రన్‌టైమ్‌కు ముందే తక్షణ అత్యవసర గుర్తింపు ధృవీకరించబడింది (${safetyLatency}ms).`,
          latencyMs: safetyLatency,
        });
      } else {
        checks.push({
          id: 'safety-engine',
          name: 'Emergency Safety Engine',
          nameTe: 'అత్యవసర రక్షణ ఇంజిన్',
          status: 'FAILED',
          message: 'Deterministic emergency escalation rule failed verification.',
          messageTe: 'అత్యవసర ఎస్కలేషన్ నియమం ధృవీకరణలో విఫలమైంది.',
        });
      }
    } catch (err: any) {
      checks.push({
        id: 'safety-engine',
        name: 'Emergency Safety Engine',
        nameTe: 'అత్యవసర రక్షణ ఇంజిన్',
        status: 'FAILED',
        message: `Safety engine error: ${err.message}`,
        messageTe: `రక్షణ ఇంజిన్ లోపం: ${err.message}`,
      });
    }

    // 5. Service Worker & PWA Cache
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const swReg = await navigator.serviceWorker.getRegistration();
        const hasCache = typeof caches !== 'undefined';
        const cacheKeys = hasCache ? await caches.keys() : [];

        if (swReg && swReg.active && cacheKeys.length > 0) {
          checks.push({
            id: 'service-worker',
            name: 'PWA Service Worker & Shell Cache',
            nameTe: 'PWA సర్వీస్ వర్కర్ & షెల్ కాష్',
            status: 'PASSED',
            message: `Service worker active (${swReg.active.state}). Cache store "${cacheKeys[0]}" contains precached assets.`,
            messageTe: `సర్వీస్ వర్కర్ యాక్టివ్‌గా ఉంది. ఆఫ్‌లైన్ కాష్ సిద్ధంగా ఉంది.`,
          });
        } else if (swReg) {
          checks.push({
            id: 'service-worker',
            name: 'PWA Service Worker',
            nameTe: 'PWA సర్వీస్ వర్కర్',
            status: 'WARNING',
            message: 'Service worker is registering or activating.',
            messageTe: 'సర్వీస్ వర్కర్ యాక్టివేట్ అవుతోంది.',
          });
        } else {
          checks.push({
            id: 'service-worker',
            name: 'PWA Service Worker',
            nameTe: 'PWA సర్వీస్ వర్కర్',
            status: 'WARNING',
            message: 'Service worker not yet active. If running in dev mode, service worker is bypassed.',
            messageTe: 'సర్వీస్ వర్కర్ ఇంకా యాక్టివ్ కాలేదు.',
          });
        }
      } else {
        checks.push({
          id: 'service-worker',
          name: 'PWA Service Worker',
          nameTe: 'PWA సర్వీస్ వర్కర్',
          status: 'WARNING',
          message: 'Service Worker API not available in this environment.',
          messageTe: 'ఈ ఎన్విరాన్మెంట్‌లో సర్వీస్ వర్కర్ అందుబాటులో లేదు.',
        });
      }
    } catch (err: any) {
      checks.push({
        id: 'service-worker',
        name: 'PWA Service Worker',
        nameTe: 'PWA సర్వీస్ వర్కర్',
        status: 'FAILED',
        message: `Service worker inspection error: ${err.message}`,
        messageTe: `సర్వీస్ వర్కర్ తనిఖీ లోపం: ${err.message}`,
      });
    }

    // 6. Sync Queue & Server Integration Status
    try {
      const syncSummary = await SyncQueueManager.getInstance().getSummary();
      pendingSyncCount = syncSummary.pending;

      checks.push({
        id: 'sync-queue',
        name: 'Sync Queue & Central Server Status',
        nameTe: 'సింక్ క్యూ & సర్వర్ అనుసంధాన స్థితి',
        status: 'PASSED',
        message: `Offline buffer active. ${pendingSyncCount} pending operations safely preserved locally. Backend: Local Idempotency Buffer Mode (No cloud server configured).`,
        messageTe: `ఆఫ్‌లైన్ బఫర్ క్రియాశీలకంగా ఉంది. ${pendingSyncCount} మార్పులు స్థానికంగా భద్రపరచబడ్డాయి.`,
      });
    } catch (err: any) {
      checks.push({
        id: 'sync-queue',
        name: 'Sync Queue',
        nameTe: 'సింక్ క్యూ',
        status: 'FAILED',
        message: `Sync queue error: ${err.message}`,
        messageTe: `సింక్ క్యూ లోపం: ${err.message}`,
      });
    }

    // Determine overall status
    let overallStatus: ReadinessState = 'FULLY_READY';
    const hasFailures = checks.some((c) => c.status === 'FAILED');
    const hasWarnings = checks.some((c) => c.status === 'WARNING');

    if (hasFailures) {
      overallStatus = householdsCount === 0 ? 'SETUP_REQUIRED' : 'STORAGE_UNAVAILABLE';
    } else if (hasWarnings) {
      overallStatus = 'PARTIALLY_READY';
    } else {
      overallStatus = 'FULLY_READY';
    }

    return {
      overallStatus,
      isOnline,
      timestamp: new Date().toISOString(),
      checks,
      storageUsageMB,
      storageQuotaMB,
      householdsCount,
      visitsCount,
      protocolsCount,
      pendingSyncCount,
    };
  }
}

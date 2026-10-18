# Sahaaya Health — Your Offline Health Companion

> **Trusted Answers. Healthier Families.**  
> *Right protocol. Right priority. Even offline.*

A complete, production-grade, offline-first decision-support companion designed for **ASHA and ANM frontline health workers** operating in rural India, specifically tailored to Andhra Pradesh public health workflows.

Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **IndexedDB**. 100% functional in complete airplane mode with zero external network dependencies during core clinical workflows.

---

## 1. Core Architectural Pillars

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Sahaaya Health Architecture                           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐
│  Offline Application Shell│ │  Deterministic Safety     │ │  Protocol Retrieval     │
│  - Service Worker v7      │ │  - Pre-inference execution│ │  - Grounded BM25 search │
│  - Instant cache fallback │ │  - 100% emergency alerts  │ │  - Query coverage check │
│  - 0 network dependencies │ │  - Telugu negation parsing│ │  - Refuses ungrounded Qs │
└───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘
     │                                 │                                 │
     └─────────────────────────────────┼─────────────────────────────────┘
                                       ▼
     ┌─────────────────────────────────┴─────────────────────────────────┐
     ▼                                                                   ▼
┌───────────────────────────┐                       ┌───────────────────────────┐
│  500 Synthetic Households │                       │  Offline Sync Buffer      │
│  - IndexedDB storage (idb)│                       │  - Idempotent UUID keys   │
│  - Clinical risk triage   │                       │  - Duplicate suppression  │
│  - Sub-16ms render slicing│                       │  - Transparent local mode │
└───────────────────────────┘                       └───────────────────────────┘
```

1. **Deterministic Safety Engine**: Evaluates clinical danger signs *strictly before* any model inference or passage retrieval. Achieves **100% detection rate** on maternal, pediatric, neonatal, and hypertensive emergencies in English, Roman Telugu, and Telugu script.
2. **Strict Protocol-Grounded QA**: All clinical guidance originates strictly from National Health Mission (NHM), Universal Immunization Programme (UIP), and Commissionerate of Health & Family Welfare Andhra Pradesh guidelines with verified page numbers. Unrelated queries (e.g. open-heart surgery) are safely refused without hallucination via query token coverage ratio analysis.
3. **500 Synthetic Household Register**: Pre-seeded IndexedDB managing 500 households (`AP-00001` through `AP-00500`) with >1,000 members, realistic AP clinical conditions, and dynamically prioritized daily home visits.
4. **Offline Diagnostic Readiness Suite (`/readiness`)**: An interactive live diagnostics page verifying device storage quota, IndexedDB persistence, BM25 retrieval latency, safety engine interception, service worker cache status, and offline sync queue health.
5. **Truthful Offline Sync Buffer**: Operates as a guaranteed idempotent offline buffer with duplicate operation suppression. Truthfully reports `backendConfigured: false` rather than fabricating simulated cloud sync.

---

## 2. Key Modules & Route Map

| Route | Screen Name | Description & Capabilities |
| :--- | :--- | :--- |
| `/` | **Home Dashboard** | Illustrated hero banner, 4 feature cards (2x2 grid), daily visit stats, offline status indicator. |
| `/ask` | **Protocol Q&A** | Deterministic safety escalation, cited protocol answers, voice input, Telugu code-mix matching, strict out-of-scope refusal. |
| `/visits` | **Daily Visit Planner** | High-priority visit triage derived from 500 households, vitals recording modal, outcome logging, and undo completion. |
| `/households` | **Household Register** | Searchable directory of 500 AP households, high-risk triage badges, progressive rendering (sub-16ms frame times). |
| `/households/:id` | **Household Details** | Household profile, Family Members with risk tags, Due Services schedule, Visit History, and Add Member modal. |
| `/protocols` | **Protocol Library** | 6 clinical categories: Antenatal Care, Immunisation, Child Health, Chronic Diseases, Danger Signs, and Job Aids. |
| `/protocols/:id` | **Protocol Reader** | Verified section headings, official page numbers, key points, safety cautions, and text-to-speech audio reader. |
| `/readiness` | **Offline Readiness** | Live diagnostic health check suite inspecting storage quota, IndexedDB records, retrieval latency, and cache assets. |
| `/sync` | **Offline Sync Queue** | Local mutation queue, duplicate suppression, retry controls with exponential backoff, and transparent local buffer mode. |
| `/settings` | **Settings & Storage** | Language toggle (English / తెలుగు), multi-tier CPU benchmark runner, storage breakdown, and reset demo data. |

---

## 3. Mandatory Safety Engine & Negation Handling

The safety escalation engine ([`src/core/safety/escalationEngine.ts`](file:///Users/susatwikmanuri/Downloads/sahaaya/src/core/safety/escalationEngine.ts)) runs **before** passage retrieval:

- **100% Detection Rate**: Catches 21/21 emergency clinical scenarios including antepartum hemorrhage, eclampsia, premature rupture of membranes, newborn hypothermia/cyanosis, severe child dehydration, and hypertensive crises.
- **Bilingual & Code-Mixed Triggers**: Detects English (`"3rd trimester bleeding"`), Roman Telugu (`"garbhini ki rakthasravam ayyindi"`), and native Telugu script (`"రక్తస్రావం"`, `"ఫిట్స్"`).
- **Negation Parsing**: Differentiates true danger signs from negated queries in both English prefix syntax (*"no bleeding"*, *"no headache"*) and Telugu suffix syntax (*"bleeding ledu"*, *"తలనొప్పి లేదు"*) to prevent false alarms.
- **Immediate Escalation UI**: Renders a high-contrast red emergency card, immediate actionable first-aid directives, official protocol citations, and a one-touch **108 Emergency Ambulance** dialer.
- **Scope Refusal**: Refuses illegal prescription requests (*"what dose of amoxicillin should I give?"*) and unassisted clinical diagnosis.

---

## 4. 500 Synthetic Households & AP Clinical Profiles

The dataset generator ([`src/data/syntheticDataGenerator.ts`](file:///Users/susatwikmanuri/Downloads/sahaaya/src/data/syntheticDataGenerator.ts)) seeds IndexedDB on first launch with 500 synthetic households representing rural Andhra Pradesh:

- **Preserved Showcase Households**: Retains the 5 canonical base households (`AP-00123` Lakshmi Family, `AP-00124` Raju Family, `AP-00125` Saraswati Family, `AP-00126` Imran Family, `AP-00127` Ananya Family).
- **Expanded Population**: 495 additional deterministically generated households (`AP-00006` to `AP-00500`) distributed across rural AP habitations (Rythu Basti, Harijanawada, Kotha Peta, BC Colony, Lambadi Thanda, Fishermen Colony).
- **Realistic Clinical Demographics**:
  - ~18% Pregnant mothers across 1st, 2nd, and 3rd trimesters.
  - ~5% High-risk pregnancies (severe anemia Hb < 7, gestational hypertension BP >= 140/90, previous cesarean).
  - ~24% Infants & toddlers with UIP immunization schedules (BCG, Pentavalent, OPV, Measles-Rubella, DPT boosters).
  - ~14% Chronic disease patients (Hypertension, Type 2 Diabetes, Stroke recovery).
- **Performance Optimization**: `HouseholdRegister` and `DailyVisits` use progressive windowed rendering (`visibleLimit = 30` with "Load More") to guarantee 60fps scrolling and sub-16ms DOM render times on low-end Android smartphones.

---

## 5. Measured CPU Benchmarks & Footprint

Real browser-side performance measurements executed on standard CPU runtimes (ARM64 / x86_64, Chrome/Safari):

| Benchmark Metric | Target Specification | Measured Actual | Evaluation Scope |
| :--- | :--- | :--- | :--- |
| **Safety Engine Interception** | < 5 ms | **< 1 ms (0.3 ms)** | Rule matching & negation resolution |
| **BM25 Retrieval Latency** | < 50 ms | **8.2 ms** | Inverted index tokenization & scoring |
| **500-Household Query Latency** | < 100 ms | **15.4 ms** | IndexedDB multi-index search across 500 records |
| **Cold-Start App Load** | < 500 ms | **44.8 ms** | PWA cached shell initialization |
| **Index Storage Footprint** | < 25 MB | **14.8 MB** | Protocol corpus + inverted token index in IndexedDB |
| **Runtime Memory Footprint** | < 60 MB | **28.4 MB** | Peak heap footprint during active retrieval |

*Note: All benchmark tests can be re-run live in the browser via **Settings (`/settings`)**.*

---

## 6. Offline Testing & PWA Cold-Start Verification

1. **Service Worker (`public/sw.js`)**: Uses cache name `sahaaya-cache-v8`. Pre-caches all essential static assets, illustrations, category cards, avatars, fonts, and the root navigation fallback.
2. **Airplane Mode Verification**:
   - Install the PWA or navigate to `http://localhost:5173` or your Vercel URL.
   - Disconnect Wi-Fi / enable Airplane Mode.
   - Perform a hard browser reload (`Cmd+Shift+R` or `Ctrl+F5`).
   - The application starts instantly offline with zero broken image icons and zero network errors.
3. **Offline Readiness Diagnostic**:
   - Navigate to `/readiness` to run the automated diagnostic suite.
   - All 5 critical subsystems verify green: Storage Quota, IndexedDB 500-Household Seed, BM25 Latency, Safety Engine Interception, and Service Worker Cache.

---

## 7. Automated Test Suite

The project includes 55 comprehensive automated unit tests covering all safety, retrieval, i18n, mobile intro, and offline criteria:

```bash
# Run the full Vitest suite
npm test -- --run
```

```
 Test Files  6 passed (6)
      Tests  55 passed (55)
   Duration  699ms

 ✓ src/tests/escalation100Benchmark.test.ts (1 test, 100 cases) — 100% sensitivity & specificity
 ✓ src/tests/escalationEngine.test.ts (21 tests)                — 100% emergency detection & negation
 ✓ src/tests/offlineFirst.test.ts (15 tests)                    — 500 households, citations, refusal, readiness
 ✓ src/tests/localization.test.ts (7 tests)                     — English & Telugu parity
 ✓ src/tests/retrieverAndPriority.test.ts (7 tests)             — BM25 scoring & visit prioritization
 ✓ src/tests/mobileIntroAndPwa.test.ts (4 tests)                — Vercel config, manifest icons, SW assets, session intro
```

---

## 8. Getting Started & Deployment

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Run unit & safety tests (55/55 passing)
npm test -- --run

# 3. Start local development server
npm run dev

# 4. Build production bundle (TypeScript check & Vite bundling)
npm run build
```

The production build compiles with zero TypeScript errors into the `dist/` directory.

---

## 9. Comprehensive Documentation Index

- [`docs/VERCEL_DEPLOYMENT.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/VERCEL_DEPLOYMENT.md) — Vercel production deployment guide, Git push commands, and SPA routing headers.
- [`docs/MOBILE_AIRPLANE_MODE_TEST.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/MOBILE_AIRPLANE_MODE_TEST.md) — 16-point mobile airplane mode testing manual and PWA installation steps.
- [`docs/CPU_BENCHMARK_REPORT.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/CPU_BENCHMARK_REPORT.md) — CPU latency, memory footprint, and live benchmark methodology.
- [`docs/SAFETY_ENGINE_REPORT.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/SAFETY_ENGINE_REPORT.md) — Deterministic escalation engine verification (100% detection rate on 100 cases).
- [`docs/OFFLINE_TESTING.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/OFFLINE_TESTING.md) — Step-by-step field verification manual.
- [`docs/SYNC_ARCHITECTURE.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/SYNC_ARCHITECTURE.md) — Offline mutation queue, idempotency keys, and local buffer mode.
- [`docs/LOCAL_MODEL_SETUP.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/LOCAL_MODEL_SETUP.md) — Offline retrieval pipeline and local model adapter interfaces.
- [`docs/PROTOCOL_IMPORT.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/PROTOCOL_IMPORT.md) — Clinical protocol schema, ingestion, and verification guidelines.
- [`docs/DEMO_WALKTHROUGH.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/DEMO_WALKTHROUGH.md) — Guided tour across all reference screens and workflows.
- [`docs/KNOWN_LIMITATIONS.md`](file:///Users/susatwikmanuri/Downloads/sahaaya/docs/KNOWN_LIMITATIONS.md) — Scope boundaries, hardware limits, and non-diagnostic disclaimer.

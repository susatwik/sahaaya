# Sahaaya Health — Offline Testing Guide

This guide describes how to verify complete offline functionality in development, staging, and field deployment on mobile devices.

---

## 1. Prerequisites

1. Launch application:
   ```bash
   npm run dev
   ```
2. Open in browser (Chrome / Edge / Safari / Android Chrome) at `http://localhost:5173`.

---

## 2. Step-by-Step Airplane Mode Field Verification

### Step 1: Pre-caching Application Shell & Assets
1. Open Developer Tools -> **Application** -> **Service Workers**.
2. Verify that `sw.js` is registered, active, and controlling the page.
3. Under **Cache Storage**, inspect `sahaaya-cache-v7`:
   - Application shell (`/`, `/index.html`, `/manifest.json`, `/favicon.svg`, `/logo.svg`).
   - All category cards (`cat_antenatal_*.jpg`, `cat_immunisation_*.jpg`, `cat_child_health_*.jpg`, `cat_chronic_*.jpg`, `cat_danger_signs_*.jpg`).
   - Avatar illustrations (`avatar_lakshmi_*.jpg`, `avatar_raju_*.jpg`, `avatar_saraswati_*.jpg`, `avatar_imran_*.jpg`, `avatar_ananya_*.jpg`).
   - Hero banner illustration (`asha_worker_hero_*.jpg`).

### Step 2: Disconnecting Network Connectivity (Airplane Mode)
1. On your physical device, enable **Airplane Mode** (or in Chrome DevTools -> **Network** tab, switch Throttling to **Offline**).
2. Observe the header badge immediately changing to:
   - `⚠️ Offline`
3. Notice that no console errors appear and no recurring polling requests fail.

### Step 3: Hard Refresh Cold-Start Test
1. While still completely offline, perform a hard reload (`Cmd+Shift+R` or `Ctrl+F5`).
2. **Verify:**
   - The application loads instantly (< 50ms) from `sahaaya-cache-v7`.
   - The navigation shell, sidebar, header, and hero illustrations display with zero broken image tags.
   - All 500 households and protocol documents are read directly from IndexedDB.

### Step 4: Full Navigation Across All Routes
1. Click through every route while offline:
   - `/` Home Dashboard
   - `/ask` Protocol Q&A
   - `/visits` Daily Visits Planner
   - `/households` Household Register (500 records)
   - `/protocols` Quick Guides Library
   - `/readiness` Offline Diagnostics Suite
   - `/sync` Offline Sync Queue
   - `/settings` Settings & Benchmarks
2. **Verify:** Every route renders cleanly with zero network fetch errors.

### Step 5: Verifying Deterministic Danger-Sign Escalation Offline
1. Navigate to `/ask`.
2. Enter the Telugu code-mixed query:
   ```
   3rd trimester lo bleeding unte emi cheyali?
   ```
3. **Verify:**
   - Red emergency escalation card renders immediately (< 1ms).
   - Actionable directives: *"Never perform PV examination"*, *"Arrange 108 ambulance"*.
   - Direct `tel:108` emergency referral link is present.
   - Citation: *Antenatal Care Protocol, Section: Danger Signs in Pregnancy (Page 12)*.
   - Zero network requests are initiated.

### Step 6: Verifying Protocol Retrieval with Citations & Ungrounded Refusal
1. In `/ask`, query:
   ```
   What is the schedule for Pentavalent vaccine?
   ```
2. **Verify:**
   - Correct dosage schedule (6, 10, 14 weeks) with verified citation from *Universal Immunization Programme Guidelines (Page 8)*.
3. Next, test out-of-scope/ungrounded query:
   ```
   How to perform open heart surgery at home?
   ```
4. **Verify:**
   - System refuses to answer rather than hallucinating: *"I can only provide guidance strictly grounded in official public health protocols..."*

### Step 7: Managing 500 Households & Visit Completion Offline
1. Navigate to `/households`.
2. Search for any generated household (e.g. `AP-00245` or `Kotha Peta`). Notice instantaneous client-side filtering over 500 records.
3. Navigate to `/visits`.
4. Click **Mark Done** on Lakshmi's visit.
5. Enter vitals: `BP: 120/80`, `Weight: 54.5 kg`, `Notes: Distributed IFA tablets`. Click **Mark Visit as Completed**.
6. **Verify:**
   - Visit card updates immediately with green completed badge and outcome notes.
   - Header sync indicator shows `1` pending change waiting in local queue.
   - Navigate to `/sync`: item is safely buffered in IndexedDB with an idempotency key.

### Step 8: Offline Readiness Diagnostics (`/readiness`)
1. Navigate to `/readiness`.
2. Inspect the live automated tests:
   - Device Storage Quota: Available quota detected.
   - IndexedDB Persistence: 500 households verified.
   - Retrieval Latency: BM25 cold & warm passes evaluated (< 15ms).
   - Safety Engine Interception: Danger sign check passes (< 1ms).
   - Service Worker Cache: Active cache confirmed.
3. Click **Re-verify System** to watch live progress bars re-evaluate in real-time.

### Step 9: Reconnecting Network & Transparent Sync Reporting
1. Disable Airplane Mode (switch back to **No throttling** / Online).
2. Navigate to `/sync`.
3. Notice the queue maintains integrity:
   - When no backend endpoint is configured, it reports **"Offline Buffer Mode"** truthfully rather than pretending to sync to an imaginary server.

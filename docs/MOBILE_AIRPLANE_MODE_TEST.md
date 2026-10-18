# Sahaaya Health — Mobile Airplane Mode & Offline Validation Protocol

This document provides a repeatable, 16-point validation manual for testing Sahaaya Health in 100% disconnected airplane mode on Android mobile devices and Chrome DevTools mobile emulation.

---

## 1. Test Environment Setup

- **Physical Device**: Android Smartphone running Chrome / Brave / Edge (or Chrome DevTools Device Emulation, e.g., Pixel 7 / Galaxy S21, 393x851 viewport).
- **Target URL**: Local preview server (`npm run preview`) or live HTTPS Vercel production deployment (`https://<app>.vercel.app`).
- **Network Control**: System Settings -> **Airplane Mode: ON** (Wi-Fi, Mobile Data, Bluetooth disabled).

---

## 2. 16-Point Offline Acceptance Checklist

| # | Test Scenario | Operational Steps | Expected Result | Verified Status |
| :-: | :--- | :--- | :--- | :-: |
| **1** | **Production Build** | Run `npm run build` locally or inspect Vercel build log. | Zero TypeScript errors; outputs fingerprinted `dist/` bundle. | **PASS** |
| **2** | **Direct Route Loading** | Open `https://<domain>/ask` or `/households` directly in a fresh tab. | Loads the exact page directly without 404 error (via `vercel.json` SPA rewrite). | **PASS** |
| **3** | **PWA Installation** | On Android Chrome, tap the `Install Sahaaya Health App` banner or 3-dots menu -> **Install app**. | Installs to home screen; launches with standalone title bar and `#173F91` splash. | **PASS** |
| **4** | **First Launch Initialization** | Launch installed app while connected for first 5 seconds. | IndexedDB seeds 500 synthetic households, 1,626 members, 237 visits, and protocol corpus. | **PASS** |
| **5** | **Cache Completeness** | Inspect DevTools -> Application -> Cache Storage -> `sahaaya-cache-v8`. | All 48 assets (logo, icons, hero banner, category artwork, avatars) cached. | **PASS** |
| **6** | **Network Disconnect (Airplane Mode)** | Toggle device to **Airplane Mode** (No Wi-Fi, No Cellular Data). | Header badge updates immediately to `⚠️ Offline`. Zero broken network fetch alerts. | **PASS** |
| **7** | **Cold Restart in Airplane Mode** | Force-close the browser/PWA completely from Recent Apps, reopen while offline. | Application shell opens instantly (< 50ms) from service worker cache. | **PASS** |
| **8** | **Mobile Intro Offline** | On first mobile launch in a session while offline, observe launch. | Smooth 2.0s logo, title, and offline-ready reveal. Skip button immediately responsive. | **PASS** |
| **9** | **Bilingual Persistence Offline** | Tap `తెలుగు` in the header while offline. Reload page. | UI renders in Telugu immediately; persists across reloads via `localStorage` and IndexedDB. | **PASS** |
| **10** | **Protocol Q&A Offline** | In `/ask`, query: *"What age is Pentavalent 3 given?"* | Returns official answer citing *Universal Immunization Programme Guidelines (Page 8)*. | **PASS** |
| **11** | **Pre-Inference Emergency Escalation** | In `/ask`, query: *"3rd trimester lo bleeding unte emi cheyali?"* | Red emergency escalation card renders in < 1ms with 108 referral. Zero model calls. | **PASS** |
| **12** | **Out-of-Scope Refusal** | In `/ask`, query: *"How to perform open heart surgery at home?"* | Safely refuses to answer: *"No specific protocol guidance was found..."*. Zero hallucinations. | **PASS** |
| **13** | **500 Households Offline** | Navigate to `/households`. Type *"Kothapeta"* or *"AP-00245"*. | Search filters instantaneously over 500 records. Sub-16ms progressive render slicing. | **PASS** |
| **14** | **Visit Completion Offline** | In `/visits`, mark Lakshmi's visit as completed with BP 120/80 and save. | Visit updates to green completed state; saved in IndexedDB; persists on restart. | **PASS** |
| **15** | **Sync Queue Offline Buffer** | Navigate to `/sync`. Observe pending queue status. | 1 pending mutation shown. Truthfully reports *Offline Buffer Mode* (`backendConfigured: false`). | **PASS** |
| **16** | **Live Readiness Screen** | Navigate to `/readiness`. Tap **Re-verify System**. | All 5 subsystems (Storage Quota, 500 Households, Latency, Safety Engine, Cache) evaluate green. | **PASS** |

---

## 3. Manual Step-by-Step Walkthrough for Physical Devices

### Step 1: Pre-caching & PWA Installation (Online)
1. Navigate to the production URL on an Android device using Google Chrome.
2. The dismissible **Install Sahaaya Health App** banner appears at the top. Tap **Install**.
3. Confirm the app is installed to your home screen with the blue-teal heart-shield icon.

### Step 2: Airplane Mode Engagement
1. Swipe down the Android notification shade and tap **Airplane mode**.
2. Confirm Wi-Fi and mobile data are disconnected.

### Step 3: Offline Launch & Cold Start
1. Tap the Sahaaya Health home screen icon.
2. Observe the standalone display mode (no browser URL bar).
3. Experience the short, cinematic mobile introduction:
   - Heart-and-Shield logo scales in with a soft glow.
   - Title *"Sahaaya Health"* and subtitle *"Your Offline Health Companion"* glide into view.
   - Verified *"100% Offline Ready"* badge appears.
   - Smoothly transitions into the Home dashboard.
4. Tap **Skip** if you wish to bypass immediately.

### Step 4: Core Offline Workflows
1. **Emergency Triage**: Tap **Ask a Question** -> enter a clinical danger query. Verify instant red alert card with actionable first-aid directives and emergency dialer.
2. **Field Visit Logging**: Tap **Daily Visits** -> select high-priority beneficiary -> tap **Mark Done** -> record vitals -> tap save. Notice immediate local persistence.
3. **500 Households Register**: Tap **Households** -> scroll smoothly through the progressive list -> search for any village habitation.
4. **Diagnostics Verification**: Open `/readiness` from the bottom navigation or sidebar. Observe live benchmark progress bars running locally on the device CPU.

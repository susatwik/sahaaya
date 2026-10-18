# Sahaaya Health — Deployment, Mobile QA & Offline Validation Report

## 1. Executive Summary & Build Verification

Sahaaya Health is an offline-first healthcare Progressive Web Application (PWA) tailored for ASHA and ANM frontline health workers in rural Andhra Pradesh.

- **Automated Test Suite**: 55 / 55 unit and integration tests passing (`npm test -- --run` in ~1.2s).
- **Clinical Escalation Benchmark**: 100/100 test cases verified with 100% Sensitivity (50/50 TP) and 100% Specificity (50/50 TN).
- **Production Build**: Verified with zero TypeScript or Vite errors (`npm run build` in ~2.4s).
- **GitHub Target**: `https://github.com/susatwik/sahaaya`
- **Default Branch**: `main`
- **Initial Commit SHA**: `a103d1d`
- **Live Vercel Production URL**: **`https://sahaaya-pi.vercel.app`** (Verified HTTP/2 200, Service Worker & Manifest Active)

---

## 2. Responsive Mobile QA Matrix (320px – 1280px)

Every view and primary user workflow has been engineered and tested against standard viewport sizes:

| Viewport | Target Device | Layout Behavior & Collision Checks | Status |
| :--- | :--- | :--- | :--- |
| **320 × 700 px** | Compact / Low-end Android | Header collapses subtitle/badge; Language pill uses compact EN/తె; Hero buttons stack vertically with min 44px tap targets; Bottom nav 5-item grid with 48px touch targets; Zero horizontal scrolling. | **PASSED** |
| **360 × 800 px** | Primary Target (Samsung Galaxy A-series) | Hero banner perfectly legible with high-contrast text overlay; 108 emergency button spans full width with 44px tap height; Feature cards render 1-column with text-wrap; PWA install banner stacks cleanly. | **PASSED** |
| **375 × 812 px** | iPhone SE / Compact iOS | Safe area padding applied; Navigation bar fixed at bottom with backdrop blur; Input form with min-w-0 prevents button overflow. | **PASSED** |
| **390 × 844 px** | Modern Standard Phone (iPhone 13/14/15) | Generous card padding; Metric cards render in 2×2 grid; Filter chips scroll horizontally without scrollbar clutter. | **PASSED** |
| **430 × 932 px** | Large Mobile (iPhone Pro Max / Galaxy Ultra) | Full high-resolution character artwork; Clean vertical rhythms and responsive font scaling. | **PASSED** |
| **768 × 1024 px** | Tablet (iPad / Samsung Galaxy Tab) | Feature cards switch to 2-column grid; Metric cards expand to 4 columns; Sidebar appears for high-density workflow. | **PASSED** |
| **1280 × 800 px** | Desktop / Laptop Screen | Persistent 250px left sidebar; Centered 1200px max-width content container; Bottom mobile bar hidden. | **PASSED** |

---

## 3. Offline PWA & Service Worker Configuration

- **Cache Version**: `sahaaya-cache-v8`
- **Precached Assets**: 48 static application assets, including:
  - App icons: `/icon-192.png`, `/icon-512.png`, `/apple-touch-icon.png`
  - High-res illustrations: `/illustrations/home-banner.png`, `/illustrations/hero-landscape-bg.png`, `/illustrations/household-family.jpg`
  - All 6 beneficiary avatars (`lakshmi.jpg`, `ravi.jpg`, `ananya.jpg`, `raju.jpg`, `saraswati.jpg`, `imran.jpg`)
  - All clinical category headers (`antenatal.jpg`, `child-health.jpg`, `danger-signs.jpg`, `immunisation.jpg`, `chronic.jpg`)
- **PWA Manifest**:
  - `name`: "Sahaaya Health — ఆశా వర్కర్ సహాయకుడు"
  - `short_name`: "Sahaaya"
  - `start_url`: "/"
  - `display`: "standalone"
  - `background_color`: "#F8FAFC"
  - `theme_color`: "#173F91"
  - Icons: 192×192 & 512×512 with `purpose: "any maskable"`
- **Routing & SPA Fallback**:
  - Configured in `vercel.json` with regex rewrite `/((?!assets/|illustrations/|.*\\..*).*)` pointing to `/index.html`.
  - Service worker `Cache-Control: no-cache, no-transform, must-revalidate` prevents stale worker scripts.

---

## 4. Mobile Airplane Mode Verification Guide

To verify complete offline operation on a physical Android or iOS device:

1. **Install PWA**:
   - Open the deployed app URL in Google Chrome (Android) or Safari (iOS).
   - Tap the in-app "Install App / యాప్ ఇన్‌స్టాల్ చేసుకోండి" banner or the browser menu "Install app" / "Add to Home Screen".
2. **Initial Seed & Cache**:
   - Open the installed Sahaaya app once while connected.
   - The Service Worker pre-caches all shell assets and IndexedDB automatically generates the 500 synthetic households and daily visits.
3. **Toggle Airplane Mode**:
   - Enable Airplane Mode in device settings (disconnect Wi-Fi and Cellular Data).
4. **Offline Capability Tests**:
   - **Ask a Question**: Type `"3rd trimester bleeding"` or `"convulsions in pregnancy"`. Observe instantaneous emergency escalation card and 108 dialing button (<5ms, zero network requests).
   - **Telugu Parity**: Toggle language pill to `తె`. Verify complete Telugu rendering of all titles, guidance, and badges.
   - **Visit Completion**: Mark a visit done with blood pressure and weight notes. Observe local update in IndexedDB and increment in the Sync Queue.
   - **Household Directory**: Search through the 500 households by village or head of household; results filter smoothly in real-time.
5. **Reconnection & Sync**:
   - Turn Airplane Mode off.
   - Navigate to `/sync` or observe the auto-sync indicator as queued records sync seamlessly.

---

## 5. Deployment Instructions (Vercel)

### Option A: Automatic GitHub Import (Recommended)
1. Push this repository to GitHub: `https://github.com/susatwik/sahaaya`
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New...** -> **Project**.
4. Import `susatwik/sahaaya`.
5. Keep default framework preset: **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click **Deploy**. Vercel will automatically apply `vercel.json` routing and caching headers.

### Option B: Deploy via Vercel CLI
```bash
npx vercel --prod
```
The CLI detects `vercel.json` and publishes the production bundle directly to the assigned live domain.

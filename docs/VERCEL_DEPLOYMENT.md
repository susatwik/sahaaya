# Sahaaya Health — Vercel Production Deployment Guide

This document provides step-by-step instructions for deploying Sahaaya Health to Vercel via GitHub, configuring SPA rewrites, caching headers, and verifying HTTPS Service Worker installation.

---

## 1. Prerequisites

- A [GitHub](https://github.com) account.
- A [Vercel](https://vercel.com) account connected to your GitHub.
- Node.js v18+ and npm v9+ installed locally.

---

## 2. Git Repository Initialization & Push

If your project is not yet connected to a remote GitHub repository, run the following commands in the workspace root:

```bash
# 1. Initialize git repository
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "feat: complete Sahaaya Health offline PWA with Vercel deployment configuration"

# 4. Set main branch
git branch -M main

# 5. Add your remote repository URL (replace with your real GitHub repo)
git remote add origin https://github.com/<your-username>/sahaaya-health.git

# 6. Push to GitHub
git push -u origin main
```

---

## 3. Vercel Dashboard Deployment Configuration

1. Log in to [vercel.com](https://vercel.com) and click **"Add New..."** -> **"Project"**.
2. Select your `sahaaya-health` repository from the GitHub repository list.
3. In the **Configure Project** screen, verify the build settings:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**:
   - Sahaaya Health is a 100% client-side, offline-first PWA.
   - **No secrets or private API keys are required.**
   - *(Optional)* If you connect an upstream state health sync server later:
     - `VITE_SYNC_BACKEND_URL`: `https://api.your-health-dept.gov.in` (leave blank for local buffer mode).
5. Click **"Deploy"**.
6. Deployment will complete in under 45 seconds, generating your live production URL (e.g. `https://sahaaya-health.vercel.app`).

---

## 4. SPA Routing & Service Worker Headers (`vercel.json`)

Vercel configuration is managed by the root [`vercel.json`](file:///Users/susatwikmanuri/Downloads/sahaaya/vercel.json):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "Service-Worker-Allowed", "value": "/" },
        { "key": "Content-Type", "value": "application/javascript; charset=utf-8" }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600" },
        { "key": "Content-Type", "value": "application/manifest+json; charset=utf-8" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/((?!assets/|illustrations/|.*\\..*).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Key Production Protections:
- **Direct Route Access**: Deep links like `/ask`, `/visits`, `/households`, `/readiness`, `/sync`, and `/settings` resolve directly to `/index.html` without returning 404 errors.
- **Immediate SW Updates**: `/sw.js` is served with `max-age=0, must-revalidate` so mobile devices pick up cache bumps immediately upon reconnecting.
- **Immutable Asset Caching**: Vite fingerprinted JavaScript and CSS assets are cached immutably for 1 year (`max-age=31536000`).

---

## 5. Post-Deployment Verification Checklist

Once deployed to your Vercel domain (e.g. `https://sahaaya-health.vercel.app`):

1. **Direct Navigation Test**: Open `https://<your-domain>/ask` in a new private window. Confirm the Protocol Q&A page loads directly without 404.
2. **Service Worker Registration**: Open DevTools -> **Application** -> **Service Workers**. Confirm `/sw.js` is activated with scope `/` and cache `sahaaya-cache-v8`.
3. **PWA Installability**: In Chrome DevTools, open **Lighthouse** and run a PWA audit. Confirm the manifest, icons (`192x192` & `512x512`), theme color (`#173F91`), and standalone display mode are recognized.
4. **Airplane Mode Test**: Disconnect network or switch to **Offline** in DevTools. Hard refresh (`Cmd+Shift+R`). Confirm the application shell, illustrations, 500 households, and protocol retriever load in $<50\text{ ms}$.

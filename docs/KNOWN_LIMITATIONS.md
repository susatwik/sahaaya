# Sahaaya Health — Known Limitations & Scope Boundaries

This document clearly outlines the system's intended clinical boundaries, browser dependencies, and operational limits.

---

## 1. Clinical Scope & Non-Diagnostic Status

- **Not a Diagnostic Tool or Doctor Substitute**: Sahaaya Health is a frontline decision-support aid for accredited ASHA and ANM health workers. It does not replace clinical judgment, physical examination, or physician prescription.
- **No Prescription Authority**: The application strictly refuses requests to formulate prescription dosages, suggest Schedule H medications, or initiate off-label therapies.
- **Immediate Escalation Priority**: When emergency danger signs are identified (e.g. Antepartum Hemorrhage, Eclampsia, Hypothermia), the application immediately directs the worker to arrange institutional transfer via 108 emergency ambulance.

---

## 2. Browser & Device Constraints

- **500 Households Memory Budget**: Managing 500 households is fully supported via IndexedDB and progressive rendering (30 records per window). For devices with <1GB available RAM, rendering more than 100 DOM nodes simultaneously is avoided to prevent WebView process termination.
- **Voice Recognition (Web Speech API)**: Offline speech recognition depends on local OS/browser engine support (e.g., Android Chrome with downloaded offline speech models). If the browser does not support local offline voice-to-text, text input remains fully functional.
- **IndexedDB Quotas & Eviction**: On Android devices with critically low storage (<500 MB free space), the browser may subject temporary storage to automatic eviction. The application requests persistent storage via `navigator.storage.persist()` where available.
- **Service Worker in Incognito**: Private/incognito browsing windows disable service workers and persistent client caching per standard browser privacy policies.

---

## 3. Network & Synchronization Truthfulness

- **Sync Queue Local Buffer Mode**: In the absence of an authorized state health authority backend endpoint, the sync queue remains in local buffer mode (`backendConfigured: false`). It never claims records are synced to the cloud when they are safely buffered on the physical device.

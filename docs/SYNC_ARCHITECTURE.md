# Sahaaya Health — Offline Sync & Idempotency Architecture

**Scope:** Client-side offline mutation queue, duplicate suppression, idempotency guarantees, and backend configuration disclosure.  
**Implementation:** [`src/core/sync/syncQueue.ts`](file:///Users/susatwikmanuri/Downloads/sahaaya/src/core/sync/syncQueue.ts)  
**Database Store:** IndexedDB `sync_queue` table via `idb`

---

## 1. Architectural Philosophy

Frontline health workers in rural Andhra Pradesh operate in deep low-connectivity and intermittent-network zones. Core operational requirements dictate:

1. **Zero Data Loss**: Every vital sign logged, household member registered, and visit completed must persist immediately in IndexedDB regardless of network availability.
2. **Deterministic Idempotency**: Network reconnections can drop midway through packets. Replays of identical mutations must never create duplicate households, double-count vaccinations, or corrupt historical logs.
3. **Transparent Status Disclosure**: Many PWAs mislead users by displaying "Synced" simply because `navigator.onLine === true`. Sahaaya Health explicitly distinguishes between *device internet connectivity* and *configured, reachable health authority backend endpoints*.

---

## 2. Sync Queue State Machine

```
              ┌────────────────────────┐
              │ User Action in UI      │
              │ (Complete Visit, etc.) │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Local IndexedDB Write  │
              │ (Immediate Persistence)│
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ Enqueue Mutation Item  │
              │ (UUID + IdempotencyKey)│
              └───────────┬────────────┘
                          │
            ┌─────────────┴─────────────┐
            │ Duplicate Operation Check │
            │ Same type + target ID?    │
            └─────────────┬─────────────┘
          Yes             │ No
     ┌────────────────────┴────────────────────┐
     ▼                                         ▼
┌────────────────────────┐         ┌────────────────────────┐
│ Update in-place        │         │ Insert new record      │
│ (Preserve latest data) │         │ Status: 'pending'      │
└────────────────────────┘         └───────────┬────────────┘
                                               │
                                               ▼
                                   ┌────────────────────────┐
                                   │ Is Backend Configured? │
                                   └───────────┬────────────┘
                                 No            │ Yes (Online)
            ┌──────────────────────────────────┴──────────────────┐
            ▼                                                     ▼
┌──────────────────────────────────────┐            ┌────────────────────────┐
│ Retain in Local Idempotency Buffer   │            │ Dispatch HTTP POST     │
│ Queue Status: 'Offline Buffer Mode'  │            │ With X-Idempotency-Key │
│ Zero synthetic pseudo-sync claims    │            └───────────┬────────────┘
└──────────────────────────────────────┘                        │
                                                    ┌───────────┴───────────┐
                                                    ▼ Success               ▼ Failure / Timeout
                                        ┌────────────────────────┐ ┌────────────────────────┐
                                        │ Status: 'synced'       │ │ Status: 'failed'       │
                                        │ SyncedAt: timestamp    │ │ Retries: count + 1     │
                                        └────────────────────────┘ │ Exponential Backoff    │
                                                                   └────────────────────────┘
```

---

## 3. Data Contract & Idempotency Key

Every mutation item persisted to IndexedDB conforms to the `SyncQueueItem` interface:

```typescript
export interface SyncQueueItem {
  id: string; // Unique queue entry ID (UUID v4)
  idempotencyKey: string; // Deterministic collision-prevention key
  operation: 'CREATE_HOUSEHOLD' | 'UPDATE_HOUSEHOLD' | 'ADD_MEMBER' | 'COMPLETE_VISIT' | 'RECORD_VITALS';
  endpoint: string; // Target REST/RPC resource path (e.g., '/api/v1/visits/complete')
  payload: Record<string, any>; // Serialized entity mutation data
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number; // Current attempt count (max 5)
  maxRetries: number;
  lastAttemptAt?: string; // ISO 8601 timestamp
  error?: string; // Descriptive failure message
  createdAt: string; // ISO 8601 creation timestamp
}
```

### Idempotency Key Composition
- **Visit Completions**: `VISIT-${visitId}-${outcome}-${date}`
- **Member Additions**: `MEMBER-${householdId}-${name.toLowerCase()}-${dob}`
- **Household Creation**: `HH-${householdId}-${headName.toLowerCase()}`

When an ASHA worker edits a visit multiple times before connectivity is restored, the queue updates the existing pending item rather than queuing redundant actions, saving device memory and network bandwidth.

---

## 4. Truthful Backend Status Disclosure

In accordance with Phase 8 of the offline-first specification:
- If no cloud sync endpoint (`VITE_SYNC_BACKEND_URL`) is configured in the environment, the sync manager returns:
  ```json
  {
    "backendConfigured": false,
    "online": true,
    "message": "Local Idempotency Buffer Active — Records are securely buffered in IndexedDB until an authorized health server is configured."
  }
  ```
- The UI displays **"Offline Buffer Mode"** and clearly informs frontline staff that records are permanently safe on device storage without falsely claiming upstream synchronization.

---

## 5. Conflict Resolution Strategy

When synchronizing with an authoritative state health portal (e.g., e-Aushadhi / ANMOL / RCH portal):
1. **Field Priority**: Clinical observations captured by the frontline worker in person (such as maternal blood pressure and newborn weight) take precedence over remote batch projections.
2. **Last-Write Timestamp**: Entity updates include `updatedAt` timestamps. Server updates preserve the most recent verified observation.
3. **Manual Review Queue**: In the rare event of contradictory household head designations, records are flagged for manual ANM supervisor resolution in `/sync` without silent data overwrite.

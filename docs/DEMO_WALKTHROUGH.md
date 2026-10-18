# Sahaaya Health — Demonstration Walkthrough

Follow this step-by-step walkthrough to inspect all reference screens, 500 households, offline readiness diagnostics, and Telugu localization.

---

## Screen 1: Home Dashboard (`/`)

1. Notice the **Heart-and-Shield Sahaaya logo** and tagline: *"Your Offline Health Companion"*.
2. View the welcoming banner: *"Namaste! మీ ఆరోగ్య సేవలో నేను ఉంటాను"*.
3. Test the **Language Toggle** in the header (`EN` / `తెలుగు`): notice all greeting text and cards adapt immediately.
4. Observe the **4 Main Feature Cards (2x2 Grid)**:
   - *Ask a Question* (Blue) -> navigates to `/ask`
   - *Daily Visit List* (Green) -> navigates to `/visits`
   - *Household Register* (Indigo) -> navigates to `/households`
   - *Quick Guides* (Amber) -> navigates to `/protocols`
5. Check the **Field Tasks Summary**: High Priority tasks, Due Today, and Overdue tasks calculated across the complete 500-household registry.
6. Check the bottom readiness card: click it to jump directly to `/readiness`.

---

## Screen 2: Protocol Q&A (`/ask`)

1. Click on **Ask a Question**.
2. Notice the showcase question matching Phone Screen 2:
   - User: *"3rd trimester lo bleeding unte emi cheyali?"*
   - Immediate **Red Emergency Escalation Card**:
     - 🚨 *Refer Immediately: Antepartum Bleeding*
     - Verified Citation: *Antenatal Care Protocol, Section: Danger Signs in Pregnancy (Page 12)*
     - Key Points: *Do not delay*, *Never perform PV examination*, *Arrange 108 ambulance*, *Left lateral tilt*.
     - Action button: *Call 108 Emergency Ambulance*.
3. Try typing or clicking the suggested chips at the bottom:
   - *Antenatal* -> Mandatory check-up schedule.
   - *Immunisation* -> Pentavalent 3 and DPT booster schedule.
   - *Child Health* -> ORS and Zinc preparation.
4. Test an out-of-scope query:
   - *"How to perform open heart surgery at home?"*
   - Observe the safe refusal response citing protocol boundaries without hallucination.
5. Click the **Clock icon** in the top right to view local **Conversation History**.

---

## Screen 3: Daily Visit Planner (`/visits`)

1. Click **Visits** in the navigation.
2. Observe the date bar: *"Today, 15 Oct 2026"*.
3. Click filter pills:
   - *All*
   - *High Priority* -> shows **Lakshmi (G3P1, 28 weeks)** with red *High* badge
   - *Due Today* -> shows scheduled milestones
   - *Overdue* -> shows **Anasuya (G2P1, 34 weeks)** overdue for check-up
4. On any visit card (e.g. Lakshmi or Raju), click **Mark Done**:
   - Record vitals (BP: 120/80, Weight: 52kg) and outcome notes.
   - Observe card updating with strikethrough and green completion tag.
   - Click **Undo** to test accidental completion recovery.

---

## Screen 4: 500-Household Register & Details (`/households` & `/households/:id`)

1. Click **Households** in the navigation.
2. Notice the total counter showing **500 Households Registered**.
3. Use the instant search box to type `Kotha Peta`, `Rythu Basti`, or `AP-00123`.
4. Click on **Lakshmi Family (AP-00123)**.
5. Inspect the profile card and 3 tabs:
   - **Family Members**:
     - *Lakshmi* (28 weeks pregnant) [High Risk] -> ANC check-up due
     - *Ravi* (Husband, 32 years)
     - *Baby Girl* (3 years) [Due] -> Immunisation due (DPT Booster)
   - **Due Services**: displays all pending preventive milestones.
   - **History**: shows logged visits and notes.
6. Click **+ Add Family Member**:
   - Fill out name, age, pregnancy status, and click save.
   - The member is saved instantly into IndexedDB and enqueued in sync.

---

## Screen 5: Quick Guides & Protocol Library (`/protocols`)

1. Click **Guides** in the navigation.
2. Browse the 6 colored protocol cards matching Phone Screen 5:
   - *Antenatal Care* (Rose)
   - *Immunisation* (Sky Blue)
   - *Child Health* (Emerald)
   - *Chronic Diseases* (Amber)
   - *Emergency Danger Signs* (Purple)
   - *Job Aids & Checklists* (Slate)
3. Click any guide (e.g. *Antenatal Care*):
   - View verified page numbers, clinical text, key points, cautions, and read-aloud button.

---

## Screen 6: Live Offline Readiness Diagnostics (`/readiness`)

1. Click **System Readiness** from the sidebar or navigate to `/readiness`.
2. Inspect the live automated tests:
   - **Device Storage Quota**: Evaluates local disk allocation via `navigator.storage.estimate()`.
   - **IndexedDB Persistence**: Confirms 500 households are seeded and queryable.
   - **Retrieval Latency**: Tests BM25 cold-start and warm retrieval (< 15ms).
   - **Safety Engine Interception**: Verifies danger sign rules execute in < 1ms.
   - **Service Worker Cache**: Checks active cache assets.
3. Click **Re-verify System** to trigger a real-time re-evaluation.

---

## Screen 7: Offline Sync Queue (`/sync`)

1. Navigate to `/sync`.
2. View pending mutations enqueued from visit completions or added members.
3. Observe the transparent status indicator:
   - Reports **"Offline Buffer Mode"** truthfully when no cloud backend is configured.
   - Allows individual item retry or clearing failed tasks.

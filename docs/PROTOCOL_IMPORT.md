# Sahaaya Health — Protocol Corpus Import Guide

This document specifies the process for ingesting, validating, and updating official clinical guidelines into Sahaaya Health's offline repository.

---

## 1. Corpus Sources

All clinical guidance originates strictly from approved Indian public health repositories:
- **National Health Mission (NHM)**: Antenatal Care (ANC) & Maternal Health Guidelines
- **Universal Immunization Programme (UIP)**: Comprehensive Multi-Year Plan & Schedule
- **Integrated Management of Neonatal & Childhood Illness (IMNCI)**: Facility & Community Charts
- **National Programme for Prevention & Control of Cancer, Diabetes, CVD and Stroke (NPCDCS)**
- **Government of Andhra Pradesh / Commissionerate of Health & Family Welfare**: ASHA & ANM Operational Manuals

---

## 2. Ingestion Pipeline & Schema

Clinical documents are structured in JSON/TypeScript format under `src/data/protocolCorpus.ts`.

### Schema Format

```typescript
export interface ProtocolSection {
  id: string;
  heading: string;
  headingTe: string;
  page: number; // Exact page in physical/PDF reference
  content: string; // Grounded clinical passage
  contentTe: string; // Verified Telugu translation
  keyPoints: string[]; // High-priority actionable directives
  keyPointsTe: string[];
  cautions?: string[]; // Critical safety contraindications
}

export interface ProtocolDocument {
  id: string;
  category: 'antenatal' | 'immunisation' | 'child_health' | 'chronic' | 'danger_signs' | 'job_aids';
  title: string;
  titleTe: string;
  subtitle: string;
  subtitleTe: string;
  sourceDoc: string;
  version: string;
  lastUpdated: string;
  sections: ProtocolSection[];
}
```

---

## 3. Validation Checklist Before Deployment

1. **No Hallucinated Citations**: Every section must point to a real document title and verifiable page number.
2. **Scope of Practice Compliance**: Frontline workers (ASHA/ANM) cannot be instructed to prescribe Schedule H antibiotics or initiate unsupervised invasive interventions.
3. **Bilingual Verification**: Both English and Telugu content must convey identical medical instructions.
4. **IndexedDB Sync**: The seeder in `src/core/storage/db.ts` automatically updates local storage on version bump.

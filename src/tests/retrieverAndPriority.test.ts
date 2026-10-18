import { describe, it, expect } from 'vitest';
import { ProtocolRetriever } from '../core/retrieval/retriever';
import { INITIAL_VISITS } from '../core/storage/db';

describe('Protocol Retriever & Clinical Guidance Tests', () => {
  const retriever = new ProtocolRetriever();

  it('retrieves antenatal care protocol for ANC schedule queries', () => {
    const results = retriever.retrieve('What is the mandatory ANC check-up schedule?');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].doc.id).toBe('antenatal-care');
    expect(results[0].section.id).toBe('anc-schedule');
    expect(results[0].section.page).toBe(6);
  });

  it('retrieves immunisation schedule for Pentavalent and booster vaccines', () => {
    const results = retriever.retrieve('When is pentavalent 3 and DPT booster given to child?');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].doc.id).toBe('immunisation');
  });

  it('retrieves ORS and Zinc protocol for child diarrhea management', () => {
    const results = retriever.retrieve('How to prepare ORS packet and zinc tablets for child with loose motion?');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].doc.id).toBe('child-health');
    expect(results[0].section.heading).toContain('ORS & Zinc');
  });

  it('generates cited grounded answer with verified page and document title', () => {
    const answer = retriever.generateAnswer('How to use MUAC tape for child malnutrition?');
    expect(answer.hasAnswer).toBe(true);
    expect(answer.docTitle).toContain('Child Health');
    expect(answer.sectionHeading).toContain('MUAC');
    expect(answer.page).toBe(16);
    expect(answer.keyPoints.length).toBeGreaterThan(0);
  });

  it('abstains and returns refusal when query is unrelated to approved health protocols', () => {
    const answer = retriever.generateAnswer('Who won the cricket match in Mumbai?');
    expect(answer.hasAnswer).toBe(false);
    expect(answer.isRefusal).toBe(true);
  });
});

describe('Field Visit Priority & Triage Tests', () => {
  it('correctly ranks High Risk ANC as highest priority', () => {
    const highRiskVisits = INITIAL_VISITS.filter((v) => v.priority === 'HIGH');
    expect(highRiskVisits.length).toBeGreaterThan(0);
    expect(highRiskVisits[0].beneficiaryName).toBe('Lakshmi');
    expect(highRiskVisits[0].subtasks).toContain('Antenatal check-up due');
  });

  it('accurately identifies overdue visits', () => {
    const overdueVisits = INITIAL_VISITS.filter((v) => v.isOverdue || v.priority === 'OVERDUE');
    expect(overdueVisits.length).toBeGreaterThan(0);
    expect(overdueVisits[0].beneficiaryName).toBe('Anasuya');
  });
});

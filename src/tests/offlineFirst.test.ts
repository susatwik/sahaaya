import { describe, it, expect, beforeEach } from 'vitest';
import { generate500SyntheticHouseholds } from '../data/syntheticDataGenerator';
import { ProtocolRetriever } from '../core/retrieval/retriever';
import { evaluateEscalation } from '../core/safety/escalationEngine';
import { OfflineReadinessChecker } from '../core/offline/readinessChecker';
import { PROTOCOL_CORPUS } from '../data/protocolCorpus';

describe('Sahaaya Health — Offline-First Architecture & 500 Households Suite', () => {
  describe('Phase 3 & 7: 500 Synthetic Households & Visit Prioritization', () => {
    const dataset = generate500SyntheticHouseholds();

    it('generates exactly 500 households with unique IDs', () => {
      expect(dataset.households.length).toBe(500);

      const idSet = new Set(dataset.households.map((h) => h.id));
      expect(idSet.size).toBe(500);
    });

    it('includes realistic Andhra Pradesh names and villages in English and Telugu', () => {
      const sampleHH = dataset.households[0];
      expect(sampleHH.id).toBe('AP-00123');
      expect(sampleHH.headOfHousehold).toBe('Lakshmi Family');
      expect(sampleHH.headOfHouseholdTe).toBe('లక్ష్మి కుటుంబం');
      expect(sampleHH.village).toBe('Rythu Basti');
      expect(sampleHH.rationCard).toMatch(/^WAP\d+/);

      // Verify Telugu coverage across all 500
      const hasTelugu = dataset.households.every((h) => !!h.headOfHouseholdTe && h.headOfHouseholdTe.length > 0);
      expect(hasTelugu).toBe(true);
    });

    it('generates family members across all 500 households', () => {
      expect(dataset.members.length).toBeGreaterThan(1000);

      // Verify pregnant beneficiaries have gestational weeks
      const pregnantMembers = dataset.members.filter((m) => m.isPregnant);
      expect(pregnantMembers.length).toBeGreaterThan(50);
      pregnantMembers.forEach((p) => {
        expect(p.gestationalWeeks).toBeGreaterThanOrEqual(12);
        expect(p.gestationalWeeks).toBeLessThanOrEqual(42);
      });
    });

    it('derives prioritized field visits from the 500 households', () => {
      expect(dataset.visits.length).toBeGreaterThan(150);

      const highPriority = dataset.visits.filter((v) => v.priority === 'HIGH');
      const dueToday = dataset.visits.filter((v) => v.dueDate === '2026-10-15');
      const overdue = dataset.visits.filter((v) => v.isOverdue || v.priority === 'OVERDUE');

      expect(highPriority.length).toBeGreaterThan(10);
      expect(dueToday.length).toBeGreaterThan(15);
      expect(overdue.length).toBeGreaterThan(5);

      // Verify every visit has clinical reasoning
      dataset.visits.forEach((v) => {
        expect(v.priorityReason.length).toBeGreaterThan(5);
        expect(v.subtasks.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('supports fast local filtering by name, village, and ward without network', () => {
      const q = 'Rythu Basti';
      const results = dataset.households.filter((h) => h.village.toLowerCase().includes(q.toLowerCase()));
      expect(results.length).toBeGreaterThan(30);

      const teluguSearch = dataset.households.filter((h) => h.headOfHouseholdTe?.includes('లక్ష్మి'));
      expect(teluguSearch.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Phase 4: Offline Protocol Retrieval & Citations', () => {
    const retriever = new ProtocolRetriever();

    it('retrieves grounded protocol answers with verifiable citations', () => {
      const result = retriever.generateAnswer('mandatory antenatal care schedule', 'en');
      expect(result.hasAnswer).toBe(true);
      expect(result.docTitle).toContain('Antenatal');
      expect(result.sectionHeading).toBeDefined();
      expect(result.keyPoints.length).toBeGreaterThan(0);
      expect(result.isRefusal).toBeFalsy();
    });

    it('retrieves accurate Telugu answers when Telugu language is requested', () => {
      const result = retriever.generateAnswer('ANC visit schedule', 'te');
      expect(result.hasAnswer).toBe(true);
      expect(result.docTitle).toContain('ANC');
      expect(result.shortAnswer.length).toBeGreaterThan(0);
    });

    it('safely refuses ungrounded medical requests without inventing facts', () => {
      const result = retriever.generateAnswer('how to perform open heart surgery at home?', 'en');
      expect(result.hasAnswer).toBe(false);
      expect(result.isRefusal).toBe(true);
      expect(result.shortAnswer).toContain('Medical Officer');
      expect(result.cautions.length).toBeGreaterThan(0);
    });

    it('returns Telugu refusal message for unsupported queries in Telugu mode', () => {
      const result = retriever.generateAnswer('unknown surgical procedure xyz', 'te');
      expect(result.hasAnswer).toBe(false);
      expect(result.isRefusal).toBe(true);
      expect(result.shortAnswer).toContain('PHC మెడికల్ ఆఫీసర్');
    });
  });

  describe('Phase 5: Deterministic Danger-Sign Safety Engine', () => {
    it('intercepts third trimester bleeding immediately', () => {
      const result = evaluateEscalation('3rd trimester lo bleeding unte emi cheyali?');
      expect(result.isEscalation).toBe(true);
      expect(result.ruleId).toBe('DANGER_ANC_BLEEDING');
      expect(result.rule?.immediateAction).toContain('refer the pregnant woman');
      expect(result.rule?.source.title).toContain('Antenatal Care');
    });

    it('intercepts eclampsia / fits during pregnancy', () => {
      const result = evaluateEscalation('garbhini ki fits vachayi emergency');
      expect(result.isEscalation).toBe(true);
      expect(result.ruleId).toBe('DANGER_ANC_ECLAMPSIA');
    });

    it('intercepts newborn severe danger signs', () => {
      const result = evaluateEscalation('newborn baby chest indrawing and fast breathing');
      expect(result.isEscalation).toBe(true);
      expect(result.ruleId).toBe('DANGER_NEWBORN_SEVERE');
    });

    it('intercepts hypertensive emergency with BP >= 180', () => {
      const result = evaluateEscalation('patient BP is 190/115 with headache');
      expect(result.isEscalation).toBe(true);
      expect(result.ruleId).toBe('DANGER_NCD_HYPERTENSIVE_CRISIS');
    });

    it('avoids false alarms when symptoms are explicitly negated', () => {
      const enNeg = evaluateEscalation('patient has no bleeding and no headache');
      expect(enNeg.isEscalation).toBe(false);

      const teNeg = evaluateEscalation('garbhini ki bleeding ledu normal ga undi');
      expect(teNeg.isEscalation).toBe(false);
    });
  });

  describe('Phase 9: Offline Readiness Diagnostics', () => {
    it('executes diagnostic checks without requiring external network access', async () => {
      const checker = OfflineReadinessChecker.getInstance();
      const report = await checker.runFullDiagnostics();

      expect(report).toBeDefined();
      expect(report.checks.length).toBeGreaterThanOrEqual(4);
      expect(report.protocolsCount).toBe(PROTOCOL_CORPUS.length);

      // Verify that emergency check and protocol retrieval passed
      const safetyCheck = report.checks.find((c) => c.id === 'safety-engine');
      expect(safetyCheck?.status).toBe('PASSED');

      const protocolCheck = report.checks.find((c) => c.id === 'protocol-retriever');
      expect(protocolCheck?.status).toBe('PASSED');
    });
  });
});

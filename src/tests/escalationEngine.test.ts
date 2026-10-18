import { describe, it, expect } from 'vitest';
import { evaluateEscalation, normalizeQuery, isSymptomNegated } from '../core/safety/escalationEngine';

describe('Deterministic Escalation Engine - Safety Critical Tests', () => {
  describe('Input Normalization', () => {
    it('normalizes uppercase, punctuation, and multiple spaces', () => {
      expect(normalizeQuery('  3rd Trimester LO   Bleeding!!??  ')).toBe('3rd trimester lo bleeding');
    });
  });

  describe('Negation Detection', () => {
    it('recognizes English prefix negations correctly', () => {
      const res = isSymptomNegated('patient has no bleeding today', 'bleeding');
      expect(res.negated).toBe(true);
    });

    it('recognizes Telugu suffix negations correctly', () => {
      const res = isSymptomNegated('garbhini ki bleeding ledu', 'bleeding');
      expect(res.negated).toBe(true);
    });

    it('does not falsely negate when symptom is present', () => {
      const res = isSymptomNegated('3rd trimester lo bleeding undi emi cheyali', 'bleeding');
      expect(res.negated).toBe(false);
    });
  });

  describe('Emergency Escalation Suite (100% Target)', () => {
    // 1. Third trimester bleeding
    it('detects third trimester bleeding in Telugu code-mixed query from reference screen', () => {
      const res = evaluateEscalation('3rd trimester lo bleeding unte emi cheyali?');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_ANC_BLEEDING');
      expect(res.severity).toBe('CRITICAL');
      expect(res.rule?.source.section).toContain('Danger Signs in Pregnancy');
    });

    it('detects vaginal bleeding in pregnancy (English)', () => {
      const res = evaluateEscalation('Pregnant woman has severe vaginal bleeding in 8th month');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_ANC_BLEEDING');
    });

    it('detects Telugu bleeding phrase (rakthasravam)', () => {
      const res = evaluateEscalation('garbhini ki rakthasravam ayyindi emergency');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_ANC_BLEEDING');
    });

    // 2. Eclampsia & Fits
    it('detects eclampsia and fits during pregnancy', () => {
      const res = evaluateEscalation('garbhini ki fits vachayi em cheyali');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_ANC_ECLAMPSIA');
    });

    it('detects severe headache with high BP during pregnancy', () => {
      const res = evaluateEscalation('pregnant mother with high bp and severe headache blurred vision');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_ANC_ECLAMPSIA');
    });

    // 3. Leaking amniotic fluid / PROM
    it('detects leaking fluid / water breaking in pregnancy', () => {
      const res = evaluateEscalation('garbhini ki umneeru paduthondi');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_ANC_PROM_LEAKING');
    });

    // 4. Reduced or absent fetal movements
    it('detects cessation of fetal movements', () => {
      const res = evaluateEscalation('kadupu lo bidda kadalatledu, no baby movements for 8 hours');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_ANC_REDUCED_MOVEMENTS');
    });

    // 5. Newborn danger signs
    it('detects newborn unable to feed / hypothermia', () => {
      const res = evaluateEscalation('puttina bidda palu tagalekapotundi challa badipoyindi');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_NEWBORN_SEVERE');
    });

    it('detects newborn chest indrawing', () => {
      const res = evaluateEscalation('newborn baby has severe chest indrawing and fast breathing');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_NEWBORN_SEVERE');
    });

    // 6. Child severe dehydration
    it('detects child lethargic with severe diarrhea and sunken eyes', () => {
      const res = evaluateEscalation('child has severe dehydration, sunken eyes and lethargic');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_CHILD_SEVERE_DEHYDRATION');
    });

    // 7. Hypertensive crisis & cardiac emergency
    it('detects severe chest pain radiating to arm', () => {
      const res = evaluateEscalation('elderly patient severe chest pain sweating breathlessness radiating');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_NCD_HYPERTENSIVE_CRISIS');
    });

    it('detects hypertensive crisis BP >= 180', () => {
      const res = evaluateEscalation('patient BP is 190/115 with headache');
      expect(res.isEscalation).toBe(true);
      expect(res.ruleId).toBe('DANGER_NCD_HYPERTENSIVE_CRISIS');
    });

    // 8. Scope refusal
    it('refuses illegal antibiotic prescription requests', () => {
      const res = evaluateEscalation('what dose of antibiotic should I prescribe for this infection?');
      expect(res.isEscalation).toBe(true);
      expect(res.severity).toBe('OUT_OF_SCOPE');
    });

    // 9. Negation cases (must NOT escalate)
    it('does NOT escalate when bleeding is negated in English', () => {
      const res = evaluateEscalation('patient has no bleeding and no headache, can she take iron tablet?');
      expect(res.isEscalation).toBe(false);
    });

    it('does NOT escalate when symptom is negated in Telugu', () => {
      const res = evaluateEscalation('garbhini ki bleeding ledu, routine anc checkup eppudu cheyali?');
      expect(res.isEscalation).toBe(false);
    });

    // 10. Routine non-emergency query
    it('passes routine non-emergency questions through without escalation', () => {
      const res = evaluateEscalation('When should the first ANC checkup be scheduled?');
      expect(res.isEscalation).toBe(false);
      expect(res.rule).toBeNull();
    });

    it('passes routine immunization schedule query through without escalation', () => {
      const res = evaluateEscalation('What age is Pentavalent 3 vaccine given?');
      expect(res.isEscalation).toBe(false);
      expect(res.rule).toBeNull();
    });
  });
});

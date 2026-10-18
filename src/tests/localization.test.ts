import { describe, it, expect } from 'vitest';
import { enTranslations } from '../i18n/translations/en';
import { teTranslations } from '../i18n/translations/te';
import { getTranslation, TRANSLATIONS, Language } from '../i18n';
import { ProtocolRetriever } from '../core/retrieval/retriever';
import { evaluateEscalation } from '../core/safety/escalationEngine';

describe('Sahaaya Health — Telugu & English Localization Integrity', () => {
  it('should have 100% key parity between English and Telugu dictionaries', () => {
    const enKeys = Object.keys(enTranslations).sort();
    const teKeys = Object.keys(teTranslations).sort();

    expect(teKeys).toEqual(enKeys);
    expect(enKeys.length).toBeGreaterThan(50);
  });

  it('should not contain empty strings in English or Telugu dictionaries', () => {
    Object.entries(enTranslations).forEach(([key, val]) => {
      expect(val.trim().length, `English key ${key} is empty`).toBeGreaterThan(0);
    });

    Object.entries(teTranslations).forEach(([key, val]) => {
      expect(val.trim().length, `Telugu key ${key} is empty`).toBeGreaterThan(0);
    });
  });

  it('should correctly retrieve translations for both languages via getTranslation', () => {
    const enT = getTranslation('en');
    const teT = getTranslation('te');

    expect(enT.appName).toBe('Sahaaya Health');
    expect(teT.appName).toBe('సహాయ హెల్త్');

    expect(enT.worksOffline).toBe('Works Offline');
    expect(teT.worksOffline).toBe('ఇంటర్నెట్ లేకుండానూ పనిచేస్తుంది');

    expect(enT.call108Ambulance).toContain('108');
    expect(teT.call108Ambulance).toContain('108');
  });

  it('should fallback gracefully to English for unknown language codes', () => {
    const fallbackT = getTranslation('fr' as Language);
    expect(fallbackT.appName).toBe('Sahaaya Health');
    expect(fallbackT.navHome).toBe('Home');
  });

  it('should verify critical frontline healthcare terminology in Telugu', () => {
    // Check key Andhra Pradesh healthcare terms
    expect(teTranslations.navHome).toBe('హోమ్');
    expect(teTranslations.navVisits).toBe('సందర్శనలు');
    expect(teTranslations.navHouseholds).toBe('కుటుంబాలు');
    expect(teTranslations.navGuides).toBe('మార్గదర్శకాలు');
    expect(teTranslations.navSync).toBe('సమకాలీకరణ');
    expect(teTranslations.highPriority).toBe('అధిక ప్రాధాన్యత');
    expect(teTranslations.dueToday).toBe('నేడు చేయాల్సినవి');
    expect(teTranslations.overdueFollowups).toBe('గడువు దాటిన తదుపరి పరిశీలనలు');
    expect(teTranslations.totalVisits).toBe('మొత్తం సందర్శనలు');
  });

  it('should safely escalate dangerous maternal and neonatal symptoms in Telugu and English', () => {
    // English query
    const enResult = evaluateEscalation('patient has severe vaginal bleeding in third trimester');
    expect(enResult.isEscalation).toBe(true);
    expect(enResult.rule).toBeDefined();
    expect(enResult.rule?.immediateActionTe).toBeDefined();
    expect(enResult.rule?.immediateActionTe.length).toBeGreaterThan(10);

    // Telugu query
    const teResult = evaluateEscalation('గర్భధారణ సమయంలో తీవ్ర రక్తస్రావం');
    expect(teResult.isEscalation).toBe(true);
    expect(teResult.rule).toBeDefined();
  });

  it('should retrieve protocol answers in both English and Telugu', () => {
    const retriever = new ProtocolRetriever();

    const enAnswer = retriever.generateAnswer('ANC visit schedule', 'en');
    expect(enAnswer.shortAnswer.length).toBeGreaterThan(0);
    expect(enAnswer.docTitle.length).toBeGreaterThan(0);

    const teAnswer = retriever.generateAnswer('ANC visit schedule', 'te');
    expect(teAnswer.shortAnswer.length).toBeGreaterThan(0);
    expect(teAnswer.docTitle.length).toBeGreaterThan(0);
  });
});

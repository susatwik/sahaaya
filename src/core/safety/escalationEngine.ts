import { ESCALATION_RULES, EscalationRule, EscalationSeverity } from './escalationRules';

export interface EscalationMatchResult {
  isEscalation: boolean;
  rule: EscalationRule | null;
  ruleId: string | null;
  severity: EscalationSeverity | null;
  matchedPhrase: string;
  isNegated: boolean;
  negationReason?: string;
  normalizedQuery: string;
  timestamp: string;
}

// Negation patterns in English and Telugu / Code-mixed
const NEGATION_PATTERNS: RegExp[] = [
  /\b(no|not|neither|nor|without|never|denies|ruled\s*out|stopped)\s+([a-z0-9\s]{1,25})/i,
  /([a-z0-9\s]{1,25})\s+(ledu|levu|kaadu|ledani|leduga|bhaane\s*undi|normal|raaledu|undi\s*kaadu)\b/i,
  /no\s+(bleeding|blood|raktham|fits|seizure|headache|pain|fever|leaking)/i,
  /(bleeding|raktham|fits|noppi|fever)\s+(ledu|levu|aagipoyindi|aagindi)/i,
];

/**
 * Normalises input text for clinical rule matching.
 */
export function normalizeQuery(query: string): string {
  if (!query) return '';
  return query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ') // punctuation to spaces
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks whether a danger keyword or symptom is negated within its local context.
 */
export function isSymptomNegated(text: string, targetWordOrPattern: string): { negated: boolean; reason?: string } {
  const norm = normalizeQuery(text);
  const escaped = escapeRegex(targetWordOrPattern);

  // Check prefix negations: e.g. "no bleeding", "without fits", "denies chest pain"
  const prefixRegex = new RegExp(`(\\b(no|not|without|no\\s*signs\\s*of|no\\s*history\\s*of|denies|denying|ruled\\s*out|free\\s*of)|లేని|లేకుండా)\\s+(?:severe\\s+|excessive\\s+)?${escaped}`, 'i');
  if (prefixRegex.test(norm)) {
    return { negated: true, reason: `Prefix negation matched: "${prefixRegex.exec(norm)?.[0]}"` };
  }

  // Check suffix negations in Telugu code-mixed & Telugu script: e.g. "bleeding ledu", "రక్తస్రావం లేదు"
  const suffixRegex = new RegExp(`${escaped}\\s+(ledu|levu|aagindi|aagipoyindi|normal|bane\\s*undi|raaledu|raledu|లేదు|లేవు|ఆగింది|ఆగిపోయింది|రాలేదు|సాధారణంగా\\s*ఉంది|బానే\\s*ఉంది)`, 'i');
  if (suffixRegex.test(norm)) {
    return { negated: true, reason: `Suffix negation matched: "${suffixRegex.exec(norm)?.[0]}"` };
  }

  return { negated: false };
}

/**
 * Deterministic Danger-Sign Escalation Engine.
 * Must execute strictly before invoking any retrieval or model reasoning.
 */
export function evaluateEscalation(rawQuery: string): EscalationMatchResult {
  const normalized = normalizeQuery(rawQuery);
  const now = new Date().toISOString();

  if (!normalized) {
    return {
      isEscalation: false,
      rule: null,
      ruleId: null,
      severity: null,
      matchedPhrase: '',
      isNegated: false,
      normalizedQuery: '',
      timestamp: now,
    };
  }

  for (const rule of ESCALATION_RULES) {
    // 1. Check regex patterns first
    for (const pattern of rule.patterns) {
      const match = pattern.exec(rawQuery) || pattern.exec(normalized);
      if (match) {
        const matchedText = match[0];
        
        // For reduced movement, absence of movement IS the danger sign, not a negation
        if (rule.id !== 'DANGER_ANC_REDUCED_MOVEMENTS') {
          // Verify negation
          const negationCheck = isSymptomNegated(normalized, matchedText.trim());
          if (negationCheck.negated) {
            continue;
          }

          // Additional keyword check for negation
          let fullyNegated = false;
          for (const kw of rule.keywords) {
            if (matchedText.toLowerCase().includes(kw.toLowerCase())) {
              const kwNeg = isSymptomNegated(normalized, kw.toLowerCase());
              if (kwNeg.negated) {
                fullyNegated = true;
                break;
              }
            }
          }

          if (fullyNegated) {
            continue;
          }
        }

        return {
          isEscalation: true,
          rule,
          ruleId: rule.id,
          severity: rule.severity,
          matchedPhrase: matchedText,
          isNegated: false,
          normalizedQuery: normalized,
          timestamp: now,
        };
      }
    }

    // 2. Check keyword combinations if high confidence
    const hasTriggerKeyword = rule.keywords.some((kw) => {
      if (normalized.includes(kw.toLowerCase())) {
        const neg = isSymptomNegated(normalized, kw.toLowerCase());
        return !neg.negated;
      }
      return false;
    });

    if (hasTriggerKeyword) {
      // Check secondary category indicator
      let categoryMatch = false;
      if (rule.category === 'PREGNANCY' && (
        normalized.includes('pregnant') || normalized.includes('pregnancy') ||
        normalized.includes('garbham') || normalized.includes('garbhini') ||
        normalized.includes('trimester') || normalized.includes('anc') ||
        normalized.includes('prasavam') || normalized.includes('delivery') ||
        normalized.includes('గర్భ') || normalized.includes('గర్భిణీ') || normalized.includes('గర్భధారణ') ||
        normalized.includes('ప్రసవం')
      )) {
        categoryMatch = true;
      } else if (rule.category === 'NEWBORN' && (
        normalized.includes('baby') || normalized.includes('newborn') ||
        normalized.includes('infant') || normalized.includes('bidda') ||
        normalized.includes('puttina') || normalized.includes('child')
      )) {
        categoryMatch = true;
      } else if (rule.category === 'NCD_CRISIS' && (
        normalized.includes('bp') || normalized.includes('pressure') ||
        normalized.includes('heart') || normalized.includes('chest')
      )) {
        categoryMatch = true;
      } else if (rule.category === 'SCOPE_REFUSAL') {
        categoryMatch = true;
      }

      if (categoryMatch) {
        const foundKw = rule.keywords.find(k => normalized.includes(k.toLowerCase())) || 'symptom';
        return {
          isEscalation: true,
          rule,
          ruleId: rule.id,
          severity: rule.severity,
          matchedPhrase: foundKw,
          isNegated: false,
          normalizedQuery: normalized,
          timestamp: now,
        };
      }
    }
  }

  return {
    isEscalation: false,
    rule: null,
    ruleId: null,
    severity: null,
    matchedPhrase: '',
    isNegated: false,
    normalizedQuery: normalized,
    timestamp: now,
  };
}

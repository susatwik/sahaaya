import { PROTOCOL_CORPUS, ProtocolDocument, ProtocolSection } from '../../data/protocolCorpus';
import { normalizeQuery } from '../safety/escalationEngine';

export interface RetrievalResult {
  doc: ProtocolDocument;
  section: ProtocolSection;
  score: number;
  matchedTokens: string[];
}

export interface AnswerGenerationResult {
  hasAnswer: boolean;
  shortAnswer: string;
  recommendedAction: string;
  cautions: string[];
  docTitle: string;
  sectionHeading: string;
  page?: number;
  excerpt: string;
  keyPoints: string[];
  isRefusal?: boolean;
}

// Stopwords in English and Telugu code-mix
const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'what', 'when', 'how', 'why', 'who', 'lo', 'ki', 'ni', 'unte', 'emi', 'cheyali', 'undi',
  'ante', 'meeru', 'nenu', 'mariyu', 'lo'
]);

function tokenize(text: string): string[] {
  return normalizeQuery(text)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Deterministic BM25-style passage retriever operating completely offline.
 */
export class ProtocolRetriever {
  private corpus: ProtocolDocument[];

  constructor(corpus: ProtocolDocument[] = PROTOCOL_CORPUS) {
    this.corpus = corpus;
  }

  public retrieve(query: string, topK: number = 3): RetrievalResult[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const candidates: RetrievalResult[] = [];

    for (const doc of this.corpus) {
      for (const section of doc.sections) {
        const textToSearch = `${doc.title} ${doc.subtitle} ${section.heading} ${section.content} ${section.keyPoints.join(' ')}`;
        const sectionTokens = tokenize(textToSearch);
        const sectionTokenSet = new Set(sectionTokens);

        let score = 0;
        let exactMatches = 0;
        const matchedTokens: string[] = [];

        for (const token of queryTokens) {
          // Exact match
          if (sectionTokenSet.has(token)) {
            score += 3.5;
            exactMatches++;
            matchedTokens.push(token);
          } else if (token.length >= 4) {
            // Prefix stem match (useful for Telugu transliteration & compounds)
            const prefixMatch = sectionTokens.some((st) => st.length >= 4 && (st.startsWith(token) || token.startsWith(st)));
            if (prefixMatch) {
              score += 1.2;
              matchedTokens.push(token);
            }
          }
        }

        // Boost if title or heading matches
        const headingTokens = tokenize(section.heading);
        const headingOverlap = queryTokens.filter((t) => headingTokens.includes(t));
        score += headingOverlap.length * 3.0;

        if (score >= 3.5 && (exactMatches >= 1 || headingOverlap.length >= 1)) {
          candidates.push({
            doc,
            section,
            score,
            matchedTokens: Array.from(new Set(matchedTokens)),
          });
        }
      }
    }

    // Sort descending by relevance score
    return candidates.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  private createRefusal(language: 'en' | 'te'): AnswerGenerationResult {
    return {
      hasAnswer: false,
      shortAnswer: language === 'te'
        ? 'అధికారిక ప్రొటోకాల్స్‌లో ఈ ప్రశ్నకు తగిన మార్గదర్శకం లభించలేదు. దయచేసి PHC మెడికల్ ఆఫీసర్‌ను సంప్రదించండి.'
        : 'No specific protocol guidance was found in the official field documents for this query. Please consult the Medical Officer at the Primary Health Centre.',
      recommendedAction: language === 'te'
        ? 'వైద్యాధికారి సలహా లేకుండా నిర్ధారణ లేదా మందులు ఇవ్వవద్దు.'
        : 'Do not initiate unverified interventions. Escalate to the PHC Medical Officer.',
      cautions: [
        language === 'te'
          ? 'ASHA/ANM కేవలం ప్రాథమిక సంరక్షణ మరియు రిఫరల్ మాత్రమే చేయాలి.'
          : 'ASHA and ANM workers should operate within approved guidelines and not invent treatment steps.'
      ],
      docTitle: 'National Health Mission Protocol Library',
      sectionHeading: 'General Scope of Practice',
      excerpt: '',
      keyPoints: [],
      isRefusal: true,
    };
  }

  /**
   * Generates a grounded, cited answer strictly derived from the top retrieved protocol.
   * If evidence is insufficient, returns safe abstention.
   */
  public generateAnswer(query: string, language: 'en' | 'te' = 'en'): AnswerGenerationResult {
    const queryTokens = tokenize(query);
    const results = this.retrieve(query, 1);

    if (results.length === 0 || results[0].score < 3.5) {
      return this.createRefusal(language);
    }

    const best = results[0];
    const uniqueMatched = new Set(best.matchedTokens);
    const matchRatio = uniqueMatched.size / Math.max(1, queryTokens.length);

    // If query has 3 or more tokens, require at least 2 distinct tokens to match and >= 30% coverage
    if (queryTokens.length >= 3 && (uniqueMatched.size < 2 || matchRatio < 0.30)) {
      return this.createRefusal(language);
    }

    const isTe = language === 'te';

    return {
      hasAnswer: true,
      shortAnswer: isTe ? best.section.headingTe : best.section.heading,
      recommendedAction: isTe ? best.section.keyPointsTe[0] : best.section.keyPoints[0],
      cautions: best.section.cautions || [],
      docTitle: isTe ? best.doc.titleTe : best.doc.title,
      sectionHeading: isTe ? best.section.headingTe : best.section.heading,
      page: best.section.page,
      excerpt: isTe ? best.section.contentTe : best.section.content,
      keyPoints: isTe ? best.section.keyPointsTe : best.section.keyPoints,
    };
  }
}

export type EscalationSeverity = 'CRITICAL' | 'URGENT' | 'WARNING' | 'OUT_OF_SCOPE';

export type EscalationCategory = 'PREGNANCY' | 'NEWBORN' | 'CHILD' | 'NCD_CRISIS' | 'GENERAL' | 'SCOPE_REFUSAL';

export interface EscalationSource {
  title: string;
  section: string;
  page?: number;
}

export interface EscalationRule {
  id: string;
  title: string;
  titleTe: string;
  category: EscalationCategory;
  severity: EscalationSeverity;
  keywords: string[];
  patterns: RegExp[];
  negationExceptions?: string[];
  immediateAction: string;
  immediateActionTe: string;
  keyPoints: string[];
  keyPointsTe: string[];
  source: EscalationSource;
}

export const ESCALATION_RULES: EscalationRule[] = [
  {
    id: 'DANGER_ANC_BLEEDING',
    title: 'Refer Immediately: Antepartum Bleeding',
    titleTe: 'వెంటనే రెఫర్ చేయండి: గర్భధారణలో రక్తస్రావం',
    category: 'PREGNANCY',
    severity: 'CRITICAL',
    keywords: [
      'bleeding', 'raktham', 'rakthasravam', 'spotting',
      'antepartum', 'placenta previa', 'hemorrhage', 'vaginal blood',
      'blood loss', 'రక్తస్రావం', 'రక్తం'
    ],
    patterns: [
      /(3rd|third|2nd|second)\s*trimester.*(bleeding|raktham|రక్తం|రక్తస్రావం|hemorrhage)/i,
      /(bleeding|raktham|rakthasravam|spotting|రక్తం|రక్తస్రావం|hemorrhage).*(trimester|pregnant|pregnancy|garbham|గర్భ|గర్భిణీ|గర్భధారణ)/i,
      /(garbham|pregnant|garbhini|గర్భ|గర్భిణీ|గర్భధారణ).*(bleeding|raktham|rakthasravam|raktham\s*karutondi|raktham\s*paduthondi|రక్తం|రక్తస్రావం)/i,
      /bleeding.*(unte|ayithe|vasthe).*emi\s*cheyali/i,
      /3rd\s*trimester\s*lo\s*bleeding/i,
      /vaginal\s*bleeding\s*in\s*pregnancy/i,
      /antepartum\s*h(a)?emorrhage/i,
      /placenta\s*previa.*(bleeding)?/i,
      /తీవ్ర\s*రక్తస్రావం/i,
    ],
    immediateAction: 'If there is bleeding in pregnancy (2nd or 3rd trimester), refer the pregnant woman to the nearest FRU/hospital immediately.',
    immediateActionTe: 'గర్భధారణలో రక్తస్రావం కనిపిస్తే, తక్షణమే సమీపంలోని ఆసుపత్రికి పంపించండి.',
    keyPoints: [
      'Do not delay.',
      'Never perform digital vaginal examination.',
      'Arrange 108 emergency transport with left lateral tilt.',
      'Inform the doctor at the referral facility.'
    ],
    keyPointsTe: [
      'ఆలస్యం చేయవద్దు.',
      'అంతర్గత తనిఖీ చేయవద్దు.',
      '108 వాహనాన్ని పిలిపించి గర్భిణీని ఎడమవైపునకు తిప్పి పడుకోబెట్టి తీసుకెళ్ళండి.',
      'ఆసుపత్రిలోని వైద్యుడికి ముందస్తు సమాచారం ఇవ్వండి.'
    ],
    source: {
      title: 'Antenatal Care Protocol',
      section: 'Danger Signs in Pregnancy',
      page: 12
    }
  },
  {
    id: 'DANGER_ANC_ECLAMPSIA',
    title: 'Refer Immediately: Eclampsia / Fits / Severe Pre-eclampsia',
    titleTe: 'వెంటనే రెఫర్ చేయండి: ఫిట్స్ / తీవ్రమైన రక్తపోటు',
    category: 'PREGNANCY',
    severity: 'CRITICAL',
    keywords: ['convulsion', 'fits', 'seizure', 'eclampsia', 'murcha', 'blurred vision', 'severe headache pregnancy', 'ఫిట్స్', 'మూర్ఛ'],
    patterns: [
      /(fits|murcha|seizure|convulsion|ఫిట్స్|మూర్ఛ).*(pregnancy|pregnant|garbhini|prasavam|trimester|గర్భ|గర్భిణీ|గర్భధారణ)/i,
      /(garbhini|pregnant|గర్భ|గర్భిణీ).*(fits|murcha|convulsion|seizures|vachayi|vachindi|ఫిట్స్|మూర్ఛ)/i,
      /(severe\s*headache|blurred\s*vision|kallu\s*thiruguthunnayi|visual\s*disturbance).*(high\s*bp|hypertension|garbhini|pregnant|trimester|గర్భ|గర్భిణీ)/i,
      /(high\s*bp|hypertension|pregnant|garbhini).*(severe\s*headache|blurred\s*vision|visual\s*disturbance)/i,
      /(convulsions|fits)\s+in\s+.*(pregnant|gravida|trimester)/i,
      /eclampsia/i,
      /pre-?eclampsia/i,
      /(గర్భిణీ|గర్భిణి).*(ఫిట్స్|మూర్ఛ)/i,
    ],
    immediateAction: 'Fits or severe hypertension with headache/blurred vision during pregnancy indicates impending or active eclampsia. Refer to FRU immediately.',
    immediateActionTe: 'గర్భిణీలలో ఫిట్స్ లేదా తీవ్ర తలనొప్పితో కూడిన అధిక బీపీ ఎక్లాంప్సియా లక్షణం. వెంటనే FRU ఆసుపత్రికి తరలించండి.',
    keyPoints: [
      'Turn patient on her left side; keep airway open and suction secretions if needed.',
      'Do NOT insert objects, spoons, or fingers into the mouth during convulsions.',
      'If trained ANM and authorized, administer initial loading dose of Magnesium Sulfate (MgSO4).',
      'Accompany the patient with 108 emergency transport.'
    ],
    keyPointsTe: [
      'రోగిని ఎడమవైపునకు తిప్పి పడుకోబెట్టండి; గాలి ఆడేలా చూడండి.',
      'ఫిట్స్ వచ్చినప్పుడు నోట్లో చెంచాలు, తాళం చెవులు వంటి వస్తువులు పెట్టవద్దు.',
      'శిక్షణ పొందిన ANM అయితే, డాక్టర్ ప్రొటోకాల్ ప్రకారం MgSO4 మొదటి డోస్ అందించండి.',
      '108 వాహనంలో రోగితో పాటు వెంటనే ఆసుపత్రికి వెళ్ళండి.'
    ],
    source: {
      title: 'Antenatal Care Protocol (NHM / Govt of AP)',
      section: 'Hypertensive Disorders of Pregnancy & Eclampsia',
      page: 18
    }
  },
  {
    id: 'DANGER_ANC_PROM_LEAKING',
    title: 'Refer Immediately: Leaking Fluid / Water Breaking (PROM)',
    titleTe: 'వెంటనే రెఫర్ చేయండి: ఉమ్మనీరు పోవడం (PROM)',
    category: 'PREGNANCY',
    severity: 'URGENT',
    keywords: ['leaking fluid', 'water break', 'umneeru', 'prom', 'amniotic fluid', 'ఉమ్మనీరు', 'neellu potunnayi'],
    patterns: [
      /(leaking\s*(fluid|water)|water\s*broke|umneeru|neellu\s*potunnayi|ఉమ్మనీరు).*(pregnant|pregnancy|garbham|గర్భ|గర్భిణీ)/i,
      /(garbhini|pregnant|garbham|గర్భ|గర్భిణీ).*(umneeru|water\s*leaking|neellu\s*ravadam|neellu\s*potunnayi|ఉమ్మనీరు)/i,
      /premature\s*rupture\s*of\s*membranes/i,
      /(umneeru|ఉమ్మనీరు).*(paduthondi|karuthondi|potundi|ravadam|కారుతోంది)/i,
      /(watery\s*(vaginal\s*)?leaking|amniotic\s*fluid\s*leaking)/i
    ],
    immediateAction: 'Continuous leaking of watery or foul-smelling fluid indicates premature rupture of membranes. Risk of fetal distress and sepsis is high. Refer immediately.',
    immediateActionTe: 'ఉమ్మనీరు కారిపోవడం లేదా దుర్వాసనతో కూడిన ద్రవం రావడం ప్రసవ ముందస్తు ప్రమాద సంకేతం. వెంటనే రిఫర్ చేయండి.',
    keyPoints: [
      'Keep sanitary pad to monitor fluid color and volume.',
      'Do not perform vaginal digital examination.',
      'Refer to 24x7 Delivery Centre or FRU without delay.'
    ],
    keyPointsTe: [
      'ద్రవం రంగు, పరిమాణం గమనించడానికి శుభ్రమైన ప్యాడ్ ఉంచండి.',
      'అంతర్గత తనిఖీ చేయవద్దు.',
      'వెంటనే 24x7 డెలివరీ పాయింట్ లేదా FRUకి తరలించండి.'
    ],
    source: {
      title: 'Antenatal Care Protocol (NHM / Govt of AP)',
      section: 'Premature Rupture of Membranes & Infection Control',
      page: 15
    }
  },
  {
    id: 'DANGER_ANC_REDUCED_MOVEMENTS',
    title: 'Refer Promptly: Absent or Reduced Fetal Movement',
    titleTe: 'వెంటనే రెఫర్ చేయండి: కడుపులో బిడ్డ కదలికలు తగ్గడం',
    category: 'PREGNANCY',
    severity: 'URGENT',
    keywords: ['fetal movement stopped', 'bidda kadalatledu', 'baby not moving', 'కదలికలు ఆగిపోయాయి', 'bidda kadalika ledu'],
    patterns: [
      /(baby|fetal|bidda|బిడ్డ).*(not\s*moving|stopped\s*moving|kadalatledu|kadalika\s*ledu|no\s*kicks|కదలడం\s*లేదు|కదలికలు\s*ఆగిపోయాయి|కదలికలు\s*లేవు)/i,
      /(kadalika\s*taggindi|bidda\s*kadalatledu|బిడ్డ\s*కదలడం\s*లేదు|కదలికలు\s*ఆగిపోయాయి)/i,
      /(reduced|absent|stopped)\s+(fetal\s*movement|baby\s*movement|kicks)/i,
      /(fewer\s*than|less\s*than)\s*\d+\s*(kicks|movements)/i,
      /reduced\s*fetal\s*movement/i,
      /కడుపులో\s*బిడ్డ\s*కదలికలు\s*ఆగిపోయాయి/i
    ],
    immediateAction: 'Significant decrease or cessation of fetal movements (<10 movements over 12 hours) indicates potential fetal distress.',
    immediateActionTe: 'గర్భంలో బిడ్డ కదలికలు బాగా తగ్గడం లేదా ఆగిపోవడం ప్రమాద సంకేతం. వెంటనే ఆసుపత్రికి పంపండి.',
    keyPoints: [
      'Advise mother to drink cool water/eat light snack and count kicks lying on left side for 1 hour.',
      'If fewer than 4 movements in 1 hour or no movements, refer immediately for fetal heart rate auscultation and NST.'
    ],
    keyPointsTe: [
      'తల్లికి నీరు లేదా ఆహారం ఇచ్చి ఎడమవైపు పడుకొని 1 గంట కదలికలు గమనించమనండి.',
      'గంటలో 4 కంటే తక్కువ కదలికలు ఉంటే లేదా కదలికలు లేకపోతే వెంటనే ఆసుపత్రికి తరలించండి.'
    ],
    source: {
      title: 'Antenatal Care Protocol',
      section: 'Fetal Well-being & Kick Counts',
      page: 14
    }
  },
  {
    id: 'DANGER_NEWBORN_SEVERE',
    title: 'Refer Immediately: Newborn Danger Signs',
    titleTe: 'వెంటనే రెఫర్ చేయండి: నవజాత శిశువు ప్రమాద సంకేతాలు',
    category: 'NEWBORN',
    severity: 'CRITICAL',
    keywords: [
      'chest indrawing', 'hypothermia', 'unable to feed', 'cold to touch',
      'palu tagalekapotundi', 'challa badipoyindi', 'pallabadi', 'yellow palms',
      'yellow soles', 'unable to suckle', 'నవజాత శిశువు ప్రమాదం'
    ],
    patterns: [
      /(newborn|baby|infant|bidda|puttina\s*bidda|నవజాత|శిశువు).*(unable\s*to\s*(feed|breastfeed|suckle)|palu\s*tagalekapotundi|పాలు\s*తాగలేకపోతోంది)/i,
      /(newborn|baby|puttina\s*bidda|infant|నవజాత|శిశువు).*(cold\s*to\s*touch|hypothermia|challa\s*badipoyindi|చల్లగా\s*ఉంది|చల్లబడిపోయింది)/i,
      /(newborn|baby|puttina\s*bidda|bidda|infant|నవజాత|శిశువు).*(severe\s*chest\s*indrawing|chathi\s*lopalki|fast\s*breathing)/i,
      /(yellow\s*palms|yellow\s*soles|severe\s*jaundice).*(baby|newborn|infant|bidda)?/i,
      /(newborn|infant|bidda).*(convulsions|fits|seizure|murcha)/i,
      /(నవజాత|శిశువు).*(పాలు\s*తాగలేకపోతోంది|చల్లగా\s*ఉంది)/i,
      /chathi\s*lopalki/i
    ],
    immediateAction: 'Newborn danger signs (unable to suckle, cold to touch, severe chest in-drawing, convulsions, jaundice on palms/soles) require emergency care at an SNCU.',
    immediateActionTe: 'నవజాత శిశువు పాలు తాగలేకపోవడం, చల్లబడిపోవడం, ఛాతీ లోపలికి పీల్చడం, ఫిట్స్ వంటివి తీవ్ర ప్రమాద సంకేతాలు. వెంటనే SNCU కి పంపండి.',
    keyPoints: [
      'Provide Kangaroo Mother Care (skin-to-skin contact) to prevent hypothermia during transit.',
      'Ensure airway is clear and baby is breathing.',
      'Do not give water, animal milk, or herbal drops.',
      'Call 108 ambulance and escort to the Special Newborn Care Unit (SNCU).'
    ],
    keyPointsTe: [
      'ప్రయాణంలో బిడ్డ చల్లబడకుండా కంగారూ మదర్ కేర్ (KMC) ద్వారా వెచ్చదనం అందించండి.',
      'శ్వాస సరిగ్గా ఆడుతుందో లేదో చూడండి.',
      'నీళ్లు, ఆవు పాలు, ఉగ్గు లేదా మరే ఇతర ద్రావణాలు పట్టవద్దు.',
      '108 వాహనంలో వెంటనే SNCU కు తరలించండి.'
    ],
    source: {
      title: 'Integrated Management of Neonatal & Childhood Illness (IMNCI)',
      section: 'Newborn Danger Signs & SNCU Referral',
      page: 8
    }
  },
  {
    id: 'DANGER_CHILD_SEVERE_DEHYDRATION',
    title: 'Emergency: Child Severe Dehydration & Lethargy',
    titleTe: 'అత్యవసరం: తీవ్రమైన నీళ్ల విరోచనాలు మరియు నిర్జలీకరణ',
    category: 'CHILD',
    severity: 'CRITICAL',
    keywords: [
      'severe dehydration', 'sunken eyes', 'skin pinch slow', 'lethargic child',
      'neella virochanalu', 'spruha ledu', 'నీళ్ల విరోచనాలు', 'స్పృహ తప్పింది'
    ],
    patterns: [
      /(child|baby|bidda|పిల్లవాడికి|బిడ్డ).*(severe\s*dehydration|sunken\s*eyes|skin\s*pinch.*slow|slow.*skin\s*pinch|స్పృహ\s*తప్పింది)/i,
      /(diarrh(o)?ea|vomiting|neella\s*virochana|నీళ్ల\s*విరోచనాలు).*(unconscious|lethargic|spruha\s*ledu|mathu|స్పృహ\s*తప్పింది|mathu\s*ga)/i,
      /(child|toddler|pillodu).*(unable\s*to\s*drink|vomits\s*everything)/i,
      /(skin\s*pinch.*(slowly|>|2\s*sec))/i,
      /(cholera-like|severe\s*dehydration)/i
    ],
    immediateAction: 'Child shows signs of severe dehydration or lethargy. Requires immediate intravenous (IV) fluid resuscitation at PHC/Hospital.',
    immediateActionTe: 'పిల్లల్లో కళ్లు గుంటలు పడటం, చర్మం నెమ్మదిగా వెళ్లడం, స్పృహ లేకపోవడం తీవ్ర నిర్జలీకరణ సంకేతాలు. వెంటనే IV ఫ్లూయిడ్స్ అందించడానికి ఆసుపత్రికి పంపండి.',
    keyPoints: [
      'If child is conscious and can drink, give ORS in small sips while arranging transport.',
      'Do NOT force fluids if child is unconscious or convulsing.',
      'Rush immediately to the nearest PHC or Area Hospital for IV Ringer Lactate.',
      'Advise continuous breastfeeding if infant is willing to suckle.'
    ],
    keyPointsTe: [
      'పిల్లవాడు స్పృహలో ఉంటే ప్రయాణ సమయంలో నెమ్మదిగా ORS చుక్కలుగా ఇవ్వండి.',
      'స్పృహ లేకపోతే లేదా ఫిట్స్ ఉంటే బలవంతంగా నోట్లో ఏమీ పోయవద్దు.',
      'వెంటనే PHC లేదా ఆసుపత్రికి తీసుకెళ్ళి సెలైన్ (IV) పెట్టించండి.'
    ],
    source: {
      title: 'Child Health & IMNCI Protocol',
      section: 'Management of Diarrhoea with Severe Dehydration',
      page: 24
    }
  },
  {
    id: 'DANGER_NCD_HYPERTENSIVE_CRISIS',
    title: 'Refer Urgently: Hypertensive Crisis / Cardiac Emergency',
    titleTe: 'వెంటనే రెఫర్ చేయండి: తీవ్రమైన రక్తపోటు / గుండె నొప్పి',
    category: 'NCD_CRISIS',
    severity: 'CRITICAL',
    keywords: [
      '180/110', 'bp 180', 'chest pain radiating', 'crushing chest pain',
      'stroke', 'gunde noppi radiating', 'గుండె నొప్పి', 'తీవ్రమైన రక్తపోటు'
    ],
    patterns: [
      /(bp|blood\s*pressure)\s*(is|of|was|measures|:)?\s*(1[89]\d|2\d\d)\b/i,
      /(bp|blood\s*pressure)\s*(is|of|was|measures|:)?\s*\d{2,3}\s*\/\s*(1[1-9]\d|2\d\d)\b/i,
      /(bp|blood\s*pressure)\s*(>|>=|over)?\s*180/i,
      /(severe\s*chest\s*pain|crushing.*chest\s*pain|gunde\s*noppi|గుండె\s*నొప్పి).*(sweating|breathlessness|arm\s*pain|radiating|aayasam|చెమటలు)/i,
      /(facial\s*droop|arm\s*weakness|slurred\s*speech|stroke)/i,
      /తీవ్రమైన\s*గుండె\s*నొప్పి/i,
      /hypertensive\s*crisis/i
    ],
    immediateAction: 'Systolic BP >= 180 mmHg or Diastolic >= 110 mmHg, or severe crushing chest pain requires immediate emergency medical evaluation.',
    immediateActionTe: 'బీపీ 180/110 కంటే ఎక్కువ ఉన్నా, తీవ్రమైన గుండెనొప్పి ఉన్నా గుండెపోటు లేదా పక్షవాత ప్రమాదం ఉంటుంది. వెంటనే రెఫర్ చేయండి.',
    keyPoints: [
      'Keep patient calm, seated or in semi-reclined posture.',
      'Do not allow patient to walk or exert physical effort.',
      'Do NOT give arbitrary anti-hypertensive drugs without doctor orders.',
      'Call 108 ambulance for immediate transit to Emergency Department.'
    ],
    keyPointsTe: [
      'రోగిని కూర్చోబెట్టి ప్రశాంతంగా ఉంచండి; నడవనివ్వవద్దు.',
      'డాక్టర్ సలహా లేకుండా ఇతర మందులు ఇవ్వవద్దు.',
      'వెంటనే 108 వాహనాన్ని పిలిపించి సమీప ఆసుపత్రికి పంపండి.'
    ],
    source: {
      title: 'NPCDCS Operational Guidelines',
      section: 'Hypertensive Crises and Acute Coronary Syndromes',
      page: 31
    }
  },
  {
    id: 'DANGER_SCOPE_REFUSAL',
    title: 'Out of Scope: Medication Prescription / Medical Diagnosis',
    titleTe: 'పరిధి దాటిన అభ్యర్థన: మందుల సూచన / వైద్య నిర్ధారణ',
    category: 'SCOPE_REFUSAL',
    severity: 'OUT_OF_SCOPE',
    keywords: ['prescribe', 'dose of antibiotic', 'injection to abort', 'steroid dose', 'diagnose cancer', 'mandulu rayandi', 'injection ivvacha'],
    patterns: [
      /(prescribe|dose\s*of|give)\s*(antibiotic|steroid|injection|schedule\s*h)/i,
      /(how\s*to\s*abort|abortion\s*pill|mifepristone|misoprostol\s*dose)/i,
      /(diagnose|confirm)\s*(cancer|tumor|appendicitis)/i,
      /(mandulu\s*cheppandi|injection\s*veyaala|tablet\s*dose\s*cheppandi)/i
    ],
    immediateAction: 'Frontline health workers (ASHA/ANM) cannot prescribe Schedule H antibiotics, initiate abortion regimens, or diagnose complex systemic illnesses. Direct the beneficiary to the Medical Officer at the PHC.',
    immediateActionTe: 'ASHA మరియు ANM కార్యకర్తలు యాంటీబయాటిక్స్ లేదా అబార్షన్ మందులను సిఫార్సు చేయకూడదు. రోగిని PHC వైద్య అధికారి వద్దకు పంపించండి.',
    keyPoints: [
      'Frontline health workers provide supportive care, screening, adherence counseling, and referral.',
      'Prescription medicines require formal evaluation by a registered Medical Officer.',
      'Never recommend unverified medications or unofficial dosage adjustments.'
    ],
    keyPointsTe: [
      'ఆరోగ్య కార్యకర్తలు ప్రాథమిక పరీక్షలు మరియు ఆసుపత్రికి పంపే బాధ్యత మాత్రమే నిర్వహిస్తారు.',
      'మందుల సూచన వైద్యుల ద్వారా మాత్రమే జరగాలి.',
      'ఎటువంటి అనధికార మందులు లేదా డోస్‌లను సూచించకూడదు.'
    ],
    source: {
      title: 'ASHA & ANM Job Responsibilities Handbook (Govt of AP)',
      section: 'Scope of Practice and Prescription Boundaries',
      page: 4
    }
  }
];

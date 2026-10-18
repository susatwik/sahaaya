export interface ProtocolSection {
  id: string;
  heading: string;
  headingTe: string;
  page: number;
  content: string;
  contentTe: string;
  keyPoints: string[];
  keyPointsTe: string[];
  cautions?: string[];
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
  icon: string; // lucide icon identifier
  sections: ProtocolSection[];
}

export const PROTOCOL_CORPUS: ProtocolDocument[] = [
  {
    id: 'antenatal-care',
    category: 'antenatal',
    title: 'Antenatal Care (ANC) Guidelines',
    titleTe: 'గర్భిణీ సంరక్షణ (ANC) మార్గదర్శకాలు',
    subtitle: 'Schedule, check-ups, danger signs',
    subtitleTe: 'షెడ్యూల్, పరీక్షలు, ప్రమాద సంకేతాలు',
    sourceDoc: 'NHM / Commissionerate of Health & Family Welfare, AP (2024)',
    version: '4.2',
    lastUpdated: '2026-01-15',
    icon: 'UserCheck',
    sections: [
      {
        id: 'anc-schedule',
        heading: 'Mandatory ANC Check-up Schedule',
        headingTe: 'తప్పనిసరి ANC పరీక్షల షెడ్యూల్',
        page: 6,
        content: 'Every pregnant woman must receive at least 4 comprehensive antenatal visits. Visit 1: Within first 12 weeks (as soon as pregnancy is suspected). Visit 2: 14 to 26 weeks. Visit 3: 28 to 34 weeks (critical for identifying anemia, pre-eclampsia, IUGR). Visit 4: 36 weeks to term (delivery preparedness). On each visit, check weight, BP, hemoglobin, abdominal examination, fetal heart rate, and urine albumin/sugar.',
        contentTe: 'ప్రతి గర్భిణీ స్త్రీ కనీసం 4 సార్లు సమగ్ర ANC పరీక్షలు చేయించుకోవాలి. 1వ సందర్శన: మొదటి 12 వారాల్లోపు. 2వ సందర్శన: 14 నుండి 26 వారాలు. 3వ సందర్శన: 28 నుండి 34 వారాలు (రక్తహీనత, అధిక రక్తపోటు గుర్తించడానికి ముఖ్యం). 4వ సందర్శన: 36 వారాల నుండి ప్రసవం వరకు. ప్రతి సందర్శనలో బరువు, బీపీ, రక్తహీనత పరీక్ష చేయాలి.',
        keyPoints: [
          'Register pregnancy within first trimester (<12 weeks) on RCH portal.',
          'Minimum 4 ANC visits must be conducted by ANM / Medical Officer.',
          'Provide 180 Iron Folic Acid (IFA) tablets and 360 Calcium tablets after first trimester.',
          'Administer 2 doses of Td vaccine (or 1 Td booster if vaccinated in past 3 years).'
        ],
        keyPointsTe: [
          'మొదటి 12 వారాల్లోపు RCH పోర్టల్‌లో గర్భధారణను నమోదు చేయండి.',
          'కనీసం 4 ANC చెకప్‌లు తప్పనిసరిగా పూర్తి చేయాలి.',
          'మొదటి త్రైమాసికం తర్వాత 180 ఐరన్ ఫోలిక్ యాసిడ్ (IFA) మరియు 360 కాల్షియం మాత్రలు ఇవ్వండి.',
          '2 డోసుల Td టీకా అందించాలి.'
        ],
        cautions: [
          'Never administer iron tablets on an empty stomach to reduce gastrointestinal irritation.',
          'Do not take Calcium and IFA tablets together; maintain a 2-hour gap.'
        ]
      },
      {
        id: 'anc-danger-signs',
        heading: 'Danger Signs in Pregnancy',
        headingTe: 'గర్భధారణలో ప్రమాద సంకేతాలు',
        page: 12,
        content: 'The major obstetric danger signs requiring immediate referral to First Referral Units (FRUs) are: 1. Vaginal bleeding at any stage of pregnancy (Antepartum Hemorrhage). 2. Convulsions or fits (Eclampsia). 3. Severe headache with blurred vision or severe epigastric pain. 4. High fever with chills or foul vaginal discharge. 5. Leaking amniotic fluid before onset of labor (PROM). 6. Marked reduction or cessation of fetal movements. 7. Severe breathlessness at rest.',
        contentTe: 'వెంటనే FRU లేదా ఏరియా ఆసుపత్రికి రిఫర్ చేయవలసిన ప్రమాద సంకేతాలు: 1. గర్భధారణలో ఎప్పుడైనా రక్తస్రావం కనిపించడం. 2. ఫిట్స్ రావడం. 3. తీవ్రమైన తలనొప్పి, కళ్లు తిరగడం, చూపు మసకబారడం. 4. చలితో కూడిన తీవ్ర జ్వరం. 5. ఉమ్మనీరు కారడం. 6. కడుపులో బిడ్డ కదలికలు తగ్గడం లేదా ఆగిపోవడం.',
        keyPoints: [
          'Arrange emergency 108 ambulance without delay.',
          'Keep patient in left lateral tilt position during transport.',
          'Never perform digital per-vaginal (PV) examination in bleeding.',
          'Inform receiving facility doctor in advance.'
        ],
        keyPointsTe: [
          'వెంటనే 108 అంబులెన్స్ ద్వారా తరలించండి.',
          'గర్భిణీని ఎడమ వైపునకు ఒరిగేలా పడుకోబెట్టాలి.',
          'రక్తస్రావం ఉన్నప్పుడు లోపలి పరీక్ష (PV) అస్సలు చేయవద్దు.',
          'ఆసుపత్రి సిబ్బందికి ముందుగానే సమాచారం ఇవ్వండి.'
        ],
        cautions: [
          'Delays in referral for antepartum hemorrhage or eclampsia are primary causes of maternal mortality.'
        ]
      }
    ]
  },
  {
    id: 'immunisation',
    category: 'immunisation',
    title: 'Universal Immunisation Programme (UIP)',
    titleTe: 'సార్వత్రిక వ్యాక్సినేషన్ షెడ్యూల్ (UIP)',
    subtitle: 'Full schedule and due ages',
    subtitleTe: 'పూర్తి టీకాల షెడ్యూల్ మరియు వయస్సు',
    sourceDoc: 'Ministry of Health & Family Welfare / UIP Guidelines (2024)',
    version: '5.1',
    lastUpdated: '2026-02-01',
    icon: 'Syringe',
    sections: [
      {
        id: 'uip-birth-to-1yr',
        heading: 'Vaccines Due from Birth to 1 Year',
        headingTe: 'పుట్టినప్పటి నుండి 1 సంవత్సరం వరకు టీకాలు',
        page: 4,
        content: 'At birth: BCG, OPV 0 dose, Hepatitis B birth dose (within 24 hours). At 6 weeks: OPV 1, Pentavalent 1 (DPT+HepB+Hib), Rotavirus 1, fIPV 1 (fractional IPV intradermal), PCV 1 (Pneumococcal). At 10 weeks: OPV 2, Pentavalent 2, Rotavirus 2. At 14 weeks: OPV 3, Pentavalent 3, Rotavirus 3, fIPV 2, PCV 2. At 9-12 completed months: MR 1st dose (Measles-Rubella), JE 1st dose (endemic districts), PCV Booster, Vitamin A (1 ml / 1 lakh IU).',
        contentTe: 'పుట్టినప్పుడు: BCG, OPV 0, హెపటైటిస్ B (24 గంటల్లో). 6 వారాలకు: OPV 1, పెంటావాలెంట్ 1, రోటావైరస్ 1, fIPV 1, PCV 1. 10 వారాలకు: OPV 2, పెంటావాలెంట్ 2, రోటావైరస్ 2. 14 వారాలకు: OPV 3, పెంటావాలెంట్ 3, రోటావైరస్ 3, fIPV 2, PCV 2. 9-12 నెలలకు: MR 1st డోస్, JE 1, PCV బూస్టర్, విటమిన్ A (1 లక్ష IU).',
        keyPoints: [
          'Hepatitis B birth dose must be administered within 24 hours of birth.',
          'Pentavalent protects against 5 diseases: Diphtheria, Pertussis, Tetanus, Hepatitis B, and Hib pneumonia/meningitis.',
          'Always observe infant for 30 minutes post-vaccination for AEFI (Adverse Events Following Immunization).'
        ],
        keyPointsTe: [
          'హెపటైటిస్ B పుట్టిన డోస్ 24 గంటలలోపు ఇవ్వాలి.',
          'పెంటావాలెంట్ 5 ప్రాణాంతక వ్యాధుల నుండి రక్షిస్తుంది.',
          'టీకా వేసిన తర్వాత 30 నిమిషాలు శిశువును గమనించాలి.'
        ],
        cautions: [
          'Do not apply hot or cold compression, oil, or turmeric at the injection site.'
        ]
      },
      {
        id: 'uip-boosters',
        heading: 'Booster Doses & Older Children',
        headingTe: 'బూస్టర్ డోసులు మరియు పిల్లల టీకాలు',
        page: 7,
        content: 'At 16-24 months: MR 2nd dose, DPT 1st Booster, OPV Booster, JE 2nd dose, Vitamin A (2 ml / 2 lakh IU). At 5-6 years: DPT 2nd Booster. At 10 years: Td (Tetanus and adult Diphtheria). At 16 years: Td vaccine.',
        contentTe: '16-24 నెలలకు: MR 2, DPT 1వ బూస్టర్, OPV బూస్టర్, విటమిన్ A (2 లక్షల IU). 5-6 సంవత్సరాలకు: DPT 2వ బూస్టర్. 10 సంవత్సరాలకు: Td టీకా. 16 సంవత్సరాలకు: Td టీకా.',
        keyPoints: [
          'DPT booster at 16-24 months is essential for sustaining immunity against whooping cough and diphtheria.',
          'Vitamin A bi-annual supplementation continues every 6 months until age 5 (total 9 doses).'
        ],
        keyPointsTe: [
          '16-24 నెలల్లో DPT బూస్టర్ ఇవ్వడం చాలా ముఖ్యం.',
          '5 సంవత్సరాల వయస్సు వరకు ప్రతి 6 నెలలకోసారి విటమిన్ A ద్రావణం తాగించాలి.'
        ]
      }
    ]
  },
  {
    id: 'child-health',
    category: 'child_health',
    title: 'Child Health & Malnutrition Protocol',
    titleTe: 'శిశు ఆరోగ్యం మరియు పోషకాహార లోపం ప్రొటోకాల్',
    subtitle: 'Newborn care, fever, ORS, malnutrition',
    subtitleTe: 'నవజాత శిశు సంరక్షణ, జ్వరం, ORS, పోషకాహారం',
    sourceDoc: 'National Child Health Programme / IMNCI Operational Guidelines',
    version: '3.8',
    lastUpdated: '2025-11-20',
    icon: 'Baby',
    sections: [
      {
        id: 'muac-screening',
        heading: 'Malnutrition Assessment using MUAC',
        headingTe: 'MUAC టేప్ ద్వారా పోషకాహార లోపం పరీక్ష',
        page: 16,
        content: 'Mid-Upper Arm Circumference (MUAC) is measured in children 6 to 59 months using the color-coded tape on the left arm midway between the shoulder tip and elbow. Green (>12.5 cm): Normal nutrition status. Yellow (11.5 cm to 12.5 cm): Moderate Acute Malnutrition (MAM) - provide counseling and supplementary nutrition at Anganwadi. Red (<11.5 cm) or bilateral pitting edema: Severe Acute Malnutrition (SAM) - immediate referral to Nutrition Rehabilitation Centre (NRC).',
        contentTe: '6 నుండి 59 నెలల పిల్లలలో ఎడమ చేతి మధ్యభాగంలో MUAC టేప్ ద్వారా కొలుస్తారు. ఆకుపచ్చ (>12.5 సెం.మీ): సాధారణం. పసుపు (11.5 - 12.5 సెం.మీ): మధ్యస్థ పోషకాహార లోపం (MAM) - అంగన్‌వాడీ ద్వారా బాలామృతం అందించాలి. ఎరుపు (<11.5 సెం.మీ) లేదా కాళ్ల వాపులు: తీవ్ర పోషకాహార లోపం (SAM) - వెంటనే NRC కేంద్రానికి పంపాలి.',
        keyPoints: [
          'Always check for bilateral pitting pedal edema by pressing both feet with thumbs for 3 seconds.',
          'Children with Red MUAC or edema must be accompanied to NRC for therapeutic feeding.',
          'Ensure mother continues frequent breastfeeding.'
        ],
        keyPointsTe: [
          'రెండు కాళ్ల వాపులు ఉన్నాయో లేదో బొటనవేలితో నొక్కి 3 సెకన్లు పరీక్షించండి.',
          'ఎరుపు రంగు లేదా వాపులు ఉన్న పిల్లలను తక్షణమే NRC కి పంపించండి.'
        ]
      },
      {
        id: 'diarrhea-ors',
        heading: 'Diarrhea Management: ORS & Zinc Protocol',
        headingTe: 'విరోచనాల నిర్వహణ: ORS & జింక్ ప్రొటోకాల్',
        page: 21,
        content: 'For acute watery diarrhea in children without severe dehydration: 1. Give Oral Rehydration Salts (ORS) solution. Dissolve 1 whole packet of WHO-ORS in exactly 1 litre of clean drinking water. Give after each loose stool: <2 years: 50-100 ml; >=2 years: 100-200 ml. Discard mixed solution after 24 hours. 2. Give Zinc tablets for full 14 days even after diarrhea stops: Age <6 months: 10 mg/day dissolved in breast milk; Age >=6 months: 20 mg/day dissolved in clean water.',
        contentTe: 'నీళ్ల విరోచనాలు ఉన్నప్పుడు: 1. WHO-ORS ప్యాకెట్‌ను 1 లీటరు స్వచ్ఛమైన నీటిలో కలపాలి. విరోచనం అయిన ప్రతిసారీ తాగించాలి: 2 సంవత్సరాల లోపు పిల్లలకు 50-100 మి.లీ; 2 ఏళ్లు దాటిన వారికి 100-200 మి.లీ. కలిపిన నీటిని 24 గంటల తర్వాత పారబోయాలి. 2. జింక్ మాత్రలను 14 రోజుల పాటు తప్పకుండా ఇవ్వాలి (6 నెలల లోపు: 10mg, 6 నెలలు దాటిన వారికి: 20mg).',
        keyPoints: [
          'Continue regular breastfeeding and age-appropriate soft feeding during diarrhea.',
          'Zinc reduces severity, duration, and prevents recurrence of diarrhea for the next 3 months.',
          'Never use anti-diarrheal or anti-motility drugs in children.'
        ],
        keyPointsTe: [
          'తల్లిపాలు మరియు సాధారణ ఆహారం ఆపకూడదు.',
          'జింక్ మాత్రలు తదుపరి 3 నెలల వరకు విరోచనాలు రాకుండా రక్షిస్తాయి.',
          'పిల్లలకు ఎట్టి పరిస్థితుల్లోనూ మోషన్ ఆపే మందులు వేయకూడదు.'
        ]
      }
    ]
  },
  {
    id: 'chronic-diseases',
    category: 'chronic',
    title: 'Chronic Diseases & NCD Guidelines',
    titleTe: 'దీర్ఘకాలిక వ్యాధుల మార్గదర్శకాలు (NCD)',
    subtitle: 'Hypertension, Diabetes follow-up',
    subtitleTe: 'హైపర్‌టెన్షన్, డయాబెటిస్ ఫాలో-అప్',
    sourceDoc: 'NPCDCS / Directorate of Health & Family Welfare, AP',
    version: '2.5',
    lastUpdated: '2025-10-10',
    icon: 'Activity',
    sections: [
      {
        id: 'hypertension-screening',
        heading: 'Hypertension Screening & Management',
        headingTe: 'రక్తపోటు (బీపీ) పరీక్ష మరియు నిర్వహణ',
        page: 18,
        content: 'All individuals aged 30 years and above must be screened for hypertension annually. Classification: Normal: <120/80 mmHg. Pre-hypertension: 120-139 / 80-89 mmHg (lifestyle modification). Stage 1 Hypertension: 140-159 / 90-99 mmHg (confirm on 2 separate visits, refer to Medical Officer). Stage 2: >=160 / >=100 mmHg (immediate referral). Hypertensive Crisis: >=180 / >=110 mmHg (emergency referral).',
        contentTe: '30 సంవత్సరాలు పైబడిన ప్రతి ఒక్కరికీ ఏటా బీపీ పరీక్ష చేయాలి. సాధారణం: <120/80 mmHg. ప్రీ-హైపర్‌టెన్షన్: 120-139 / 80-89. స్టేజ్ 1: 140-159 / 90-99 (డాక్టర్‌కు రిఫర్ చేయాలి). స్టేజ్ 2: 160/100 పైబడి. అత్యవసర సంక్షోభం: >=180/110 mmHg (తక్షణ అత్యవసర చికిత్స).',
        keyPoints: [
          'Patient must be seated and resting quietly for at least 5 minutes before BP measurement.',
          'Use appropriate cuff size (bladder covers 80% of upper arm).',
          'Counsel on low salt intake (<5g / 1 level teaspoon daily), avoid pickles, papads.',
          'Check medication compliance on every monthly home visit.'
        ],
        keyPointsTe: [
          'బీపీ చూసే ముందు రోగిని కనీసం 5 నిమిషాలు ప్రశాంతంగా కూర్చోబెట్టాలి.',
          'ఉప్పు వాడకం రోజుకు 5 గ్రాముల కంటే తక్కువగా తగ్గించాలి (ఊరగాయలు, అప్పడాలు మానాలి).',
          'ప్రతి నెలా క్రమం తప్పకుండా మందులు వేసుకుంటున్నారో లేదో చూడాలి.'
        ]
      },
      {
        id: 'diabetes-followup',
        heading: 'Type 2 Diabetes Screening & Foot Care',
        headingTe: 'డయాబెటిస్ (షుగర్) పరీక్ష మరియు పాదాల సంరక్షణ',
        page: 25,
        content: 'Screen with glucometer in all adults >=30 years. Fasting blood glucose >=126 mg/dL or Random blood glucose >=200 mg/dL with symptoms (polyuria, polydipsia, weight loss) indicates diabetes. Emphasize daily foot inspection for non-healing ulcers, corns, cracks, or loss of sensation to prevent diabetic foot complications.',
        contentTe: '30 ఏళ్లు దాటిన వారికి గ్లూకోమీటర్ ద్వారా పరీక్ష చేయాలి. పరగడుపున షుగర్ >=126 mg/dL లేదా రాండమ్ >=200 mg/dL ఉంటే మధుమేహం ఉండవచ్చు. పుండ్లు, పగుళ్లు లేదా స్పర్శ కోల్పోవడం గమనించడానికి ప్రతిరోజూ పాదాలను పరిశీలించాలి.',
        keyPoints: [
          'Never walk barefoot, inspect shoes before wearing.',
          'Wash feet with lukewarm water and dry carefully between toes.',
          'Encourage 30 minutes of brisk walking 5 days a week.'
        ],
        keyPointsTe: [
          'పాదరక్షలు లేకుండా నడవకూడదు.',
          'రోజూ పాదాలను పరిశుభ్రంగా కడిగి వేళ్ల మధ్య తడి లేకుండా తుడుచుకోవాలి.',
          'రోజుకు కనీసం 30 నిమిషాలు నడక అలవాటు చేసుకోవాలి.'
        ]
      }
    ]
  },
  {
    id: 'danger-signs-guide',
    category: 'danger_signs',
    title: 'Emergency Danger Signs & Referral',
    titleTe: 'అత్యవసర ప్రమాద సంకేతాలు & రిఫరల్',
    subtitle: 'When to refer immediately',
    subtitleTe: 'వెంటనే ఎప్పుడు రిఫర్ చేయాలి',
    sourceDoc: 'Comprehensive Emergency Obstetric & Neonatal Care (CEmONC) Guidelines',
    version: '4.0',
    lastUpdated: '2026-01-05',
    icon: 'AlertTriangle',
    sections: [
      {
        id: 'emergency-triage',
        heading: 'Community Referral & 108 Emergency Protocol',
        headingTe: 'కమ్యూనిటీ రిఫరల్ మరియు 108 అత్యవసర ప్రొటోకాల్',
        page: 2,
        content: 'When an emergency danger sign is identified: 1. Stay calm and assure the patient and family. 2. Contact 108 ambulance immediately, clearly specifying the obstetric or neonatal emergency condition. 3. Accompany the patient or ensure an ASHA worker travels with the patient carrying the MCP card, RCH ID, and recent test reports. 4. Pre-notify the receiving Medical Officer / FRU staff so blood transfusion or emergency OT is mobilized.',
        contentTe: 'అత్యవసర ప్రమాద సంకేతం కనిపించినప్పుడు: 1. రోగి మరియు కుటుంబానికి ధైర్యం చెప్పండి. 2. వెంటనే 108 కు కాల్ చేసి పరిస్థితిని స్పష్టంగా వివరించండి. 3. MCP కార్డు, టెస్ట్ రిపోర్టులతో ASHA కార్యకర్త తోడుగా వెళ్ళాలి. 4. ఆసుపత్రి సిబ్బందికి ముందుగానే సమాచారం ఇవ్వండి.',
        keyPoints: [
          'Dial 108 without waiting for local transport or home treatments.',
          'Carry MCP Card (Mother and Child Protection Card) and Aarogyasri Card.',
          'Keep patient hydrated if conscious; do not feed if unconscious.'
        ],
        keyPointsTe: [
          'స్థానిక నాటు వైద్యం కోసం వేచి చూడకుండా 108 కి కాల్ చేయండి.',
          'తప్పనిసరిగా MCP కార్డ్ మరియు ఆరోగ్యశ్రీ కార్డులను వెంట తీసుకెళ్లండి.'
        ]
      }
    ]
  },
  {
    id: 'job-aids',
    category: 'job_aids',
    title: 'ASHA Job Aids & Field Checklists',
    titleTe: 'ASHA జాబ్ ఎయిడ్స్ & ఫీల్డ్ చెక్‌లిస్ట్‌లు',
    subtitle: 'Checklists and charts',
    subtitleTe: 'చెక్‌లిస్ట్‌లు మరియు చార్ట్‌లు',
    sourceDoc: 'Government of Andhra Pradesh Frontline Health Worker Handbook',
    version: '3.1',
    lastUpdated: '2025-12-01',
    icon: 'FileText',
    sections: [
      {
        id: 'home-visit-checklist',
        heading: 'Routine Home Visit Checklist',
        headingTe: 'సాధారణ ఇంటి సందర్శన చెక్‌లిస్ట్',
        page: 5,
        content: 'Essential steps during every routine home visit: 1. Greet family with warmth and respect. 2. Inquire about general well-being of mother, children, and elderly. 3. Check immunization status of infants and children against age. 4. Verify IFA, Calcium, and NCD medication stock and daily intake. 5. Screen for danger signs (fever, diarrhea, cough, chest pain). 6. Record findings immediately in Sahaaya field register. 7. Confirm next scheduled visit date.',
        contentTe: 'ప్రతి ఇంటి సందర్శనలో తప్పనిసరి దశలు: 1. కుటుంబ సభ్యులను ఆప్యాయంగా పలకరించండి. 2. తల్లి, పిల్లలు, వృద్ధుల ఆరోగ్యంపై ఆరా తీయండి. 3. టీకాల కార్డును పరిశీలించండి. 4. మందుల వాడకాన్ని తనిఖీ చేయండి. 5. ప్రమాద సంకేతాలను గమనించండి. 6. వివరాలను వెంటనే నమోదు చేయండి. 7. తదుపరి సందర్శన తేదీని తెలియజేయండి.',
        keyPoints: [
          'Document every completed visit and outcome immediately.',
          'Never leave an identified high-risk beneficiary without follow-up counseling.'
        ],
        keyPointsTe: [
          'పూర్తయిన ప్రతి సందర్శన వివరాలను వెంటనే నమోదు చేయండి.',
          'హై రిస్క్ ఉన్న వారిని ప్రత్యేకంగా పర్యవేక్షించండి.'
        ]
      }
    ]
  }
];

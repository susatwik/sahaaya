import { Household, Member, Visit } from '../core/storage/db';

export const BASE_5_HOUSEHOLDS: Household[] = [
  {
    id: 'AP-00123',
    headOfHousehold: 'Lakshmi Family',
    headOfHouseholdTe: 'లక్ష్మి కుటుంబం',
    village: 'Rythu Basti',
    ward: 'Ward 5',
    address: 'Door No 4-22, Near Water Tank, Rythu Basti',
    rationCard: 'WAP05128934',
    membersCount: 3,
    highRiskCount: 1,
    createdAt: '2026-08-10',
    updatedAt: '2026-10-15',
  },
  {
    id: 'AP-00124',
    headOfHousehold: 'Raju Family',
    headOfHouseholdTe: 'రాజు కుటుంబం',
    village: 'Kothapeta',
    ward: 'Ward 2',
    address: 'Door No 1-45, School Street, Kothapeta',
    rationCard: 'WAP05128935',
    membersCount: 4,
    highRiskCount: 0,
    createdAt: '2026-07-12',
    updatedAt: '2026-10-14',
  },
  {
    id: 'AP-00125',
    headOfHousehold: 'Saraswati Family',
    headOfHouseholdTe: 'సరస్వతి కుటుంబం',
    village: 'Gandhi Nagar',
    ward: 'Ward 4',
    address: 'Door No 7-88, Temple Lane, Gandhi Nagar',
    rationCard: 'WAP05128936',
    membersCount: 3,
    highRiskCount: 1,
    createdAt: '2026-06-01',
    updatedAt: '2026-10-15',
  },
  {
    id: 'AP-00126',
    headOfHousehold: 'Imran Family',
    headOfHouseholdTe: 'ఇమ్రాన్ కుటుంబం',
    village: 'Ramalayam Veedhi',
    ward: 'Ward 1',
    address: 'Door No 2-10, Masjid Road, Ramalayam Veedhi',
    rationCard: 'WAP05128937',
    membersCount: 5,
    highRiskCount: 0,
    createdAt: '2026-08-01',
    updatedAt: '2026-10-15',
  },
  {
    id: 'AP-00127',
    headOfHousehold: 'Anasuya Family',
    headOfHouseholdTe: 'అనసూయ కుటుంబం',
    village: 'Rythu Basti',
    ward: 'Ward 5',
    address: 'Door No 4-30, Rythu Basti',
    rationCard: 'WAP05128938',
    membersCount: 4,
    highRiskCount: 1,
    createdAt: '2026-05-10',
    updatedAt: '2026-10-12',
  }
];

export const BASE_5_MEMBERS: Member[] = [
  // Lakshmi Family (AP-00123)
  {
    id: 'M-123-1',
    householdId: 'AP-00123',
    name: 'Lakshmi',
    nameTe: 'లక్ష్మి',
    age: '24 years',
    gender: 'FEMALE',
    relationship: 'Self (Mother)',
    relationshipTe: 'స్వయంగా (తల్లి)',
    isPregnant: true,
    gestationalWeeks: 28,
    gravidaPara: 'G3P1',
    highRisk: true,
    highRiskReason: 'Previous Cesarean + Moderate Anemia (Hb 9.2 g/dL)',
    dueService: 'ANC check-up due (3rd ANC)',
    dueServiceTe: 'ANC పరీక్ష గడువు (3వ ANC)',
    chronicConditions: ['Anemia'],
  },
  {
    id: 'M-123-2',
    householdId: 'AP-00123',
    name: 'Ravi',
    nameTe: 'రవి',
    age: '32 years',
    gender: 'MALE',
    relationship: 'Husband',
    relationshipTe: 'భర్త',
    isPregnant: false,
    highRisk: false,
    chronicConditions: [],
  },
  {
    id: 'M-123-3',
    householdId: 'AP-00123',
    name: 'Baby Girl (Ananya)',
    nameTe: 'పాప (అనన్య)',
    age: '3 years',
    gender: 'FEMALE',
    relationship: 'Child',
    relationshipTe: 'కూతురు',
    isPregnant: false,
    highRisk: false,
    dueService: 'Immunisation due (DPT Booster)',
    dueServiceTe: 'టీకా గడువు (DPT బూస్టర్)',
    chronicConditions: [],
    immunizationDue: 'DPT Booster 1',
  },

  // Raju Family (AP-00124)
  {
    id: 'M-124-1',
    householdId: 'AP-00124',
    name: 'Raju',
    nameTe: 'రాజు',
    age: '2 years',
    gender: 'MALE',
    relationship: 'Child',
    relationshipTe: 'కుమారుడు',
    isPregnant: false,
    highRisk: false,
    dueService: 'Immunisation due (DPT Booster) & Growth monitoring',
    dueServiceTe: 'టీకా గడువు (DPT బూస్టర్) & పెరుగుదల పర్యవేక్షణ',
    chronicConditions: [],
    immunizationDue: 'DPT Booster',
  },
  {
    id: 'M-124-2',
    householdId: 'AP-00124',
    name: 'Parvati',
    nameTe: 'పార్వతి',
    age: '26 years',
    gender: 'FEMALE',
    relationship: 'Mother',
    relationshipTe: 'తల్లి',
    isPregnant: false,
    highRisk: false,
    chronicConditions: [],
  },

  // Saraswati Family (AP-00125)
  {
    id: 'M-125-1',
    householdId: 'AP-00125',
    name: 'Saraswati',
    nameTe: 'సరస్వతి',
    age: '45 years',
    gender: 'FEMALE',
    relationship: 'Self',
    relationshipTe: 'స్వయంగా',
    isPregnant: false,
    highRisk: true,
    highRiskReason: 'Stage 2 Hypertension (Last BP: 156/96 mmHg)',
    dueService: 'Hypertension follow-up & BP measurement',
    dueServiceTe: 'రక్తపోటు ఫాలో-అప్ & బీపీ కొలత',
    chronicConditions: ['Hypertension'],
  },

  // Imran Family (AP-00126)
  {
    id: 'M-126-1',
    householdId: 'AP-00126',
    name: 'Imran',
    nameTe: 'ఇమ్రాన్',
    age: '6 months',
    gender: 'MALE',
    relationship: 'Infant',
    relationshipTe: 'శిశువు',
    isPregnant: false,
    highRisk: false,
    dueService: 'Immunisation due (Pentavalent 3) & MUAC check',
    dueServiceTe: 'టీకా గడువు (పెంటావాలెంట్ 3) & MUAC పరీక్ష',
    chronicConditions: [],
    immunizationDue: 'Pentavalent 3, OPV 3, fIPV 2',
  },

  // Anasuya Family (AP-00127)
  {
    id: 'M-127-1',
    householdId: 'AP-00127',
    name: 'Anasuya',
    nameTe: 'అనసూయ',
    age: '30 years',
    gender: 'FEMALE',
    relationship: 'Self',
    relationshipTe: 'స్వయంగా',
    isPregnant: true,
    gestationalWeeks: 34,
    gravidaPara: 'G2P1',
    highRisk: true,
    highRiskReason: 'Gestational Diabetes Mellitus (GDM)',
    dueService: '4th ANC & Blood Sugar Check',
    dueServiceTe: '4వ ANC & బ్లడ్ షుగర్ పరీక్ష',
    chronicConditions: ['Gestational Diabetes'],
  }
];

export const BASE_5_VISITS: Visit[] = [
  {
    id: 'V-001',
    householdId: 'AP-00123',
    memberId: 'M-123-1',
    beneficiaryName: 'Lakshmi',
    beneficiaryNameTe: 'లక్ష్మి',
    beneficiaryAge: '24 years',
    beneficiaryDetails: 'G3P1, 28 weeks',
    beneficiaryDetailsTe: 'G3P1, 28 వారాలు',
    village: 'Rythu Basti',
    ward: 'Ward 5',
    serviceDue: 'Antenatal check-up due',
    serviceDueTe: 'యాంటీనేటల్ చెకప్ గడువు',
    subtasks: [
      'Antenatal check-up due',
      'Check BP, weight, danger signs',
      'Dispense IFA and Calcium tablets'
    ],
    subtasksTe: [
      'యాంటీనేటల్ చెకప్ గడువు',
      'బీపీ, బరువు, ప్రమాద సంకేతాలు పరీక్షించండి',
      'IFA మరియు కాల్షియం మాత్రలు అందించండి'
    ],
    dueDate: '2026-10-15',
    priority: 'HIGH',
    priorityReason: 'High-risk 3rd trimester pregnancy with anemia',
    priorityReasonTe: 'రక్తహీనతతో కూడిన 3వ త్రైమాసిక హై-రిస్క్ గర్భం',
    status: 'PENDING',
    syncStatus: 'SYNCED',
  },
  {
    id: 'V-002',
    householdId: 'AP-00124',
    memberId: 'M-124-1',
    beneficiaryName: 'Raju',
    beneficiaryNameTe: 'రాజు',
    beneficiaryAge: '2 years',
    beneficiaryDetails: '2 years old',
    beneficiaryDetailsTe: '2 సంవత్సరాల బాలుడు',
    village: 'Kothapeta',
    ward: 'Ward 2',
    serviceDue: 'Immunisation due (DPT Booster)',
    serviceDueTe: 'టీకా గడువు (DPT బూస్టర్)',
    subtasks: [
      'Immunisation due (DPT Booster)',
      'Growth monitoring (weight & height)',
      'Vitamin A bi-annual dose check'
    ],
    subtasksTe: [
      'టీకా గడువు (DPT బూస్టర్)',
      'పెరుగుదల పర్యవేక్షణ (బరువు & ఎత్తు)',
      'విటమిన్ A డోస్ తనిఖీ'
    ],
    dueDate: '2026-10-15',
    priority: 'DUE',
    priorityReason: 'Scheduled 2-year vaccination milestone',
    priorityReasonTe: '2 సంవత్సరాల షెడ్యూల్డ్ వ్యాక్సినేషన్ మైలురాయి',
    status: 'PENDING',
    syncStatus: 'SYNCED',
  },
  {
    id: 'V-003',
    householdId: 'AP-00125',
    memberId: 'M-125-1',
    beneficiaryName: 'Saraswati',
    beneficiaryNameTe: 'సరస్వతి',
    beneficiaryAge: '45 years',
    beneficiaryDetails: '45 years old',
    beneficiaryDetailsTe: '45 సంవత్సరాలు',
    village: 'Gandhi Nagar',
    ward: 'Ward 4',
    serviceDue: 'Hypertension follow-up',
    serviceDueTe: 'రక్తపోటు ఫాలో-అప్',
    subtasks: [
      'Hypertension follow-up',
      'BP measurement and adherence',
      'Low sodium diet counseling'
    ],
    subtasksTe: [
      'రక్తపోటు ఫాలో-అప్',
      'బీపీ కొలత మరియు మందుల వాడకం',
      'తక్కువ ఉప్పు ఆహార కౌన్సెలింగ్'
    ],
    dueDate: '2026-10-15',
    priority: 'MEDIUM',
    priorityReason: 'Chronic Stage 2 Hypertension management',
    priorityReasonTe: 'స్టేజ్ 2 హైపర్‌టెన్షన్ నిరంతర నిర్వహణ',
    status: 'PENDING',
    syncStatus: 'SYNCED',
  },
  {
    id: 'V-004',
    householdId: 'AP-00126',
    memberId: 'M-126-1',
    beneficiaryName: 'Imran',
    beneficiaryNameTe: 'ఇమ్రాన్',
    beneficiaryAge: '6 months',
    beneficiaryDetails: '6 months old',
    beneficiaryDetailsTe: '6 నెలల శిశువు',
    village: 'Ramalayam Veedhi',
    ward: 'Ward 1',
    serviceDue: 'Immunisation due (Pentavalent 3)',
    serviceDueTe: 'టీకా గడువు (పెంటావాలెంట్ 3)',
    subtasks: [
      'Immunisation due (Pentavalent 3)',
      'Check for malnutrition (MUAC)',
      'Initiation of complementary feeding counseling'
    ],
    subtasksTe: [
      'టీకా గడువు (పెంటావాలెంట్ 3)',
      'పోషకాహార లోపం (MUAC) తనిఖీ',
      'అదనపు ఆహార ప్రారంభ కౌన్సెలింగ్'
    ],
    dueDate: '2026-10-15',
    priority: 'DUE',
    priorityReason: 'Critical 14-week primary vaccination follow-up',
    priorityReasonTe: 'ముఖ్యమైన 14 వారాల ప్రాథమిక టీకా ఫాలో-అప్',
    status: 'PENDING',
    syncStatus: 'SYNCED',
  },
  {
    id: 'V-005',
    householdId: 'AP-00127',
    memberId: 'M-127-1',
    beneficiaryName: 'Anasuya',
    beneficiaryNameTe: 'అనసూయ',
    beneficiaryAge: '30 years',
    beneficiaryDetails: 'G2P1, 34 weeks',
    beneficiaryDetailsTe: 'G2P1, 34 వారాలు',
    village: 'Rythu Basti',
    ward: 'Ward 5',
    serviceDue: 'Overdue ANC Check & GDM follow-up',
    serviceDueTe: 'గడువు దాటిన ANC & GDM ఫాలో-అప్',
    subtasks: [
      '4th ANC check-up (overdue by 4 days)',
      'Fasting & postprandial glucose check',
      'Birth preparedness & institutional delivery planning'
    ],
    subtasksTe: [
      '4వ ANC చెకప్ (4 రోజులు ఆలస్యం)',
      'బ్లడ్ షుగర్ స్థాయి పరీక్ష',
      'ప్రసవ సన్నద్ధత మరియు ఆసుపత్రి ప్రసవ ప్రణాళిక'
    ],
    dueDate: '2026-10-11',
    isOverdue: true,
    priority: 'OVERDUE',
    priorityReason: 'High-risk gestational diabetes pregnancy overdue for 34-week scan',
    priorityReasonTe: '34 వారాల స్కాన్ గడువు దాటిన హై-రిస్క్ డయాబెటిస్ గర్భిణీ',
    status: 'PENDING',
    syncStatus: 'SYNCED',
  }
];

const FIRST_NAMES_FEMALE = [
  { en: 'Lakshmi', te: 'లక్ష్మి' },
  { en: 'Saraswati', te: 'సరస్వతి' },
  { en: 'Anasuya', te: 'అనసూయ' },
  { en: 'Parvathi', te: 'పార్వతి' },
  { en: 'Bhavani', te: 'భవాని' },
  { en: 'Padma', te: 'పద్మ' },
  { en: 'Durga', te: 'దుర్గ' },
  { en: 'Radha', te: 'రాధ' },
  { en: 'Kavitha', te: 'కవిత' },
  { en: 'Sunitha', te: 'సునీత' },
  { en: 'Sandhya', te: 'సంధ్య' },
  { en: 'Swathi', te: 'స్వాతి' },
  { en: 'Renuka', te: 'రేణుక' },
  { en: 'Venkatalakshmi', te: 'వెంకటలక్ష్మి' },
  { en: 'Nagaveni', te: 'నాగవేణి' },
  { en: 'Sujatha', te: 'సుజాత' },
  { en: 'Manjula', te: 'మంజుల' },
  { en: 'Jyothi', te: 'జ్యోతి' },
  { en: 'Kalyani', te: 'కళ్యాణి' },
  { en: 'Sirisha', te: 'శిరీష' }
];

const FIRST_NAMES_MALE = [
  { en: 'Raju', te: 'రాజు' },
  { en: 'Ravi', te: 'రవి' },
  { en: 'Imran', te: 'ఇమ్రాన్' },
  { en: 'Srinivas', te: 'శ్రీనివాస్' },
  { en: 'Venkatesh', te: 'వెంకటేష్' },
  { en: 'Krishna', te: 'కృష్ణ' },
  { en: 'Satyanarayana', te: 'సత్యనారాయణ' },
  { en: 'Subba Rao', te: 'సుబ్బారావు' },
  { en: 'Appa Rao', te: 'అప్పారావు' },
  { en: 'Narayana', te: 'నారాయణ' },
  { en: 'Rambabu', te: 'రాంబాబు' },
  { en: 'Suresh', te: 'సురేష్' },
  { en: 'Naresh', te: 'నరేష్' },
  { en: 'Mahesh', te: 'మహేష్' },
  { en: 'Prakash', te: 'ప్రకాష్' },
  { en: 'Chiranjeevi', te: 'చిరంజీవి' },
  { en: 'Govindu', te: 'గోవిందు' },
  { en: 'Koteswara Rao', te: 'కోటేశ్వరరావు' },
  { en: 'Prasad', te: 'ప్రసాద్' },
  { en: 'Murali', te: 'మురళి' }
];

const SURNAMES = [
  { en: 'Kommuri', te: 'కొమ్మూరి' },
  { en: 'Garlapati', te: 'గార్లపాటి' },
  { en: 'Chilukuri', te: 'చిలుకూరి' },
  { en: 'Bandi', te: 'బండి' },
  { en: 'Palleti', te: 'పల్లెటి' },
  { en: 'Vemula', te: 'వేముల' },
  { en: 'Dondapati', te: 'దొండపాటి' },
  { en: 'Kandula', te: 'కందుల' },
  { en: 'Meda', te: 'మేడా' },
  { en: 'Thota', te: 'తోట' },
  { en: 'Yalamanchili', te: 'యలమంచిలి' },
  { en: 'Gudipati', te: 'గుడిపాటి' },
  { en: 'Boddu', te: 'బొడ్డు' },
  { en: 'Rayapati', te: 'రాయపాటి' },
  { en: 'Katta', te: 'కట్టా' }
];

const VILLAGES = [
  { name: 'Rythu Basti', nameTe: 'రైతు బస్తీ', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
  { name: 'Gandhi Nagar', nameTe: 'గాంధీ నగర్', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'] },
  { name: 'Ramalayam Veedhi', nameTe: 'రామాలయం వీధి', wards: ['Ward 1', 'Ward 2', 'Ward 3'] },
  { name: 'Nehru Colony', nameTe: 'నెహ్రూ కాలనీ', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'] },
  { name: 'Chenchu Basti', nameTe: 'చెంచు బస్తీ', wards: ['Ward 1', 'Ward 2'] },
  { name: 'Old Post Office Ward', nameTe: 'పాత పోస్టాఫీసు వార్డు', wards: ['Ward 1', 'Ward 2', 'Ward 3'] },
  { name: 'Kothapet', nameTe: 'కొత్తపేట', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'] }
];

export interface Generated500Dataset {
  households: Household[];
  members: Member[];
  visits: Visit[];
}

/**
 * Deterministically generates exactly 500 synthetic households
 * including the core 5 showcase households and 495 additional families
 * with realistic Andhra Pradesh frontline health clinical cases.
 */
export function generate500SyntheticHouseholds(): Generated500Dataset {
  const households: Household[] = [...BASE_5_HOUSEHOLDS];
  const members: Member[] = [...BASE_5_MEMBERS];
  const visits: Visit[] = [...BASE_5_VISITS];

  let visitGlobalIndex = 6;

  // Generate 495 more households -> 500 total
  for (let i = 6; i <= 500; i++) {
    const hhIdNum = String(i).padStart(4, '0');
    const hhId = `AP-${hhIdNum}`;

    const surname = SURNAMES[(i * 7) % SURNAMES.length];
    const headFirstName = (i % 2 === 0)
      ? FIRST_NAMES_FEMALE[(i * 3) % FIRST_NAMES_FEMALE.length]
      : FIRST_NAMES_MALE[(i * 5) % FIRST_NAMES_MALE.length];

    const villageObj = VILLAGES[i % VILLAGES.length];
    const ward = villageObj.wards[i % villageObj.wards.length];
    const doorNo = `Door No ${1 + (i % 45)}-${10 + (i % 80)}`;
    const rationCard = `WAP${20000000 + i * 137}`;

    const isHighRiskHousehold = (i % 7 === 0) || (i % 11 === 0);
    const hasPregnantMother = (i % 5 === 0);
    const hasInfant = (i % 4 === 0);
    const hasChronicPatient = (i % 6 === 0);

    const familyMembersCount = 2 + (i % 4); // 2 to 5 members
    let householdHighRiskCount = isHighRiskHousehold ? 1 : 0;

    // Create Head of Household
    const headMemberId = `M-${hhIdNum}-1`;
    const headMember: Member = {
      id: headMemberId,
      householdId: hhId,
      name: `${surname.en} ${headFirstName.en}`,
      nameTe: `${surname.te} ${headFirstName.te}`,
      age: `${28 + (i % 35)} years`,
      gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
      relationship: 'Head',
      relationshipTe: 'కుటుంబ పెద్ద',
      isPregnant: false,
      highRisk: false,
      chronicConditions: hasChronicPatient && i % 2 === 1 ? ['Stage 2 Hypertension'] : [],
    };
    members.push(headMember);

    // Create Spouse / Second Adult Member for every household
    if (!hasPregnantMother) {
      const spouseId = `M-${hhIdNum}-2`;
      const spouseFirstName = (i % 2 === 0)
        ? FIRST_NAMES_MALE[(i * 5) % FIRST_NAMES_MALE.length]
        : FIRST_NAMES_FEMALE[(i * 3) % FIRST_NAMES_FEMALE.length];

      members.push({
        id: spouseId,
        householdId: hhId,
        name: `${surname.en} ${spouseFirstName.en}`,
        nameTe: `${surname.te} ${spouseFirstName.te}`,
        age: `${25 + (i % 28)} years`,
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        relationship: i % 2 === 0 ? 'Husband' : 'Wife',
        relationshipTe: i % 2 === 0 ? 'భర్త' : 'భార్య',
        isPregnant: false,
        highRisk: false,
        chronicConditions: [],
      });
    }

    // Create Child / Dependent for every household
    const childId = `M-${hhIdNum}-child`;
    const childFirstName = (i % 2 === 0)
      ? FIRST_NAMES_FEMALE[(i * 7) % FIRST_NAMES_FEMALE.length]
      : FIRST_NAMES_MALE[(i * 7) % FIRST_NAMES_MALE.length];
    const childAge = 4 + (i % 14);
    members.push({
      id: childId,
      householdId: hhId,
      name: `${surname.en} ${childFirstName.en}`,
      nameTe: `${surname.te} ${childFirstName.te}`,
      age: `${childAge} years`,
      gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
      relationship: 'Child',
      relationshipTe: 'కుమారుడు / కుమార్తె',
      isPregnant: false,
      highRisk: false,
      chronicConditions: [],
    });

    // If has pregnant mother in family
    if (hasPregnantMother) {
      const pregId = `M-${hhIdNum}-2`;
      const pregName = FIRST_NAMES_FEMALE[(i + 4) % FIRST_NAMES_FEMALE.length];
      const gestationalWeeks = 12 + ((i * 3) % 26); // 12 to 37 weeks
      const isHighRiskPregnancy = isHighRiskHousehold;

      const pregMember: Member = {
        id: pregId,
        householdId: hhId,
        name: `${surname.en} ${pregName.en}`,
        nameTe: `${surname.te} ${pregName.te}`,
        age: `${20 + (i % 12)} years`,
        gender: 'FEMALE',
        relationship: i % 2 === 0 ? 'Self' : 'Spouse',
        relationshipTe: i % 2 === 0 ? 'స్వయంగా' : 'భార్య',
        isPregnant: true,
        gestationalWeeks,
        gravidaPara: `G${1 + (i % 3)}P${i % 2}`,
        highRisk: isHighRiskPregnancy,
        highRiskReason: isHighRiskPregnancy ? 'Severe Gestational Hypertension & Past Preterm' : undefined,
        dueService: `${gestationalWeeks > 28 ? '3rd' : '2nd'} ANC Check-up & IFA refill`,
        dueServiceTe: `${gestationalWeeks > 28 ? '3వ' : '2వ'} ANC చెకప్ & IFA మాత్రలు`,
        chronicConditions: isHighRiskPregnancy ? ['Gestational Hypertension'] : [],
      };
      members.push(pregMember);

      // Generate a field visit for this pregnant beneficiary
      const vId = `V-${String(visitGlobalIndex++).padStart(4, '0')}`;
      const isDueToday = i % 3 === 0;
      const isOverdue = i % 9 === 0;
      const dueDate = isOverdue ? '2026-10-10' : (isDueToday ? '2026-10-15' : '2026-10-22');

      const visit: Visit = {
        id: vId,
        householdId: hhId,
        memberId: pregId,
        beneficiaryName: pregMember.name,
        beneficiaryNameTe: pregMember.nameTe,
        beneficiaryAge: pregMember.age,
        beneficiaryDetails: `${pregMember.gravidaPara || 'G1P0'}, ${gestationalWeeks} weeks`,
        beneficiaryDetailsTe: `${pregMember.gravidaPara || 'G1P0'}, ${gestationalWeeks} వారాలు`,
        village: villageObj.name,
        ward: ward,
        serviceDue: isHighRiskPregnancy ? 'High-Risk ANC Checkup & BP Monitoring' : 'Routine ANC Follow-up',
        serviceDueTe: isHighRiskPregnancy ? 'హై-రిస్క్ ANC చెకప్ & బీపీ పర్యవేక్షణ' : 'సాధారణ ANC ఫాలో-అప్',
        subtasks: [
          'Blood pressure & weight measurement',
          'Check for pedal edema & fetal movements',
          'Counseling on danger signs (severe bleeding, headache)'
        ],
        subtasksTe: [
          'రక్తపోటు మరియు బరువు కొలత',
          'కాళ్ల వాపు మరియు పిండం కదలికల తనిఖీ',
          'అత్యవసర ప్రమాద సంకేతాల కౌన్సెలింగ్ (రక్తస్రావం, తలనొప్పి)'
        ],
        dueDate,
        isOverdue,
        priority: isHighRiskPregnancy ? 'HIGH' : (isOverdue ? 'OVERDUE' : (isDueToday ? 'DUE' : 'MEDIUM')),
        priorityReason: isHighRiskPregnancy ? 'High-risk antenatal case requiring clinical surveillance' : 'Scheduled antenatal checkup',
        priorityReasonTe: isHighRiskPregnancy ? 'క్లినికల్ పర్యవేక్షణ అవసరమైన హై-రిస్క్ గర్భధారణ' : 'షెడ్యూల్ చేసిన సాధారణ ANC పరీక్ష',
        status: (i % 8 === 0) ? 'COMPLETED' : 'PENDING',
        completedAt: (i % 8 === 0) ? '2026-10-15T09:30:00Z' : undefined,
        outcomeNote: (i % 8 === 0) ? 'Conducted examination, BP 120/80 mmHg, IFA distributed.' : undefined,
        bpMeasurement: (i % 8 === 0) ? '120/80' : undefined,
        weightKg: (i % 8 === 0) ? 54.5 : undefined,
        syncStatus: 'SYNCED',
      };
      visits.push(visit);
    }

    // If has Infant child
    if (hasInfant && !hasPregnantMother) {
      const infantId = `M-${hhIdNum}-3`;
      const infantName = (i % 2 === 0)
        ? { en: `Baby of ${surname.en}`, te: `${surname.te} బిడ్డ` }
        : FIRST_NAMES_MALE[(i + 7) % FIRST_NAMES_MALE.length];

      const infantAgeMonths = 1 + (i % 18);
      const vaccineName = infantAgeMonths <= 2
        ? 'Pentavalent 1 + OPV 1 + Rota 1'
        : (infantAgeMonths <= 4 ? 'Pentavalent 2 + OPV 2' : (infantAgeMonths <= 9 ? 'Pentavalent 3 + OPV 3 + IPV' : 'Measles-Rubella (MR 1)'));

      const infantMember: Member = {
        id: infantId,
        householdId: hhId,
        name: infantName.en,
        nameTe: infantName.te,
        age: `${infantAgeMonths} months`,
        gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
        relationship: 'Child',
        relationshipTe: 'బిడ్డ',
        isPregnant: false,
        highRisk: (i % 13 === 0),
        highRiskReason: (i % 13 === 0) ? 'Low birth weight (<2.0kg) & severe wasting' : undefined,
        dueService: `Immunisation due (${vaccineName})`,
        dueServiceTe: `టీకా గడువు (${vaccineName})`,
        chronicConditions: [],
        immunizationDue: vaccineName,
      };
      members.push(infantMember);

      if (infantMember.highRisk) householdHighRiskCount++;

      // Generate pediatric visit
      const vId = `V-${String(visitGlobalIndex++).padStart(4, '0')}`;
      const isOverdue = i % 10 === 0;
      const isDueToday = i % 4 === 0;
      const dueDate = isOverdue ? '2026-10-08' : (isDueToday ? '2026-10-15' : '2026-10-25');

      const visit: Visit = {
        id: vId,
        householdId: hhId,
        memberId: infantId,
        beneficiaryName: infantMember.name,
        beneficiaryNameTe: infantMember.nameTe,
        beneficiaryAge: infantMember.age,
        beneficiaryDetails: `${infantAgeMonths} months old infant`,
        beneficiaryDetailsTe: `${infantAgeMonths} నెలల శిశువు`,
        village: villageObj.name,
        ward: ward,
        serviceDue: `Vaccination: ${vaccineName}`,
        serviceDueTe: `టీకా పంపిణీ: ${vaccineName}`,
        subtasks: [
          `Administer scheduled vaccine: ${vaccineName}`,
          'Measure mid-upper arm circumference (MUAC)',
          'Assess exclusive breastfeeding & complementary feeding'
        ],
        subtasksTe: [
          `షెడ్యూల్ చేసిన టీకా అందించడం: ${vaccineName}`,
          'చేతి చుట్టుకొలత (MUAC) కొలవడం',
          'తల్లిపాలు మరియు పోషకాహార అంచనా'
        ],
        dueDate,
        isOverdue,
        priority: infantMember.highRisk ? 'HIGH' : (isOverdue ? 'OVERDUE' : (isDueToday ? 'DUE' : 'MEDIUM')),
        priorityReason: infantMember.highRisk ? 'Malnutrition surveillance & critical immunization' : 'Routine immunization milestone',
        priorityReasonTe: infantMember.highRisk ? 'పోషకాహార పర్యవేక్షణ & కీలక టీకా' : 'షెడ్యూల్ చేసిన సాధారణ టీకా',
        status: 'PENDING',
        syncStatus: 'SYNCED',
      };
      visits.push(visit);
    }

    // If has chronic patient (NCD)
    if (hasChronicPatient && !hasPregnantMother && !hasInfant) {
      const chronicId = `M-${hhIdNum}-4`;
      const chronicName = (i % 2 === 0)
        ? FIRST_NAMES_FEMALE[(i * 4) % FIRST_NAMES_FEMALE.length]
        : FIRST_NAMES_MALE[(i * 6) % FIRST_NAMES_MALE.length];

      const condition = i % 3 === 0 ? 'Type 2 Diabetes Mellitus' : 'Hypertension Stage 2';
      const conditionTe = i % 3 === 0 ? 'టైప్ 2 మధుమేహం' : 'రక్తపోటు (హైపర్‌టెన్షన్)';

      const chronicMember: Member = {
        id: chronicId,
        householdId: hhId,
        name: `${surname.en} ${chronicName.en}`,
        nameTe: `${surname.te} ${chronicName.te}`,
        age: `${50 + (i % 25)} years`,
        gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
        relationship: 'Parent / Elder',
        relationshipTe: 'తల్లిదండ్రులు / పెద్దలు',
        isPregnant: false,
        highRisk: (i % 14 === 0),
        highRiskReason: (i % 14 === 0) ? 'Uncontrolled BP >160/100 mmHg with chest pain' : undefined,
        dueService: `${condition} Monthly Follow-up`,
        dueServiceTe: `${conditionTe} నెలవారీ ఫాలో-అప్`,
        chronicConditions: [condition],
      };
      members.push(chronicMember);

      if (chronicMember.highRisk) householdHighRiskCount++;

      const vId = `V-${String(visitGlobalIndex++).padStart(4, '0')}`;
      const isDueToday = i % 5 === 0;

      const visit: Visit = {
        id: vId,
        householdId: hhId,
        memberId: chronicId,
        beneficiaryName: chronicMember.name,
        beneficiaryNameTe: chronicMember.nameTe,
        beneficiaryAge: chronicMember.age,
        beneficiaryDetails: `${chronicMember.age}, ${condition}`,
        beneficiaryDetailsTe: `${chronicMember.age}, ${conditionTe}`,
        village: villageObj.name,
        ward: ward,
        serviceDue: `NCD Follow-up (${condition})`,
        serviceDueTe: `NCD ఫాలో-అప్ (${conditionTe})`,
        subtasks: [
          'Measure BP & check medication compliance',
          'Counsel on low salt/sugar diet & physical activity',
          'Verify ASHA drug kit refill'
        ],
        subtasksTe: [
          'బీపీ కొలత & మందుల వాడకం తనిఖీ',
          'ఉప్పు/చక్కెర నియంత్రణ ఆహార సలహా',
          'మందుల రీఫిల్ ధృవీకరణ'
        ],
        dueDate: isDueToday ? '2026-10-15' : '2026-10-28',
        priority: chronicMember.highRisk ? 'HIGH' : (isDueToday ? 'DUE' : 'MEDIUM'),
        priorityReason: `Monthly ${condition} monitoring`,
        priorityReasonTe: `${conditionTe} నెలవారీ పర్యవేక్షణ`,
        status: 'PENDING',
        syncStatus: 'SYNCED',
      };
      visits.push(visit);
    }

    const household: Household = {
      id: hhId,
      headOfHousehold: `${surname.en} Family (${headFirstName.en})`,
      headOfHouseholdTe: `${surname.te} కుటుంబం (${headFirstName.te})`,
      village: villageObj.name,
      ward: ward,
      address: `${doorNo}, ${villageObj.name}`,
      rationCard,
      membersCount: familyMembersCount,
      highRiskCount: householdHighRiskCount,
      createdAt: '2026-08-15',
      updatedAt: '2026-10-15',
    };

    households.push(household);
  }

  return { households, members, visits };
}

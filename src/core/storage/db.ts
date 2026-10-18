import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PROTOCOL_CORPUS, ProtocolDocument } from '../../data/protocolCorpus';
import { generate500SyntheticHouseholds } from '../../data/syntheticDataGenerator';

export interface Household {
  id: string;
  headOfHousehold: string;
  headOfHouseholdTe?: string;
  village: string;
  ward: string;
  address: string;
  rationCard: string;
  membersCount: number;
  highRiskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  householdId: string;
  name: string;
  nameTe?: string;
  age: string;
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  relationship: string;
  relationshipTe?: string;
  isPregnant: boolean;
  gestationalWeeks?: number;
  gravidaPara?: string;
  highRisk: boolean;
  highRiskReason?: string;
  dueService?: string;
  dueServiceTe?: string;
  chronicConditions: string[];
  immunizationDue?: string;
}

export type VisitPriority = 'HIGH' | 'MEDIUM' | 'DUE' | 'OVERDUE' | 'DONE';

export interface Visit {
  id: string;
  householdId: string;
  memberId: string;
  beneficiaryName: string;
  beneficiaryNameTe?: string;
  beneficiaryAge: string;
  beneficiaryDetails: string;
  beneficiaryDetailsTe?: string;
  village: string;
  ward: string;
  serviceDue: string;
  serviceDueTe: string;
  subtasks: string[];
  subtasksTe: string[];
  dueDate: string; // ISO date YYYY-MM-DD
  isOverdue?: boolean;
  priority: VisitPriority;
  priorityReason: string;
  priorityReasonTe: string;
  status: 'PENDING' | 'COMPLETED';
  completedAt?: string;
  outcomeNote?: string;
  bpMeasurement?: string;
  weightKg?: number;
  syncStatus: 'SYNCED' | 'PENDING_SYNC';
}

export interface SyncItem {
  id: string;
  action: 'COMPLETE_VISIT' | 'UNDO_VISIT' | 'ADD_MEMBER' | 'UPDATE_HOUSEHOLD' | 'RECORD_VITALS';
  entityId: string;
  payload: any;
  timestamp: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  error?: string;
}

export interface QuestionHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  isEscalation: boolean;
  severity?: string;
  ruleId?: string;
  title: string;
  answer: string;
  sourceDoc: string;
  section: string;
  page?: number;
  keyPoints: string[];
  excerpt?: string;
}

interface SahaayaDB extends DBSchema {
  households: {
    key: string;
    value: Household;
    indexes: { 'by-village': string };
  };
  members: {
    key: string;
    value: Member;
    indexes: { 'by-household': string };
  };
  visits: {
    key: string;
    value: Visit;
    indexes: {
      'by-status': string;
      'by-priority': string;
      'by-household': string;
      'by-dueDate': string;
    };
  };
  protocols: {
    key: string;
    value: ProtocolDocument;
    indexes: { 'by-category': string };
  };
  syncQueue: {
    key: string;
    value: SyncItem;
    indexes: { 'by-status': string };
  };
  questionHistory: {
    key: string;
    value: QuestionHistoryItem;
    indexes: { 'by-timestamp': string };
  };
  settings: {
    key: string;
    value: { key: string; value: any };
  };
}

const DB_NAME = 'sahaaya_health_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SahaayaDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<SahaayaDB>> {
  if (!dbPromise) {
    dbPromise = openDB<SahaayaDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('households')) {
          const hhStore = db.createObjectStore('households', { keyPath: 'id' });
          hhStore.createIndex('by-village', 'village');
        }
        if (!db.objectStoreNames.contains('members')) {
          const memberStore = db.createObjectStore('members', { keyPath: 'id' });
          memberStore.createIndex('by-household', 'householdId');
        }
        if (!db.objectStoreNames.contains('visits')) {
          const visitStore = db.createObjectStore('visits', { keyPath: 'id' });
          visitStore.createIndex('by-status', 'status');
          visitStore.createIndex('by-priority', 'priority');
          visitStore.createIndex('by-household', 'householdId');
          visitStore.createIndex('by-dueDate', 'dueDate');
        }
        if (!db.objectStoreNames.contains('protocols')) {
          const protoStore = db.createObjectStore('protocols', { keyPath: 'id' });
          protoStore.createIndex('by-category', 'category');
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('by-status', 'status');
        }
        if (!db.objectStoreNames.contains('questionHistory')) {
          const qStore = db.createObjectStore('questionHistory', { keyPath: 'id' });
          qStore.createIndex('by-timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

// Initial Synthetic Demo Data
export const INITIAL_HOUSEHOLDS: Household[] = [
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

export const INITIAL_MEMBERS: Member[] = [
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

export const INITIAL_VISITS: Visit[] = [
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

export async function initDatabase(): Promise<void> {
  const db = await getDB();

  // Check if data is already seeded with the 500 households benchmark dataset
  const hhCount = await db.count('households');
  if (hhCount < 500) {
    console.log('Seeding Sahaaya Health 500 synthetic households dataset...');
    const dataset = generate500SyntheticHouseholds();

    const tx = db.transaction(['households', 'members', 'visits', 'protocols'], 'readwrite');
    for (const hh of dataset.households) {
      await tx.objectStore('households').put(hh);
    }
    for (const mem of dataset.members) {
      await tx.objectStore('members').put(mem);
    }
    for (const v of dataset.visits) {
      await tx.objectStore('visits').put(v);
    }
    for (const proto of PROTOCOL_CORPUS) {
      await tx.objectStore('protocols').put(proto);
    }
    await tx.done;
    console.log(`Sahaaya Health DB initialized with ${dataset.households.length} households, ${dataset.members.length} members, and ${dataset.visits.length} visits.`);
  }
}

export async function resetDatabase(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['households', 'members', 'visits', 'protocols', 'syncQueue', 'questionHistory'], 'readwrite');
  await tx.objectStore('households').clear();
  await tx.objectStore('members').clear();
  await tx.objectStore('visits').clear();
  await tx.objectStore('protocols').clear();
  await tx.objectStore('syncQueue').clear();
  await tx.objectStore('questionHistory').clear();

  const dataset = generate500SyntheticHouseholds();

  for (const hh of dataset.households) {
    await tx.objectStore('households').put(hh);
  }
  for (const mem of dataset.members) {
    await tx.objectStore('members').put(mem);
  }
  for (const v of dataset.visits) {
    await tx.objectStore('visits').put(v);
  }
  for (const proto of PROTOCOL_CORPUS) {
    await tx.objectStore('protocols').put(proto);
  }
  await tx.done;
  console.log(`Sahaaya Health DB reset to default 500 households dataset (${dataset.households.length} households).`);
}

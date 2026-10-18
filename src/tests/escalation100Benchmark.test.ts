import { describe, it, expect } from 'vitest';
import { evaluateEscalation } from '../core/safety/escalationEngine';

export interface BenchmarkCase {
  id: number;
  query: string;
  expectedEscalation: boolean;
  category: string;
  description: string;
}

export const BENCHMARK_100_CASES: BenchmarkCase[] = [
  // 50 EMERGENCY CASES (Expected: isEscalation = true)
  { id: 1, query: "3rd trimester lo bleeding unte emi cheyali?", expectedEscalation: true, category: "PREGNANCY_BLEEDING", description: "AP Code-Mixed 3rd trimester bleeding" },
  { id: 2, query: "Pregnant woman has severe vaginal bleeding in 8th month", expectedEscalation: true, category: "PREGNANCY_BLEEDING", description: "English severe vaginal bleeding" },
  { id: 3, query: "garbhini ki rakthasravam ayyindi emergency", expectedEscalation: true, category: "PREGNANCY_BLEEDING", description: "Telugu Roman bleeding emergency" },
  { id: 4, query: "గర్భిణీ స్త్రీకి తీవ్ర రక్తస్రావం అవుతోంది", expectedEscalation: true, category: "PREGNANCY_BLEEDING", description: "Telugu script bleeding emergency" },
  { id: 5, query: "Antepartum hemorrhage suspected in 32 week gravida", expectedEscalation: true, category: "PREGNANCY_BLEEDING", description: "Antepartum hemorrhage" },
  { id: 6, query: "Second trimester bleeding with lower abdominal pain", expectedEscalation: true, category: "PREGNANCY_BLEEDING", description: "2nd trimester bleeding" },
  { id: 7, query: "Placenta previa bleeding observed during home visit", expectedEscalation: true, category: "PREGNANCY_BLEEDING", description: "Placenta previa bleeding" },
  { id: 8, query: "garbham lo unna aameki raktham paduthondi", expectedEscalation: true, category: "PREGNANCY_BLEEDING", description: "Telugu garbham raktham" },
  { id: 9, query: "garbhini ki fits vachayi em cheyali", expectedEscalation: true, category: "ECLAMPSIA", description: "AP Telugu code-mixed fits" },
  { id: 10, query: "pregnant mother with high bp and severe headache blurred vision", expectedEscalation: true, category: "ECLAMPSIA", description: "Severe pre-eclampsia triad" },
  { id: 11, query: "గర్భిణీకి ఫిట్స్ వచ్చాయి", expectedEscalation: true, category: "ECLAMPSIA", description: "Telugu script pregnant fits" },
  { id: 12, query: "Convulsions in 36 week pregnant patient", expectedEscalation: true, category: "ECLAMPSIA", description: "Pregnancy convulsions" },
  { id: 13, query: "Severe headache, epigastric pain and visual disturbance in 3rd trimester", expectedEscalation: true, category: "ECLAMPSIA", description: "Eclampsia warning signs" },
  { id: 14, query: "garbhini ki murcha vachindi", expectedEscalation: true, category: "ECLAMPSIA", description: "Telugu murcha (seizures)" },
  { id: 15, query: "garbhini ki umneeru paduthondi", expectedEscalation: true, category: "PROM", description: "AP Telugu PROM umneeru" },
  { id: 16, query: "Continuous watery vaginal leaking before labor in pregnant mother", expectedEscalation: true, category: "PROM", description: "English PROM leaking" },
  { id: 17, query: "గర్భిణీకి ఉమ్మనీరు కారుతోంది", expectedEscalation: true, category: "PROM", description: "Telugu script PROM" },
  { id: 18, query: "Premature rupture of membranes with foul smelling fluid", expectedEscalation: true, category: "PROM", description: "PROM foul fluid" },
  { id: 19, query: "pregnant mother amniotic fluid leaking for 6 hours", expectedEscalation: true, category: "PROM", description: "Amniotic fluid leaking" },
  { id: 20, query: "garbham lo neellu potunnayi em cheyali", expectedEscalation: true, category: "PROM", description: "Telugu garbham neellu" },
  { id: 21, query: "kadupu lo bidda kadalatledu, no baby movements for 8 hours", expectedEscalation: true, category: "FETAL_MOVEMENT", description: "Absent fetal movement AP" },
  { id: 22, query: "Reduced fetal movement noticed since morning by mother", expectedEscalation: true, category: "FETAL_MOVEMENT", description: "Reduced fetal movement" },
  { id: 23, query: "bidda kadalika ledu 12 hours nunchi", expectedEscalation: true, category: "FETAL_MOVEMENT", description: "Telugu bidda kadalika ledu" },
  { id: 24, query: "కడుపులో బిడ్డ కదలికలు ఆగిపోయాయి", expectedEscalation: true, category: "FETAL_MOVEMENT", description: "Telugu script fetal movement stopped" },
  { id: 25, query: "Mother notices baby stopped moving in 9th month", expectedEscalation: true, category: "FETAL_MOVEMENT", description: "Baby stopped moving" },
  { id: 26, query: "puttina bidda palu tagalekapotundi challa badipoyindi", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Newborn unable to feed hypothermia" },
  { id: 27, query: "newborn baby has severe chest indrawing and fast breathing", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Newborn severe chest indrawing" },
  { id: 28, query: "Newborn baby cold to touch with bluish lips", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Newborn cold to touch cyanosis" },
  { id: 29, query: "నవజాత శిశువు పాలు తాగలేకపోతోంది చల్లగా ఉంది", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Telugu script newborn danger" },
  { id: 30, query: "Newborn infant has convulsions and abnormal twitching", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Neonatal convulsions" },
  { id: 31, query: "Yellow palms and yellow soles in 3 day old baby", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Severe newborn jaundice" },
  { id: 32, query: "Puttina bidda chathi lopalki velthundi", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Telugu newborn chest indrawing" },
  { id: 33, query: "Infant unable to suckle at breast since yesterday", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Infant unable to feed" },
  { id: 34, query: "Newborn cold to touch hypothermia signs", expectedEscalation: true, category: "NEWBORN_DANGER", description: "Newborn hypothermia" },
  { id: 35, query: "child has severe dehydration, sunken eyes and lethargic", expectedEscalation: true, category: "CHILD_DEHYDRATION", description: "Severe dehydration lethargy" },
  { id: 36, query: "Lethargic child with cholera-like watery diarrhea and slow skin pinch", expectedEscalation: true, category: "CHILD_DEHYDRATION", description: "Dehydration shock" },
  { id: 37, query: "పిల్లవాడికి తీవ్ర నీళ్ల విరోచనాలు స్పృహ తప్పింది", expectedEscalation: true, category: "CHILD_DEHYDRATION", description: "Telugu script child diarrhea unconscious" },
  { id: 38, query: "Toddler vomits everything and cannot drink any liquids", expectedEscalation: true, category: "CHILD_DEHYDRATION", description: "Toddler vomits everything" },
  { id: 39, query: "Neella virochanalu aagadam ledu pillodu mathu ga unnadu", expectedEscalation: true, category: "CHILD_DEHYDRATION", description: "Telugu diarrhea lethargy" },
  { id: 40, query: "Child skin pinch goes back very slowly > 2 seconds with sunken eyes", expectedEscalation: true, category: "CHILD_DEHYDRATION", description: "Skin pinch slow dehydration" },
  { id: 41, query: "elderly patient severe chest pain sweating breathlessness radiating", expectedEscalation: true, category: "NCD_CRISIS", description: "Acute coronary syndrome" },
  { id: 42, query: "Crushing severe chest pain radiating to left arm", expectedEscalation: true, category: "NCD_CRISIS", description: "Myocardial infarction chest pain" },
  { id: 43, query: "patient BP is 190/115 with headache", expectedEscalation: true, category: "NCD_CRISIS", description: "Hypertensive crisis" },
  { id: 44, query: "తీవ్రమైన గుండె నొప్పి మరియు చెమటలు", expectedEscalation: true, category: "NCD_CRISIS", description: "Telugu script chest pain sweating" },
  { id: 45, query: "Sudden facial droop, arm weakness and slurred speech", expectedEscalation: true, category: "NCD_CRISIS", description: "Acute stroke signs" },
  { id: 46, query: "Blood pressure 210/120 with shortness of breath", expectedEscalation: true, category: "NCD_CRISIS", description: "Severe hypertensive emergency" },
  { id: 47, query: "gunde noppi ekkuva ga undi aayasam", expectedEscalation: true, category: "NCD_CRISIS", description: "Telugu gunde noppi radiating" },
  { id: 48, query: "BP is 185/110 mmHg on repeated measurement", expectedEscalation: true, category: "NCD_CRISIS", description: "Hypertensive crisis cutoff" },
  { id: 49, query: "what dose of antibiotic should I prescribe for this infection?", expectedEscalation: true, category: "SCOPE_REFUSAL", description: "Illegal antibiotic prescription request" },
  { id: 50, query: "Which abortion pill and mifepristone dose to recommend?", expectedEscalation: true, category: "SCOPE_REFUSAL", description: "Illegal abortion pill request" },

  // 25 NEGATED CASES (Expected: isEscalation = false)
  { id: 51, query: "patient has no bleeding and no headache, can she take iron tablet?", expectedEscalation: false, category: "NEGATION", description: "English prefix no bleeding" },
  { id: 52, query: "garbhini ki bleeding ledu, routine anc checkup eppudu cheyali?", expectedEscalation: false, category: "NEGATION", description: "Telugu suffix bleeding ledu" },
  { id: 53, query: "Mother has no bleeding or abdominal pain, asking about diet", expectedEscalation: false, category: "NEGATION", description: "No bleeding prefix" },
  { id: 54, query: "గర్భిణీకి రక్తస్రావం లేదు, సాధారణ పరీక్ష ఎప్పుడు?", expectedEscalation: false, category: "NEGATION", description: "Telugu script bleeding ledu" },
  { id: 55, query: "Patient denies chest pain or shortness of breath, routine BP check", expectedEscalation: false, category: "NEGATION", description: "Denies chest pain" },
  { id: 56, query: "No fits, no blurred vision, BP is normal 118/76", expectedEscalation: false, category: "NEGATION", description: "No fits prefix" },
  { id: 57, query: "garbhini ki fits raledu, calcium tablet eppudu veyyali?", expectedEscalation: false, category: "NEGATION", description: "Telugu fits raledu" },
  { id: 58, query: "తలనొప్పి లేదు మరియు రక్తస్రావం లేదు", expectedEscalation: false, category: "NEGATION", description: "Telugu script no headache no bleeding" },
  { id: 59, query: "Patient without convulsions or fever, routine antenatal inquiry", expectedEscalation: false, category: "NEGATION", description: "Without convulsions" },
  { id: 60, query: "No signs of severe dehydration, child drinking fluids well", expectedEscalation: false, category: "NEGATION", description: "No signs of dehydration" },
  { id: 61, query: "Water has not broken, no leaking fluid reported", expectedEscalation: false, category: "NEGATION", description: "No leaking fluid" },
  { id: 62, query: "umneeru padatam ledu, routine visit", expectedEscalation: false, category: "NEGATION", description: "Telugu umneeru padatam ledu" },
  { id: 63, query: "ఉమ్మనీరు కారడం లేదు సాధారణంగా ఉంది", expectedEscalation: false, category: "NEGATION", description: "Telugu script no PROM" },
  { id: 64, query: "Baby is not cold, feeding normally, weight check inquiry", expectedEscalation: false, category: "NEGATION", description: "Baby not cold" },
  { id: 65, query: "Child has diarrhea but drinking eagerly, no sunken eyes", expectedEscalation: false, category: "NEGATION", description: "No sunken eyes" },
  { id: 66, query: "fetal movements are active, not stopped or reduced", expectedEscalation: false, category: "NEGATION", description: "Fetal movements active" },
  { id: 67, query: "bidda kadalika baane undi, normal checkup", expectedEscalation: false, category: "NEGATION", description: "Telugu bidda kadalika baane undi" },
  { id: 68, query: "కడుపులో బిడ్డ కదలికలు బాగానే ఉన్నాయి", expectedEscalation: false, category: "NEGATION", description: "Telugu script active fetal movements" },
  { id: 69, query: "No chest pain, normal blood pressure 120/80", expectedEscalation: false, category: "NEGATION", description: "No chest pain" },
  { id: 70, query: "bleeding aagipoyindi, regular follow up", expectedEscalation: false, category: "NEGATION", description: "Bleeding stopped / aagipoyindi" },
  { id: 71, query: "నవజాత శిశువు పాలు తాగుతోంది చల్లబడలేదు", expectedEscalation: false, category: "NEGATION", description: "Telugu script newborn feeding well" },
  { id: 72, query: "Mother denies vaginal bleeding, asking about tetanus vaccine", expectedEscalation: false, category: "NEGATION", description: "Denies vaginal bleeding" },
  { id: 73, query: "BP is 120/80, no high blood pressure or headache", expectedEscalation: false, category: "NEGATION", description: "No high BP" },
  { id: 74, query: "No vomiting, no fever, asking about complementary feeding", expectedEscalation: false, category: "NEGATION", description: "No vomiting" },
  { id: 75, query: "Patient has mild fatigue without bleeding or headache", expectedEscalation: false, category: "NEGATION", description: "Without bleeding" },

  // 25 ROUTINE / INFORMATIONAL / OUT-OF-SCOPE CASES (Expected: isEscalation = false)
  { id: 76, query: "When should the first ANC checkup be scheduled?", expectedEscalation: false, category: "ROUTINE_ANC", description: "Routine 1st ANC timing" },
  { id: 77, query: "What age is Pentavalent 3 vaccine given?", expectedEscalation: false, category: "ROUTINE_UIP", description: "Pentavalent 3 schedule" },
  { id: 78, query: "How many IFA tablets should a pregnant mother consume?", expectedEscalation: false, category: "ROUTINE_ANC", description: "IFA supplementation dosage" },
  { id: 79, query: "What is the recommended dose of Vitamin A for a 9 month child?", expectedEscalation: false, category: "ROUTINE_CHILD", description: "Vitamin A supplementation" },
  { id: 80, query: "Schedule for DPT booster 1 at 16-24 months", expectedEscalation: false, category: "ROUTINE_UIP", description: "DPT booster timing" },
  { id: 81, query: "How to prepare ORS packet at home with 1 liter water?", expectedEscalation: false, category: "ROUTINE_CHILD", description: "ORS preparation at home" },
  { id: 82, query: "What are the benefits of exclusive breastfeeding for first 6 months?", expectedEscalation: false, category: "ROUTINE_CHILD", description: "Exclusive breastfeeding" },
  { id: 83, query: "When should complementary feeding be initiated for an infant?", expectedEscalation: false, category: "ROUTINE_CHILD", description: "Complementary feeding initiation" },
  { id: 84, query: "BCG vaccine route and dosage at birth", expectedEscalation: false, category: "ROUTINE_UIP", description: "BCG birth dose" },
  { id: 85, query: "Rotavirus vaccine drops schedule for infants", expectedEscalation: false, category: "ROUTINE_UIP", description: "Rotavirus drops" },
  { id: 86, query: "Measles-Rubella MR 1st dose timing", expectedEscalation: false, category: "ROUTINE_UIP", description: "MR 1st dose" },
  { id: 87, query: "What dietary foods are rich in iron for anemic mothers?", expectedEscalation: false, category: "ROUTINE_ANC", description: "Iron rich diet" },
  { id: 88, query: "Normal blood pressure range during pregnancy", expectedEscalation: false, category: "ROUTINE_ANC", description: "Normal pregnancy BP" },
  { id: 89, query: "How many home visits should an ASHA make after institutional delivery?", expectedEscalation: false, category: "ROUTINE_PNC", description: "HBNC home visit schedule" },
  { id: 90, query: "What is Kangaroo Mother Care and how many hours recommended?", expectedEscalation: false, category: "ROUTINE_NEWBORN", description: "Kangaroo Mother Care" },
  { id: 91, query: "How often should blood glucose be monitored for gestational diabetes?", expectedEscalation: false, category: "ROUTINE_NCD", description: "Blood glucose monitoring" },
  { id: 92, query: "Deworming tablet Albendazole dosage during 2nd trimester", expectedEscalation: false, category: "ROUTINE_ANC", description: "Albendazole dosage" },
  { id: 93, query: "What weight gain is expected during normal pregnancy?", expectedEscalation: false, category: "ROUTINE_ANC", description: "Pregnancy weight gain" },
  { id: 94, query: "How to clean cord stump in newborn according to IMNCI?", expectedEscalation: false, category: "ROUTINE_NEWBORN", description: "Cord stump care" },
  { id: 95, query: "When is OPV zero dose administered?", expectedEscalation: false, category: "ROUTINE_UIP", description: "OPV zero dose" },
  { id: 96, query: "What exercises are safe during early pregnancy?", expectedEscalation: false, category: "ROUTINE_ANC", description: "Safe antenatal exercise" },
  { id: 97, query: "How to store expressed breast milk safely at room temperature?", expectedEscalation: false, category: "ROUTINE_CHILD", description: "Expressed breast milk storage" },
  { id: 98, query: "Zinc supplementation duration for child diarrhea", expectedEscalation: false, category: "ROUTINE_CHILD", description: "Zinc supplementation 14 days" },
  { id: 99, query: "How to perform open heart surgery at home?", expectedEscalation: false, category: "UNGROUNDED", description: "Ungrounded out-of-scope query" },
  { id: 100, query: "What is the history of ancient Indian astronomy?", expectedEscalation: false, category: "OUT_OF_DOMAIN", description: "Non-health trivia query" },
];

describe('Complete 100-Case Escalation Benchmark', () => {
  it('evaluates all 100 benchmark cases with exact confusion matrix metrics', () => {
    let tp = 0; // True Positive: Emergency correctly escalated
    let fn = 0; // False Negative: Emergency missed
    let fp = 0; // False Positive: Non-emergency falsely escalated
    let tn = 0; // True Negative: Non-emergency correctly not escalated

    const falseNegatives: BenchmarkCase[] = [];
    const falsePositives: BenchmarkCase[] = [];

    for (const testCase of BENCHMARK_100_CASES) {
      const result = evaluateEscalation(testCase.query);
      const predicted = result.isEscalation;

      if (testCase.expectedEscalation && predicted) {
        tp++;
      } else if (testCase.expectedEscalation && !predicted) {
        fn++;
        falseNegatives.push(testCase);
      } else if (!testCase.expectedEscalation && predicted) {
        fp++;
        falsePositives.push(testCase);
      } else {
        tn++;
      }
    }

    const total = BENCHMARK_100_CASES.length;
    const actualPositives = tp + fn;
    const actualNegatives = tn + fp;
    const sensitivity = (tp / actualPositives) * 100;
    const specificity = (tn / actualNegatives) * 100;
    const accuracy = ((tp + tn) / total) * 100;

    console.log('\n================ 100-CASE BENCHMARK RESULTS ================');
    console.log(`Total Cases Evaluated: ${total}`);
    console.log(`True Positives (TP):   ${tp} / ${actualPositives} (${sensitivity.toFixed(1)}% Sensitivity / Detection Rate)`);
    console.log(`False Negatives (FN):  ${fn} / ${actualPositives}`);
    console.log(`True Negatives (TN):   ${tn} / ${actualNegatives} (${specificity.toFixed(1)}% Specificity)`);
    console.log(`False Positives (FP):  ${fp} / ${actualNegatives}`);
    console.log(`Overall Accuracy:      ${accuracy.toFixed(1)}%`);
    console.log('============================================================\n');

    if (falseNegatives.length > 0) {
      console.error('False Negatives Details:', falseNegatives);
    }
    if (falsePositives.length > 0) {
      console.error('False Positives Details:', falsePositives);
    }

    // Safety critical mandate: Zero false negatives on emergencies
    expect(fn).toBe(0);
    // Negation & routine robustness mandate: Zero false positives
    expect(fp).toBe(0);
    // Detection rate must be 100%
    expect(sensitivity).toBe(100);
    expect(accuracy).toBe(100);
  });
});

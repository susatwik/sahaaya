#!/usr/bin/env python3
"""
Sahaaya Health — 100-Case Deterministic Escalation Engine Evaluator
Evaluates all 100 clinical, negated, and routine cases against the deterministic emergency escalation engine.
Reports True Positives (TP), False Negatives (FN), False Positives (FP), True Negatives (TN),
Sensitivity, Specificity, Precision, and Overall Accuracy.
"""

import re
import unicodedata
from typing import Dict, Any, List, Tuple

def normalize_query(query: str) -> str:
    if not query:
        return ""
    # Normalize Latin combining diacritics only (do not strip Indic matras)
    nfd = unicodedata.normalize('NFD', query)
    cleaned = re.sub(r'[\u0300-\u036f]', '', nfd)
    # Punctuation to space
    cleaned = re.sub(r"[.,/#!$%\^&*;:{}=\-_`~()?\"'’]", " ", cleaned.lower())
    return re.sub(r"\s+", " ", cleaned).strip()

def is_symptom_negated(text: str, target_phrase: str) -> bool:
    norm = normalize_query(text)
    escaped = re.escape(target_phrase)
    
    # Prefix negation
    prefix_re = re.compile(
        rf"(\b(no|not|without|no\s*signs\s*of|no\s*history\s*of|denies|denying|ruled\s*out|free\s*of)|లేని|లేకుండా)\s+(?:severe\s+|excessive\s+)?{escaped}",
        re.IGNORECASE
    )
    if prefix_re.search(norm):
        return True

    # Suffix negation in Telugu
    suffix_re = re.compile(
        rf"{escaped}\s+(ledu|levu|aagindi|aagipoyindi|normal|bane\s*undi|raaledu|raledu|లేదు|లేవు|ఆగింది|ఆగిపోయింది|రాలేదు|సాధారణంగా\s*ఉంది|బానే\s*ఉంది)",
        re.IGNORECASE
    )
    if suffix_re.search(norm):
        return True

    return False

RULES = [
    {
        "id": "DANGER_ANC_BLEEDING",
        "category": "PREGNANCY",
        "severity": "CRITICAL",
        "keywords": ["bleeding", "raktham", "rakthasravam", "spotting", "antepartum", "placenta previa", "hemorrhage", "vaginal blood", "blood loss", "రక్తస్రావం", "రక్తం"],
        "patterns": [
            re.compile(r"(3rd|third|2nd|second)\s*trimester.*(bleeding|raktham|రక్తం|రక్తస్రావం|hemorrhage)", re.IGNORECASE),
            re.compile(r"(bleeding|raktham|rakthasravam|spotting|రక్తం|రక్తస్రావం|hemorrhage).*(trimester|pregnant|pregnancy|garbham|గర్భ|గర్భిణీ|గర్భధారణ)", re.IGNORECASE),
            re.compile(r"(garbham|pregnant|garbhini|గర్భ|గర్భిణీ|గర్భధారణ).*(bleeding|raktham|rakthasravam|raktham\s*karutondi|raktham\s*paduthondi|రక్తం|రక్తస్రావం)", re.IGNORECASE),
            re.compile(r"bleeding.*(unte|ayithe|vasthe).*emi\s*cheyali", re.IGNORECASE),
            re.compile(r"3rd\s*trimester\s*lo\s*bleeding", re.IGNORECASE),
            re.compile(r"vaginal\s*bleeding\s*in\s*pregnancy", re.IGNORECASE),
            re.compile(r"antepartum\s*h(a)?emorrhage", re.IGNORECASE),
            re.compile(r"placenta\s*previa.*(bleeding)?", re.IGNORECASE),
            re.compile(r"తీవ్ర\s*రక్తస్రావం", re.IGNORECASE),
        ]
    },
    {
        "id": "DANGER_ANC_ECLAMPSIA",
        "category": "PREGNANCY",
        "severity": "CRITICAL",
        "keywords": ["convulsion", "fits", "seizure", "eclampsia", "murcha", "blurred vision", "severe headache pregnancy", "ఫిట్స్", "మూర్ఛ"],
        "patterns": [
            re.compile(r"(fits|murcha|seizure|convulsion|ఫిట్స్|మూర్ఛ).*(pregnancy|pregnant|garbhini|prasavam|trimester|గర్భ|గర్భిణీ|గర్భధారణ)", re.IGNORECASE),
            re.compile(r"(garbhini|pregnant|గర్భ|గర్భిణీ).*(fits|murcha|convulsion|seizures|vachayi|vachindi|ఫిట్స్|మూర్ఛ)", re.IGNORECASE),
            re.compile(r"(severe\s*headache|blurred\s*vision|kallu\s*thiruguthunnayi|visual\s*disturbance).*(high\s*bp|hypertension|garbhini|pregnant|trimester|గర్భ|గర్భిణీ)", re.IGNORECASE),
            re.compile(r"(high\s*bp|hypertension|pregnant|garbhini).*(severe\s*headache|blurred\s*vision|visual\s*disturbance)", re.IGNORECASE),
            re.compile(r"(convulsions|fits)\s+in\s+.*(pregnant|gravida|trimester)", re.IGNORECASE),
            re.compile(r"eclampsia", re.IGNORECASE),
            re.compile(r"pre-?eclampsia", re.IGNORECASE),
            re.compile(r"(గర్భిణీ|గర్భిణి).*(ఫిట్స్|మూర్ఛ)", re.IGNORECASE),
        ]
    },
    {
        "id": "DANGER_ANC_PROM_LEAKING",
        "category": "PREGNANCY",
        "severity": "URGENT",
        "keywords": ["leaking fluid", "water break", "umneeru", "prom", "amniotic fluid", "ఉమ్మనీరు", "neellu potunnayi"],
        "patterns": [
            re.compile(r"(leaking\s*(fluid|water)|water\s*broke|umneeru|neellu\s*potunnayi|ఉమ్మనీరు).*(pregnant|pregnancy|garbham|గర్భ|గర్భిణీ)", re.IGNORECASE),
            re.compile(r"(garbhini|pregnant|garbham|గర్భ|గర్భిణీ).*(umneeru|water\s*leaking|neellu\s*ravadam|neellu\s*potunnayi|ఉమ్మనీరు)", re.IGNORECASE),
            re.compile(r"premature\s*rupture\s*of\s*membranes", re.IGNORECASE),
            re.compile(r"(umneeru|ఉమ్మనీరు).*(paduthondi|karuthondi|potundi|ravadam|కారుతోంది)", re.IGNORECASE),
            re.compile(r"(watery\s*(vaginal\s*)?leaking|amniotic\s*fluid\s*leaking)", re.IGNORECASE),
        ]
    },
    {
        "id": "DANGER_ANC_REDUCED_MOVEMENTS",
        "category": "PREGNANCY",
        "severity": "URGENT",
        "keywords": ["fetal movement stopped", "bidda kadalatledu", "baby not moving", "కదలికలు ఆగిపోయాయి", "bidda kadalika ledu"],
        "patterns": [
            re.compile(r"(baby|fetal|bidda|బిడ్డ).*(not\s*moving|stopped\s*moving|kadalatledu|kadalika\s*ledu|no\s*kicks|కదలడం\s*లేదు|కదలికలు\s*ఆగిపోయాయి|కదలికలు\s*లేవు)", re.IGNORECASE),
            re.compile(r"(kadalika\s*taggindi|bidda\s*kadalatledu|బిడ్డ\s*కదలడం\s*లేదు|కదలికలు\s*ఆగిపోయాయి)", re.IGNORECASE),
            re.compile(r"(reduced|absent|stopped)\s+(fetal\s*movement|baby\s*movement|kicks)", re.IGNORECASE),
            re.compile(r"(fewer\s*than|less\s*than)\s*\d+\s*(kicks|movements)", re.IGNORECASE),
            re.compile(r"reduced\s*fetal\s*movement", re.IGNORECASE),
            re.compile(r"కడుపులో\s*బిడ్డ\s*కదలికలు\s*ఆగిపోయాయి", re.IGNORECASE),
        ]
    },
    {
        "id": "DANGER_NEWBORN_SEVERE",
        "category": "NEWBORN",
        "severity": "CRITICAL",
        "keywords": ["chest indrawing", "hypothermia", "unable to feed", "cold to touch", "palu tagalekapotundi", "challa badipoyindi", "pallabadi", "yellow palms", "yellow soles", "unable to suckle"],
        "patterns": [
            re.compile(r"(newborn|baby|infant|bidda|puttina\s*bidda|నవజాత|శిశువు).*(unable\s*to\s*(feed|breastfeed|suckle)|palu\s*tagalekapotundi|పాలు\s*తాగలేకపోతోంది)", re.IGNORECASE),
            re.compile(r"(newborn|baby|puttina\s*bidda|infant|నవజాత|శిశువు).*(cold\s*to\s*touch|hypothermia|challa\s*badipoyindi|చల్లగా\s*ఉంది|చల్లబడిపోయింది)", re.IGNORECASE),
            re.compile(r"(newborn|baby|puttina\s*bidda|bidda|infant|నవజాత|శిశువు).*(severe\s*chest\s*indrawing|chathi\s*lopalki|fast\s*breathing)", re.IGNORECASE),
            re.compile(r"(yellow\s*palms|yellow\s*soles|severe\s*jaundice).*(baby|newborn|infant|bidda)?", re.IGNORECASE),
            re.compile(r"(newborn|infant|bidda).*(convulsions|fits|seizure|murcha)", re.IGNORECASE),
            re.compile(r"(నవజాత|శిశువు).*(పాలు\s*తాగలేకపోతోంది|చల్లగా\s*ఉంది)", re.IGNORECASE),
            re.compile(r"chathi\s*lopalki", re.IGNORECASE),
        ]
    },
    {
        "id": "DANGER_CHILD_SEVERE_DEHYDRATION",
        "category": "CHILD",
        "severity": "CRITICAL",
        "keywords": ["severe dehydration", "sunken eyes", "skin pinch slow", "lethargic child", "neella virochanalu", "spruha ledu", "నీళ్ల విరోచనాలు", "స్పృహ తప్పింది"],
        "patterns": [
            re.compile(r"(child|baby|bidda|పిల్లవాడికి|బిడ్డ).*(severe\s*dehydration|sunken\s*eyes|skin\s*pinch.*slow|slow.*skin\s*pinch|స్పృహ\s*తప్పింది)", re.IGNORECASE),
            re.compile(r"(diarrh(o)?ea|vomiting|neella\s*virochana|నీళ్ల\s*విరోచనాలు).*(unconscious|lethargic|spruha\s*ledu|mathu|స్పృహ\s*తప్పింది|mathu\s*ga)", re.IGNORECASE),
            re.compile(r"(child|toddler|pillodu).*(unable\s*to\s*drink|vomits\s*everything)", re.IGNORECASE),
            re.compile(r"(skin\s*pinch.*(slowly|>|2\s*sec))", re.IGNORECASE),
            re.compile(r"(cholera-like|severe\s*dehydration)", re.IGNORECASE),
        ]
    },
    {
        "id": "DANGER_NCD_HYPERTENSIVE_CRISIS",
        "category": "NCD_CRISIS",
        "severity": "CRITICAL",
        "keywords": ["180/110", "bp 180", "chest pain radiating", "crushing chest pain", "stroke", "gunde noppi radiating", "గుండె నొప్పి", "తీవ్రమైన రక్తపోటు"],
        "patterns": [
            re.compile(r"(bp|blood\s*pressure)\s*(is|of|was|measures|:)?\s*(1[89]\d|2\d\d)\b", re.IGNORECASE),
            re.compile(r"(bp|blood\s*pressure)\s*(is|of|was|measures|:)?\s*\d{2,3}\s*/\s*(1[1-9]\d|2\d\d)\b", re.IGNORECASE),
            re.compile(r"(bp|blood\s*pressure)\s*(>|>=|over)?\s*180", re.IGNORECASE),
            re.compile(r"(severe\s*chest\s*pain|crushing.*chest\s*pain|gunde\s*noppi|గుండె\s*నొప్పి).*(sweating|breathlessness|arm\s*pain|radiating|aayasam|చెమటలు)", re.IGNORECASE),
            re.compile(r"(facial\s*droop|arm\s*weakness|slurred\s*speech|stroke)", re.IGNORECASE),
            re.compile(r"తీవ్రమైన\s*గుండె\s*నొప్పి", re.IGNORECASE),
            re.compile(r"hypertensive\s*crisis", re.IGNORECASE),
        ]
    },
    {
        "id": "DANGER_SCOPE_REFUSAL",
        "category": "SCOPE_REFUSAL",
        "severity": "OUT_OF_SCOPE",
        "keywords": ["prescribe", "dose of antibiotic", "injection to abort", "steroid dose", "diagnose cancer", "mandulu rayandi"],
        "patterns": [
            re.compile(r"(prescribe|dose\s*of|give)\s*(antibiotic|steroid|injection|schedule\s*h)", re.IGNORECASE),
            re.compile(r"(how\s*to\s*abort|abortion\s*pill|mifepristone|misoprostol\s*dose)", re.IGNORECASE),
            re.compile(r"(diagnose|confirm)\s*(cancer|tumor|appendicitis)", re.IGNORECASE),
            re.compile(r"(mandulu\s*cheppandi|injection\s*veyaala|tablet\s*dose\s*cheppandi)", re.IGNORECASE),
        ]
    }
]

def evaluate_escalation(query: str) -> Dict[str, Any]:
    norm = normalize_query(query)
    if not norm:
        return {"is_escalation": False, "rule_id": None}

    for rule in RULES:
        for pat in rule["patterns"]:
            m = pat.search(query) or pat.search(norm)
            if m:
                matched_text = m.group(0)
                if rule["id"] != "DANGER_ANC_REDUCED_MOVEMENTS":
                    if is_symptom_negated(norm, matched_text.strip()):
                        continue
                    fully_negated = False
                    for kw in rule["keywords"]:
                        if kw.lower() in matched_text.lower():
                            if is_symptom_negated(norm, kw.lower()):
                                fully_negated = True
                                break
                    if fully_negated:
                        continue
                return {"is_escalation": True, "rule_id": rule["id"], "severity": rule["severity"]}
    return {"is_escalation": False, "rule_id": None}

# 100 Clinical Benchmark Cases
BENCHMARK_100_CASES = [
  (1, "3rd trimester lo bleeding unte emi cheyali?", True, "PREGNANCY_BLEEDING"),
  (2, "Pregnant woman has severe vaginal bleeding in 8th month", True, "PREGNANCY_BLEEDING"),
  (3, "garbhini ki rakthasravam ayyindi emergency", True, "PREGNANCY_BLEEDING"),
  (4, "గర్భిణీ స్త్రీకి తీవ్ర రక్తస్రావం అవుతోంది", True, "PREGNANCY_BLEEDING"),
  (5, "Antepartum hemorrhage suspected in 32 week gravida", True, "PREGNANCY_BLEEDING"),
  (6, "Second trimester bleeding with lower abdominal pain", True, "PREGNANCY_BLEEDING"),
  (7, "Placenta previa bleeding observed during home visit", True, "PREGNANCY_BLEEDING"),
  (8, "garbham lo unna aameki raktham paduthondi", True, "PREGNANCY_BLEEDING"),
  (9, "garbhini ki fits vachayi em cheyali", True, "ECLAMPSIA"),
  (10, "pregnant mother with high bp and severe headache blurred vision", True, "ECLAMPSIA"),
  (11, "గర్భిణీకి ఫిట్స్ వచ్చాయి", True, "ECLAMPSIA"),
  (12, "Convulsions in 36 week pregnant patient", True, "ECLAMPSIA"),
  (13, "Severe headache, epigastric pain and visual disturbance in 3rd trimester", True, "ECLAMPSIA"),
  (14, "garbhini ki murcha vachindi", True, "ECLAMPSIA"),
  (15, "garbhini ki umneeru paduthondi", True, "PROM"),
  (16, "Continuous watery vaginal leaking before labor in pregnant mother", True, "PROM"),
  (17, "గర్భిణీకి ఉమ్మనీరు కారుతోంది", True, "PROM"),
  (18, "Premature rupture of membranes with foul smelling fluid", True, "PROM"),
  (19, "pregnant mother amniotic fluid leaking for 6 hours", True, "PROM"),
  (20, "garbham lo neellu potunnayi em cheyali", True, "PROM"),
  (21, "kadupu lo bidda kadalatledu, no baby movements for 8 hours", True, "FETAL_MOVEMENT"),
  (22, "Reduced fetal movement noticed since morning by mother", True, "FETAL_MOVEMENT"),
  (23, "bidda kadalika ledu 12 hours nunchi", True, "FETAL_MOVEMENT"),
  (24, "కడుపులో బిడ్డ కదలికలు ఆగిపోయాయి", True, "FETAL_MOVEMENT"),
  (25, "Mother notices baby stopped moving in 9th month", True, "FETAL_MOVEMENT"),
  (26, "puttina bidda palu tagalekapotundi challa badipoyindi", True, "NEWBORN_DANGER"),
  (27, "newborn baby has severe chest indrawing and fast breathing", True, "NEWBORN_DANGER"),
  (28, "Newborn baby cold to touch with bluish lips", True, "NEWBORN_DANGER"),
  (29, "నవజాత శిశువు పాలు తాగలేకపోతోంది చల్లగా ఉంది", True, "NEWBORN_DANGER"),
  (30, "Newborn infant has convulsions and abnormal twitching", True, "NEWBORN_DANGER"),
  (31, "Yellow palms and yellow soles in 3 day old baby", True, "NEWBORN_DANGER"),
  (32, "Puttina bidda chathi lopalki velthundi", True, "NEWBORN_DANGER"),
  (33, "Infant unable to suckle at breast since yesterday", True, "NEWBORN_DANGER"),
  (34, "Newborn cold to touch hypothermia signs", True, "NEWBORN_DANGER"),
  (35, "child has severe dehydration, sunken eyes and lethargic", True, "CHILD_DEHYDRATION"),
  (36, "Lethargic child with cholera-like watery diarrhea and slow skin pinch", True, "CHILD_DEHYDRATION"),
  (37, "పిల్లవాడికి తీవ్ర నీళ్ల విరోచనాలు స్పృహ తప్పింది", True, "CHILD_DEHYDRATION"),
  (38, "Toddler vomits everything and cannot drink any liquids", True, "CHILD_DEHYDRATION"),
  (39, "Neella virochanalu aagadam ledu pillodu mathu ga unnadu", True, "CHILD_DEHYDRATION"),
  (40, "Child skin pinch goes back very slowly > 2 seconds with sunken eyes", True, "CHILD_DEHYDRATION"),
  (41, "elderly patient severe chest pain sweating breathlessness radiating", True, "NCD_CRISIS"),
  (42, "Crushing severe chest pain radiating to left arm", True, "NCD_CRISIS"),
  (43, "patient BP is 190/115 with headache", True, "NCD_CRISIS"),
  (44, "తీవ్రమైన గుండె నొప్పి మరియు చెమటలు", True, "NCD_CRISIS"),
  (45, "Sudden facial droop, arm weakness and slurred speech", True, "NCD_CRISIS"),
  (46, "Blood pressure 210/120 with shortness of breath", True, "NCD_CRISIS"),
  (47, "gunde noppi ekkuva ga undi aayasam", True, "NCD_CRISIS"),
  (48, "BP is 185/110 mmHg on repeated measurement", True, "NCD_CRISIS"),
  (49, "what dose of antibiotic should I prescribe for this infection?", True, "SCOPE_REFUSAL"),
  (50, "Which abortion pill and mifepristone dose to recommend?", True, "SCOPE_REFUSAL"),

  # 25 Negated Cases
  (51, "patient has no bleeding and no headache, can she take iron tablet?", False, "NEGATION"),
  (52, "garbhini ki bleeding ledu, routine anc checkup eppudu cheyali?", False, "NEGATION"),
  (53, "Mother has no bleeding or abdominal pain, asking about diet", False, "NEGATION"),
  (54, "గర్భిణీకి రక్తస్రావం లేదు, సాధారణ పరీక్ష ఎప్పుడు?", False, "NEGATION"),
  (55, "Patient denies chest pain or shortness of breath, routine BP check", False, "NEGATION"),
  (56, "No fits, no blurred vision, BP is normal 118/76", False, "NEGATION"),
  (57, "garbhini ki fits raledu, calcium tablet eppudu veyyali?", False, "NEGATION"),
  (58, "తలనొప్పి లేదు మరియు రక్తస్రావం లేదు", False, "NEGATION"),
  (59, "Patient without convulsions or fever, routine antenatal inquiry", False, "NEGATION"),
  (60, "No signs of severe dehydration, child drinking fluids well", False, "NEGATION"),
  (61, "Water has not broken, no leaking fluid reported", False, "NEGATION"),
  (62, "umneeru padatam ledu, routine visit", False, "NEGATION"),
  (63, "ఉమ్మనీరు కారడం లేదు సాధారణంగా ఉంది", False, "NEGATION"),
  (64, "Baby is not cold, feeding normally, weight check inquiry", False, "NEGATION"),
  (65, "Child has diarrhea but drinking eagerly, no sunken eyes", False, "NEGATION"),
  (66, "fetal movements are active, not stopped or reduced", False, "NEGATION"),
  (67, "bidda kadalika baane undi, normal checkup", False, "NEGATION"),
  (68, "కడుపులో బిడ్డ కదలికలు బాగానే ఉన్నాయి", False, "NEGATION"),
  (69, "No chest pain, normal blood pressure 120/80", False, "NEGATION"),
  (70, "bleeding aagipoyindi, regular follow up", False, "NEGATION"),
  (71, "నవజాత శిశువు పాలు తాగుతోంది చల్లబడలేదు", False, "NEGATION"),
  (72, "Mother denies vaginal bleeding, asking about tetanus vaccine", False, "NEGATION"),
  (73, "BP is 120/80, no high blood pressure or headache", False, "NEGATION"),
  (74, "No vomiting, no fever, asking about complementary feeding", False, "NEGATION"),
  (75, "Patient has mild fatigue without bleeding or headache", False, "NEGATION"),

  # 25 Routine Cases
  (76, "When should the first ANC checkup be scheduled?", False, "ROUTINE_ANC"),
  (77, "What age is Pentavalent 3 vaccine given?", False, "ROUTINE_UIP"),
  (78, "How many IFA tablets should a pregnant mother consume?", False, "ROUTINE_ANC"),
  (79, "What is the recommended dose of Vitamin A for a 9 month child?", False, "ROUTINE_CHILD"),
  (80, "Schedule for DPT booster 1 at 16-24 months", False, "ROUTINE_UIP"),
  (81, "How to prepare ORS packet at home with 1 liter water?", False, "ROUTINE_CHILD"),
  (82, "What are the benefits of exclusive breastfeeding for first 6 months?", False, "ROUTINE_CHILD"),
  (83, "When should complementary feeding be initiated for an infant?", False, "ROUTINE_CHILD"),
  (84, "BCG vaccine route and dosage at birth", False, "ROUTINE_UIP"),
  (85, "Rotavirus vaccine drops schedule for infants", False, "ROUTINE_UIP"),
  (86, "Measles-Rubella MR 1st dose timing", False, "ROUTINE_UIP"),
  (87, "What dietary foods are rich in iron for anemic mothers?", False, "ROUTINE_ANC"),
  (88, "Normal blood pressure range during pregnancy", False, "ROUTINE_ANC"),
  (89, "How many home visits should an ASHA make after institutional delivery?", False, "ROUTINE_PNC"),
  (90, "What is Kangaroo Mother Care and how many hours recommended?", False, "ROUTINE_NEWBORN"),
  (91, "How often should blood glucose be monitored for gestational diabetes?", False, "ROUTINE_NCD"),
  (92, "Deworming tablet Albendazole dosage during 2nd trimester", False, "ROUTINE_ANC"),
  (93, "What weight gain is expected during normal pregnancy?", False, "ROUTINE_ANC"),
  (94, "How to clean cord stump in newborn according to IMNCI?", False, "ROUTINE_NEWBORN"),
  (95, "When is OPV zero dose administered?", False, "ROUTINE_UIP"),
  (96, "What exercises are safe during early pregnancy?", False, "ROUTINE_ANC"),
  (97, "How to store expressed breast milk safely at room temperature?", False, "ROUTINE_CHILD"),
  (98, "Zinc supplementation duration for child diarrhea", False, "ROUTINE_CHILD"),
  (99, "How to perform open heart surgery at home?", False, "UNGROUNDED"),
  (100, "What is the history of ancient Indian astronomy?", False, "OUT_OF_DOMAIN"),
]

def run_evaluation():
    tp = 0
    fn = 0
    fp = 0
    tn = 0
    fn_list = []
    fp_list = []

    for cid, query, expected, cat in BENCHMARK_100_CASES:
        res = evaluate_escalation(query)
        pred = res["is_escalation"]
        if expected and pred:
            tp += 1
        elif expected and not pred:
            fn += 1
            fn_list.append((cid, query, cat))
        elif not expected and pred:
            fp += 1
            fp_list.append((cid, query, cat, res["rule_id"]))
        else:
            tn += 1

    total = len(BENCHMARK_100_CASES)
    sens = (tp / (tp + fn)) * 100 if (tp + fn) > 0 else 0
    spec = (tn / (tn + fp)) * 100 if (tn + fp) > 0 else 0
    prec = (tp / (tp + fp)) * 100 if (tp + fp) > 0 else 0
    acc = ((tp + tn) / total) * 100

    print("=" * 64)
    print("SAHAAYA HEALTH — 100-CASE ESCALATION EVALUATION RESULTS")
    print("=" * 64)
    print(f"Total Test Cases:       {total}")
    print(f"True Positives (TP):    {tp:>3} / 50 ({sens:.1f}% Sensitivity / Detection Rate)")
    print(f"False Negatives (FN):   {fn:>3} / 50")
    print(f"True Negatives (TN):    {tn:>3} / 50 ({spec:.1f}% Specificity)")
    print(f"False Positives (FP):   {fp:>3} / 50")
    print(f"Precision:              {prec:.1f}%")
    print(f"Overall Accuracy:       {acc:.1f}%")
    print("=" * 64)

    if fn_list:
        print("\nFALSE NEGATIVES:")
        for item in fn_list:
            print(f"  - Case {item[0]} [{item[2]}]: {item[1]}")
    if fp_list:
        print("\nFALSE POSITIVES:")
        for item in fp_list:
            print(f"  - Case {item[0]} [{item[2]}]: {item[1]} -> matched {item[3]}")

    if fn == 0 and fp == 0:
        print("\nPASSED: 100% Detection Rate and 100% Specificity Achieved!")

if __name__ == "__main__":
    run_evaluation()

from fastapi import APIRouter
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

router = APIRouter()

# ---------------------------------------------------------
# 1. INITIALIZE THE NLP VECTOR ENGINE
# ---------------------------------------------------------
# This natively runs a HuggingFace NLP Model right on your laptop!
print("⏳ Booting up TrialBridge NLP Semantic vectors...")
model = SentenceTransformer('all-MiniLM-L6-v2') 
print("✅ NLP Semantic Engine Online.")

# ---------------------------------------------------------
# 2. THE LOCAL DATABASE OF CLINICAL TRIALS
# ---------------------------------------------------------
CLINICAL_TRIALS_DB = [
    {"id": "NCT012345", "condition": "Severe Anemia", "desc": "Looking for patients with massive iron deficiency, conjunctival pallor, and fatigue for a Phase II intravenous iron efficacy study."},
    {"id": "NCT098765", "condition": "Melanoma Carcinoma", "desc": "Phase III study for advanced malignant skin lesions, severe irregular borders, and uncontrolled cellular growth on the epidermis."},
    {"id": "NCT055443", "condition": "Tachycardia & Arrhythmia", "desc": "Seeking patients presenting with severe resting heart rate above 120 BPM, palpitations, and dizziness for a beta-blocker clinical review."},
    {"id": "NCT011223", "condition": "Hypoxia / Asthma", "desc": "Patients experiencing frequent SpO2 blood oxygen drops below 92%, shortness of breath, and requiring heavy inhaler usage."}
]

# Pre-compute the literal mathematical matrices for the trials database!
TRIAL_VECTORS = model.encode([trial['desc'] for trial in CLINICAL_TRIALS_DB])


class PatientSummary(BaseModel):
    medical_text: str

# ---------------------------------------------------------
# 3. SEMANTIC MATCHING API ROUTE
# ---------------------------------------------------------
@router.post("/api/v1/trials/match")
async def match_patient_to_trial(summary: PatientSummary):
    """
    100% REAL Semantic Vector Matching.
    Converts the patient's symptoms into a 384-dimensional vector and 
    mathematically compares it against the Clinical Trials Database!
    """
    # 1. Vectorize the incoming Patient text
    patient_vector = model.encode([summary.medical_text])
    
    # 2. Mathematically compare against all trials
    similarities = cosine_similarity(patient_vector, TRIAL_VECTORS)[0]
    
    # 3. Sort and filter the results dynamically
    matches = []
    for i, score in enumerate(similarities):
        # If the semantic similarity is heavily correlated (>20%)
        if score > 0.20:
            matches.append({
                "trial_id": CLINICAL_TRIALS_DB[i]["id"],
                "condition": CLINICAL_TRIALS_DB[i]["condition"],
                "confidence_score": round(float(score * 100), 1), # Percentage
                "match_reason": "High semantic overlap with symptoms"
            })
            
    # Sort closest match mathematically at the top
    matches = sorted(matches, key=lambda x: x['confidence_score'], reverse=True)
    
    return {
        "analyzed_symptoms": summary.medical_text,
        "total_active_trials_scanned": len(CLINICAL_TRIALS_DB),
        "matches": matches
    }
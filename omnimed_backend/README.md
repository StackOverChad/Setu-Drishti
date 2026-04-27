# omnimed_backend Module

Part of the Setu-Drishti x OmniMed Hacknation 2.0 Repository.

### Private Repo Notice
This repo is preconfigured so all team members can run it instantly. Internal configuration files, environments (.env), and package structures are explicitly tracked to reduce setup time. Pull the repo and run it immediately!

# OmniMed Backend — FastAPI Server

The Python FastAPI backend that powers all six AI modules of the OmniMed platform. It handles real-time AI inference, EHR anomaly detection, clinical trial matching, offline patient sync, and district health intelligence.

---

## Architecture Overview

```
omnimed_backend/
├── main.py                        ← FastAPI app + router registration + static serving
├── database.py                    ← SQLAlchemy ORM models (PatientRecord table)
├── requirements.txt               ← All Python deps — pinned exact versions
├── simulate_district_nodes.py     ← Multi-node crisis simulation script
├── ml_models/
│   ├── sentineliq_isolation_forest.joblib   ← Pre-trained IsolationForest (EHR fraud)
│   └── sentineliq_label_encoder.joblib      ← Provider role label encoder
└── routers/
    ├── nidana_vision.py           ← POST /api/v1/analyze_image
    ├── trial_bridge.py            ← POST /api/v1/trials/match
    ├── security.py                ← POST /api/v1/security/audit
    ├── sync_layer.py              ← POST /api/v1/sync
    ├── voice_triage.py            ← POST /api/v1/voice/analyze_tone
    └── population_pulse.py        ← GET  /api/v1/population/dashboard
```

---

## Setup

### 1. Create & Activate Virtual Environment

```bash
# Create
python -m venv venv

# Activate — Windows
venv\Scripts\activate

# Activate — Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

> First install takes ~5-10 minutes due to PyTorch and SentenceTransformers (~2-3 GB).

---

## Running the Server

```bash
# Must bind to 0.0.0.0 so mobile devices on the same Wi-Fi can reach it
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Startup Output:**
```
⏳ Booting up TrialBridge NLP Semantic vectors...
✅ NLP Semantic Engine Online.
✅ PyTorch MobileNetV2 successfully injected into FastAPI Engine!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

- **API base:** `http://localhost:8000`
- **Swagger UI:** `http://localhost:8000/docs`
- **Web dashboard:** `http://localhost:8000/web/` *(requires `npm run build` in omnimed-web first)*

---

## Running the District Simulation

The simulation script emulates **25 frontline ASHA workers** syncing compressed patient records simultaneously — populating the PopulationPulse district dashboard with real data.

### Prerequisites
Backend server must be running on port 8000 before launching simulation.

### Command

```bash
# In a NEW terminal with venv activated:
cd omnimed_backend
venv\Scripts\activate

python simulate_district_nodes.py
```

### What it does
- Generates synthetic patient records with randomized symptom clusters
- POSTs each record to `/api/v1/sync` exactly as a real edge device would
- Simulates diverse geographic locations: Village A, Village B, Block 7, Sector 4, Highland Ridge
- After completion, the `/api/v1/population/dashboard` endpoint returns aggregated hot-zone data

### Expected Output
```
=========================================
[START] OmniMed Edge Node Crisis Simulator
=========================================
Simulating 25 frontline health workers actively syncing data from the field...
[Sync OK] Synced P-6489 from Village B | Tags: rash, chronic fatigue, cough
[Sync OK] Synced P-2938 from Village B | Tags: cough
...
[Sync OK] Synced P-8385 from Sector 4  | Tags: rash, fever, anemia
=========================================
[DONE] Simulation complete — 25 patient records synced.
=========================================
```

---

## API Reference

### Health Check
```http
GET /
```
Returns server status and version.

---

### ToneScore — Analyze Vocal Tone
```http
POST /api/v1/voice/analyze_tone
Content-Type: application/json

{
  "audio_base64": "",
  "transcribed_text": "severe chest pain, I cannot breathe"
}
```
**Response:**
```json
{
  "analyzed_transcript": "...",
  "acoustic_urgency_score": 94.7,
  "detected_emotions": ["Distress", "Fear", "High Pain"],
  "triage_color": "RED",
  "recommendation": "CRITICAL: Immediate Nurse Dispatch Required!"
}
```

---

### Nidana Vision — Analyze Skin Image
```http
POST /api/v1/analyze_image
Content-Type: application/json

{
  "image_base64": "<base64-encoded-image-string>"
}
```
**Response:**
```json
{
  "diagnosis": "Melanocytic Nevus",
  "confidence_score": 0.87,
  "urgency_level": "LOW"
}
```

---

### TrialBridge — Match Clinical Trials
```http
POST /api/v1/trials/match
Content-Type: application/json

{
  "medical_text": "severe iron deficiency anemia, hemoglobin 7.2 g/dL"
}
```
**Response:**
```json
{
  "analyzed_symptoms": "...",
  "total_active_trials_scanned": 4,
  "matches": [
    {
      "trial_id": "NCT012345",
      "condition": "Severe Anemia",
      "confidence_score": 78.4,
      "match_reason": "High semantic overlap with symptoms"
    }
  ]
}
```

---

### SentinelIQ — EHR Audit
```http
POST /api/v1/security/audit
Content-Type: application/json

{
  "provider_role": "Cardiologist",
  "access_hour": 14,
  "billing_coherence_score": 0.85
}
```
**Response:**
```json
{
  "is_anomaly": false,
  "action_taken": "CLEARED"
}
```

---

### Sync — Push Offline Patient Record
```http
POST /api/v1/sync
Content-Type: application/json

{
  "patient_id": "P-001",
  "clinical_notes": "BP 130/85, HR 72 ...",
  "vitals_drift_score": 2.1,
  "location_block": "Village A",
  "diagnosis_tags": "fever,cough",
  "medication_used": "Paracetamol"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Offline payload synced to cloud.",
  "bytes_processed": 47
}
```

---

### PopulationPulse — District Dashboard
```http
GET /api/v1/population/dashboard
```
Returns aggregated district health intelligence: symptom hot-zones, supply chain burn rates, and screening gaps. Run `simulate_district_nodes.py` first to populate data.

---

## Important Notes for Teammates

- **Do NOT re-train** `ml_models/*.joblib` unless updating SentinelIQ — the pre-trained models are already included.
- The `InconsistentVersionWarning` for scikit-learn (1.6.1 vs 1.8.0) is **non-breaking** — safe to ignore.
- The `X does not have valid feature names` warning from SentinelIQ is also **non-breaking**.
- Phone and PC **must be on the same Wi-Fi** for mobile sync to work.
- Find PC IP with `ipconfig` (Windows) and update all `BACKEND_URL` constants in the mobile app.

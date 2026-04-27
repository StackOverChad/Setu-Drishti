# . Module

Part of the Setu-Drishti x OmniMed Hacknation 2.0 Repository.

### Private Repo Notice
This repo is preconfigured so all team members can run it instantly. Internal configuration files, environments (.env), and package structures are explicitly tracked to reduce setup time. Pull the repo and run it immediately!

# OmniMed — Unified AI Clinical Intelligence Platform

<div align="center">

```
  ╔═══════════════════════════════════════════════════════════╗
  ║   O M N I M E D  —  Unified AI Clinical OS               ║
  ║   Six AI Modules · Offline-First · India-Built            ║
  ╚═══════════════════════════════════════════════════════════╝
```

**One Platform. Six AI Modules. Zero Internet Required.**

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev)
[![React Native](https://img.shields.io/badge/React_Native-Expo-black?logo=expo)](https://expo.dev)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

</div>

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture](#-architecture)
3. [Six AI Modules](#-six-ai-modules)
4. [Project Structure](#-project-structure)
5. [Prerequisites](#-prerequisites)
6. [Installation & Setup](#-installation--setup)
   - [Backend (FastAPI)](#1-backend-fastapi)
   - [Web Dashboard (React + Vite)](#2-web-dashboard-react--vite)
   - [Mobile App (React Native / Expo)](#3-mobile-app-react-native--expo)
7. [Running All Services](#-running-all-services)
8. [Starting the District Simulation](#-starting-the-district-simulation)
9. [API Reference](#-api-reference)
10. [Network Configuration (Mobile)](#-network-configuration-mobile)
11. [Known Issues & Notes](#-known-issues--notes)

---

## 🏥 Project Overview

OmniMed is an **offline-first AI health operating system** designed for frontline health workers, rural ASHA workers, and hospital administrators in India. It merges six distinct AI capabilities into a single unified platform that functions **100% offline on edge devices** and synchronises data opportunistically when connectivity is restored.

**Target Users:**
- 🏥 Physicians & Specialists
- 👩‍⚕️ ASHA / ANM Frontline Workers
- 🏛️ District Health Officers
- 🔬 Clinical Researchers

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         LAYER 3: CLOUD                          │
│         FastAPI Backend · SQLite DB · SentenceTransformers      │
│              http://0.0.0.0:8000                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Opportunistic HTTP/2 Sync
┌───────────────────────────▼─────────────────────────────────────┐
│                      LAYER 2: SYNC                              │
│        Compressed JSON Payloads · FHIR R4 Structured Data       │
│        Bluetooth LE · Wi-Fi (same subnet)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ On-Device Inference
┌───────────────────────────▼─────────────────────────────────────┐
│                      LAYER 1: EDGE                              │
│    React Native Mobile App · ONNX/TFLite · SQLite + AES-256     │
│    100% Offline Capable · npx expo start --dev-client           │
└─────────────────────────────────────────────────────────────────┘
```

**Web Dashboard** is served by the backend at `http://localhost:8000/web/` (production build) or directly via Vite dev server at `http://localhost:3000/web/`.

---

## 🤖 Six AI Modules

| # | Module | Tech Stack | Capability |
|---|--------|-----------|------------|
| 1 | **ToneScore Triage** | Sentiment NLP + openSMILE | Analyzes vocal acoustics & transcript sentiment → composite urgency score |
| 2 | **Nidana Vision+** | MobileNetV2 CNN (PyTorch) | Skin lesion classification, anemia detection from smartphone camera |
| 3 | **TrialBridge** | SentenceTransformers (all-MiniLM-L6-v2) | Semantic vector matching of patient profile to clinical trials database |
| 4 | **SentinelIQ** | Isolation Forest (scikit-learn) | Unsupervised EHR anomaly detection — flags fraud without labelled data |
| 5 | **PulseWatch** | LSTM Autoencoder + BLE GATT | Wearable RPM: detects vitals deterioration 6-12h before clinical signs |
| 6 | **ScribeFlow+** | Whisper-small + spaCy NER | Ambient clinical scribe: transcribes, extracts ICD-10 codes, fills EHR |

---

## 📁 Project Structure

```
Hacknation Shivalik Hackathon ACM/
│
├── README.md                          ← This file (root overview)
│
├── omnimed_backend/                   ← FastAPI Python Backend
│   ├── main.py                        ← App entry point, router registration, static serving
│   ├── database.py                    ← SQLAlchemy models + SQLite setup
│   ├── requirements.txt               ← All Python dependencies (pinned)
│   ├── simulate_district_nodes.py     ← Crisis simulation script (25 edge nodes)
│   ├── ml_models/
│   │   ├── sentineliq_isolation_forest.joblib  ← Pre-trained IsolationForest
│   │   └── sentineliq_label_encoder.joblib     ← Role label encoder
│   └── routers/
│       ├── nidana_vision.py           ← POST /api/v1/analyze_image
│       ├── trial_bridge.py            ← POST /api/v1/trials/match
│       ├── security.py                ← POST /api/v1/security/audit
│       ├── sync_layer.py              ← POST /api/v1/sync
│       ├── voice_triage.py            ← POST /api/v1/voice/analyze_tone
│       └── population_pulse.py        ← GET  /api/v1/population/dashboard
│
├── omnimed-web/                       ← React + Vite Web Dashboard
│   ├── index.html                     ← HTML entry point
│   ├── vite.config.js                 ← Vite config (base: /web/, proxy: :8000)
│   ├── package.json                   ← Node deps (React 18, Vite 5)
│   ├── src/
│   │   ├── main.jsx                   ← React root, imports CSS
│   │   ├── App.jsx                    ← Root component, page routing, state
│   │   ├── styles/main.css            ← Full design system (dark/light themes)
│   │   ├── services/api.js            ← All fetch() calls to FastAPI
│   │   ├── hooks/useApp.js            ← useTheme, useBackendStatus, useToast, etc.
│   │   ├── components/
│   │   │   ├── Landing.jsx            ← Landing page with module cards
│   │   │   ├── Sidebar.jsx            ← Navigation + backend status
│   │   │   ├── Toast.jsx              ← Toast notification system
│   │   │   └── Loader.jsx             ← Global loading overlay
│   │   └── modules/
│   │       ├── Dashboard.jsx          ← Stats, patient list, audit log
│   │       ├── Triage.jsx             ← ToneScore urgency gauge
│   │       ├── Nidana.jsx             ← Drag-and-drop skin image analysis
│   │       ├── TrialBridge.jsx        ← Clinical trial matching UI
│   │       ├── SentinelIQ.jsx         ← EHR audit with Isolation Forest
│   │       └── Sync.jsx               ← Offline patient sync
│   └── styles/main.css                ← Original CSS (also copied to src/styles/)
│
└── omnimed-mobile/                    ← React Native (Expo) Mobile App
    ├── app/
    │   ├── index.tsx                  ← Landing screen
    │   ├── dashboard.tsx              ← Main dashboard
    │   ├── triage.tsx                 ← ToneScore (voice analysis)
    │   ├── nidana.tsx                 ← Nidana Vision (camera + image)
    │   ├── trialbridge.tsx            ← Trial matching interface
    │   ├── sentineliq.tsx             ← EHR security audit
    │   └── district.tsx               ← PopulationPulse district map
    ├── components/
    │   ├── ToneScore.tsx              ← Voice emotional triage component
    │   └── TrialBridge.tsx            ← Trial matching component
    ├── services/
    │   ├── OfflineSync.ts             ← Sync offline data → backend (IP config here)
    │   └── ModelRunner.ts             ← On-device model inference (IP config here)
    └── package.json
```

---

## ✅ Prerequisites

Ensure the following are installed on your machine:

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.11+ | Backend FastAPI server |
| Node.js | 18+ | Web dashboard (Vite) & Mobile (Expo) |
| npm | 9+ | Package management |
| Expo CLI | Latest | Running the mobile app |
| Git | Any | Version control |

**Hardware:**
- Android/iOS physical device (for mobile app via Expo Go or dev client)
- PC and phone must be on the **same Wi-Fi network** for mobile ↔ backend communication

---

## ⚙️ Installation & Setup

### 1. Backend (FastAPI)

```bash
# Navigate to the backend folder
cd omnimed_backend

# Create a Python virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt
```

> ⚠️ **Important:** The `torch` and `sentence-transformers` packages are large (~2-3 GB). Installation may take several minutes depending on your internet speed.

---

### 2. Web Dashboard (React + Vite)

```bash
# Navigate to the web folder
cd omnimed-web

# Install Node dependencies
npm install
```

No further configuration needed — the Vite dev server proxies API calls to `localhost:8000` automatically.

---

### 3. Mobile App (React Native / Expo)

```bash
# Navigate to the mobile folder
cd omnimed-mobile

# Install Node dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g expo-cli
```

**Critical — Update the backend IP:**

Before running the mobile app, set your PC's local IP address (from the same Wi-Fi the phone is on) in **all** these files:

| File | Variable to Update |
|------|--------------------|
| `services/OfflineSync.ts` | `const BACKEND_URL = "http://<YOUR_PC_IP>:8000"` |
| `services/ModelRunner.ts` | `const BACKEND_URL = "http://<YOUR_PC_IP>:8000"` |
| `components/ToneScore.tsx` | `const BACKEND_URL = "http://<YOUR_PC_IP>:8000"` |
| `components/TrialBridge.tsx` | `const BACKEND_URL = "http://<YOUR_PC_IP>:8000"` |
| `app/district.tsx` | `const BACKEND_URL = "http://<YOUR_PC_IP>:8000"` |

**Find your PC's IP:**
```powershell
# Windows
ipconfig
# Look for "IPv4 Address" under your Wi-Fi adapter, e.g., 10.110.123.227

# Mac/Linux
ifconfig | grep "inet "
```

---

## 🚀 Running All Services

You need **3 separate terminals** running simultaneously:

### Terminal 1 — Backend (FastAPI + All AI Models)

```bash
cd omnimed_backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected startup output:**
```
⏳ Booting up TrialBridge NLP Semantic vectors...
✅ NLP Semantic Engine Online.
✅ PyTorch MobileNetV2 successfully injected into FastAPI Engine!
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Backend API is live at:** `http://localhost:8000`  
**Interactive API docs:** `http://localhost:8000/docs`  
**Web dashboard (prod build):** `http://localhost:8000/web/`

---

### Terminal 2 — Web Dashboard (Development Mode with Hot Reload)

```bash
cd omnimed-web
npm run dev
```

**Expected output:**
```
VITE v5.4.x  ready in 588 ms
➜  Local:   http://localhost:3000/web/
```

**Web Dashboard is live at:** `http://localhost:3000/web/`

> **Note:** In development, use port 3000 for hot-reload. For production via FastAPI, run `npm run build` inside `omnimed-web/` and restart the backend — it will then serve from `http://localhost:8000/web/`.

#### Building for Production

```bash
cd omnimed-web
npm run build
# The output goes to omnimed-web/dist/
# FastAPI automatically serves this at http://localhost:8000/web/
```

---

### Terminal 3 — Mobile App (Expo)

```bash
cd omnimed-mobile
npx expo start --dev-client -c
```

Scan the QR code in the Expo terminal with:
- **Android:** Expo Go app → Scan QR
- **iOS:** Camera app → Scan QR

---

## 🏙️ Starting the District Simulation

The **PopulationPulse** simulation script emulates 25 frontline health workers syncing patient data simultaneously from different villages and blocks. This populates the district dashboard with live, realistic data.

### Prerequisites
- Backend must be running on port 8000 before you start the simulation

### Steps

```bash
# In a NEW terminal (4th terminal):
cd omnimed_backend

# Activate the virtual environment
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Run the simulation
python simulate_district_nodes.py
```

### Expected Output

```
=========================================
[START] OmniMed Edge Node Crisis Simulator
=========================================
Simulating 25 frontline health workers actively syncing data from the field...
[Sync OK] Synced P-6489 from Village B | Tags: rash, chronic fatigue, cough
[Sync OK] Synced P-2938 from Village B | Tags: cough
[Sync OK] Synced P-9505 from Village A | Tags: cough, chronic fatigue
...
[Sync OK] Synced P-8385 from Sector 4  | Tags: rash, fever, anemia
=========================================
[DONE] Simulation complete — 25 patient records synced.
=========================================
```

After the script completes, open the **District Dashboard** in the mobile app or visit `http://localhost:8000/api/v1/population/dashboard` to see the aggregated health intelligence data update in real time.

---

## 📡 API Reference

All endpoints are available at `http://localhost:8000`. Interactive Swagger UI at `/docs`.

| Method | Endpoint | Module | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Health | Backend health check & version |
| `POST` | `/api/v1/voice/analyze_tone` | ToneScore | Analyze vocal transcript → urgency score |
| `POST` | `/api/v1/analyze_image` | Nidana Vision | Base64 skin image → CNN diagnosis |
| `POST` | `/api/v1/trials/match` | TrialBridge | Patient symptoms → matched clinical trials |
| `POST` | `/api/v1/security/audit` | SentinelIQ | EHR access log → anomaly detection |
| `POST` | `/api/v1/sync` | Sync Layer | Push offline patient record to cloud DB |
| `GET` | `/api/v1/population/dashboard` | PopulationPulse | District-level aggregated health data |
| `GET` | `/web/` | Web Dashboard | Serves the React web app |

### Example: ToneScore Request

```bash
curl -X POST http://localhost:8000/api/v1/voice/analyze_tone \
  -H "Content-Type: application/json" \
  -d '{"audio_base64": "", "transcribed_text": "severe chest pain, I cant breathe"}'
```

**Response:**
```json
{
  "analyzed_transcript": "severe chest pain, I cant breathe",
  "acoustic_urgency_score": 94.7,
  "detected_emotions": ["Distress", "Fear", "High Pain"],
  "triage_color": "RED",
  "recommendation": "CRITICAL: Immediate Nurse Dispatch Required!"
}
```

### Example: TrialBridge Request

```bash
curl -X POST http://localhost:8000/api/v1/trials/match \
  -H "Content-Type: application/json" \
  -d '{"medical_text": "severe iron deficiency anemia, hemoglobin 7.2 g/dL, extreme fatigue"}'
```

**Response:**
```json
{
  "analyzed_symptoms": "severe iron deficiency anemia...",
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

## 🌐 Network Configuration (Mobile)

The mobile app communicates with the FastAPI backend over your local Wi-Fi. **The IP address must be updated every time your network changes.**

### Quick Fix Script (Windows PowerShell)

If your IP changes, run this to update all files at once:

```powershell
$newIP = "YOUR_NEW_IP_HERE"  # e.g., 10.110.123.227
$files = @(
  "omnimed-mobile\services\OfflineSync.ts",
  "omnimed-mobile\services\ModelRunner.ts",
  "omnimed-mobile\components\ToneScore.tsx",
  "omnimed-mobile\components\TrialBridge.tsx",
  "omnimed-mobile\app\district.tsx"
)
foreach ($f in $files) {
  (Get-Content $f) -replace '10\.\d+\.\d+\.\d+', $newIP | Set-Content $f -Encoding UTF8
}
Write-Host "All IPs updated to $newIP"
```

---

## ⚠️ Known Issues & Notes

| Issue | Status | Workaround |
|-------|--------|------------|
| `InconsistentVersionWarning` for scikit-learn | Non-breaking | Models trained on v1.6.1, running on v1.8.0. Safe to ignore. |
| `X does not have valid feature names` warning | Non-breaking | SentinelIQ feature input format — safe to ignore. |
| Mobile connectivity after IP change | Expected | Re-run the IP update script above. |
| Vite backend proxy only in dev mode | By design | Use `npm run build` for production via FastAPI. |
| HuggingFace unauthenticated rate limit | Non-blocking | Set `HF_TOKEN` env var to increase limits. |

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend API | FastAPI | 0.135.3 |
| ASGI Server | Uvicorn | 0.44.0 |
| Database ORM | SQLAlchemy | 2.0.49 |
| Database | SQLite | Bundled |
| CV Model | PyTorch MobileNetV2 | torch 2.11.0 |
| NLP Model | SentenceTransformers (MiniLM) | 5.4.0 |
| Anomaly Detection | scikit-learn IsolationForest | 1.8.0 |
| Web Framework | React + Vite | 18.3.1 + 5.4.x |
| Mobile Framework | React Native (Expo) | Latest |
| Styling | Vanilla CSS (design tokens) | — |

---

## 👥 Team — StackOverChad

Built for the **Hacknation Shivalik Hackathon** by ACM Chapter.

> *"One Platform. Six Modules. Zero Internet Required."*

---

*© 2026 OmniMed. Hackathon Build. All rights reserved.*

# Setu-Drishti × OmniMed — Team StackOverChad

A unified AI-powered ICU Command Center and Clinical Intelligence Platform built by Team StackOverChad.

### Private Repo Notice
This repo is preconfigured so all team members can run it instantly. Internal configuration files, environments (.env), and package structures are explicitly tracked to reduce setup time. Pull the repo and run it immediately!

---

# Setu-Drishti 2.0 × OmniMed AI Suite

```
  ╔═══════════════════════════════════════════════════════════╗
  ║   SETU-DRISHTI 2.0  ×  OmniMed AI Suite                 ║
  ║   ICU Command Center · 6 AI Modules · Edge-First         ║
  ╚═══════════════════════════════════════════════════════════╝
```

**One Platform. Six AI Modules. Real-Time ICU Intelligence.**

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev)
[![React Native](https://img.shields.io/badge/React_Native-Expo-black?logo=expo)](https://expo.dev)

---

## 📁 Repository Structure

```
hacknation-2.0/
│
└── Setu-Drishti/                  ← ⭐ MAIN PROJECT FOLDER (everything is here)
    ├── setu_drishti_backend/      ← FastAPI backend + all AI models
    │   ├── main.py                ← App entry point
    │   ├── simulator.py           ← ICU patient data simulator
    │   ├── requirements.txt       ← Python dependencies
    │   └── routers/               ← All API route handlers
    │
    ├── setu_drishti_web/          ← React + Vite web dashboard
    │   ├── src/                   ← React source code
    │   └── package.json
    │
    └── SetuDrishtiApp/            ← React Native (Expo) mobile app
        ├── app/                   ← Expo Router screens
        ├── components/            ← Shared components
        ├── services/              ← API service layer
        └── package.json
```

> **Note:** All commands below must be run from inside the `Setu-Drishti/` folder.

---

## ✅ Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.11+ | Backend FastAPI server |
| Node.js | 18+ | Web dashboard (Vite) & Mobile (Expo) |
| npm | 9+ | Package management |
| Git | Any | Version control |

**Hardware:**
- Android/iOS physical device (for mobile app via Expo Go)
- PC and phone must be on the **same Wi-Fi network** for mobile ↔ backend communication

---

## ⚙️ First-Time Setup

### Step 1 — Navigate to the project

```bash
cd Setu-Drishti
```

> ⚠️ **All subsequent commands must be run from inside `Setu-Drishti/`**

### Step 2 — Set up the Python virtual environment (Backend)

```bash
cd setu_drishti_backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Go back to Setu-Drishti root
cd ..
```

### Step 3 — Install Web Dashboard dependencies

```bash
cd setu_drishti_web
npm install
cd ..
```

### Step 4 — Install Mobile App dependencies

```bash
cd SetuDrishtiApp
npm install
cd ..
```

---

## 🚀 Running the Full Stack (4 Terminals)

Start from the `Setu-Drishti/` folder in **4 separate terminals**.

---

### 🖥️ Terminal 1 — Backend API (FastAPI)

```bash
# From Setu-Drishti/
cd setu_drishti_backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

✅ **Backend live at:** `http://localhost:8000`  
✅ **API Docs at:** `http://localhost:8000/docs`

---

### 📡 Terminal 2 — ICU Patient Simulator

> **Important:** Start this AFTER the backend is running.

```bash
# From Setu-Drishti/
cd setu_drishti_backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

python simulator.py
```

This continuously feeds live patient vitals (HR, MAP, SpO₂, Lactate, etc.) into the backend. The web and mobile dashboards will display these in real time.

---

### 🌐 Terminal 3 — Web Dashboard (React + Vite)

```bash
# From Setu-Drishti/
cd setu_drishti_web
npm run dev
```

✅ **Web Dashboard live at:** `http://localhost:5173`

---

### 📱 Terminal 4 — Mobile App (Expo)

```bash
# From Setu-Drishti/
cd SetuDrishtiApp
npx expo start -c
```

Scan the QR code with the **Expo Go** app on your phone, or press:
- `a` → Android Emulator
- `i` → iOS Simulator

---

## 🌐 Network Configuration (Mobile ↔ Backend)

The mobile app needs your PC's local IP address to talk to the backend over Wi-Fi.

**Find your IP:**
```powershell
# Windows
ipconfig
# Look for "IPv4 Address" under your Wi-Fi adapter
```

**Quick IP update script (PowerShell — run from `Setu-Drishti/`):**
```powershell
$newIP = "YOUR_NEW_IP_HERE"   # e.g., 10.216.18.227
$files = @(
    "SetuDrishtiApp\app\(tabs)\index.tsx",
    "SetuDrishtiApp\app\(tabs)\ar-lens.tsx",
    "SetuDrishtiApp\app\omnimed-district.tsx",
    "SetuDrishtiApp\services\ModelRunner.ts",
    "SetuDrishtiApp\components\ToneScore.tsx",
    "SetuDrishtiApp\components\TrialBridge.tsx"
)
foreach ($f in $files) {
    (Get-Content $f) -replace '10\.\d+\.\d+\.\d+', $newIP | Set-Content $f -Encoding UTF8
}
Write-Host "All IPs updated to $newIP"
```

---

## ☁️ Cloud Deployment (Live URLs)

| Service | Platform | URL |
|---------|----------|-----|
| Backend API | Render | https://setu-drishti.onrender.com |
| Web Dashboard | Vercel | *(your Vercel URL)* |

> **Free-tier note:** The Render backend sleeps after 15 min of inactivity. Open the Vercel site ~1 minute before presenting to wake it up.

---

## 📡 API Reference

All endpoints available at `http://localhost:8000`. Swagger UI at `/docs`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/` | Health check |
| `POST` | `/api/v1/predict` | ICU patient risk prediction |
| `POST` | `/api/v1/voice/analyze_tone` | ToneScore voice triage |
| `POST` | `/api/v1/analyze_image` | Nidana Vision skin scan |
| `POST` | `/api/v1/trials/match` | TrialBridge clinical trial matching |
| `POST` | `/api/v1/security/audit` | SentinelIQ anomaly detection |
| `GET`  | `/api/v1/population/dashboard` | District health pulse |
| `POST` | `/api/v1/sync` | Offline patient sync |

---

## ⚠️ Known Issues & Notes

| Issue | Status | Workaround |
|-------|--------|------------|
| `InconsistentVersionWarning` for scikit-learn | Non-breaking | Safe to ignore |
| Mobile connectivity after IP change | Expected | Re-run the IP update script above |
| Render backend cold start (~30s) | Free-tier limitation | Open site 1 min before demo |

---

## 👥 Team — StackOverChad

Built by **Team StackOverChad**.

> *"One Platform. Six Modules. Real-Time ICU Intelligence."*

---

*© 2026 Setu-Drishti × OmniMed. All rights reserved.*

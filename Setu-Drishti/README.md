# Setu-Drishti Module

Part of the Setu-Drishti x OmniMed Hacknation 2.0 Repository.

### Private Repo Notice
This repo is preconfigured so all team members can run it instantly. Internal configuration files, environments (.env), and package structures are explicitly tracked to reduce setup time. Pull the repo and run it immediately!

# Setu-Drishti 2.0 × OmniMed AI Suite

**Setu-Drishti 2.0** is an advanced, fully-integrated ICU Command Center and AI-driven Clinical OS. It combines real-time patient telemetry monitoring (Setu-Drishti) with a cutting-edge suite of 6 artificial intelligence models (OmniMed) to assist medical personnel in triage, diagnosis, and workflow optimization.

This repository contains the unified source code tailored specifically for the hackathon environment.

---

## 🌟 Key Features

### 1. ICU Command Dashboard (Setu-Drishti)
- **Live Digital Twin:** Real-time visualization of ICU wards across multiple beds.
- **Combined Risk Scoring:** Live algorithms synthesizing HR, MAP, SpO2, and XGBoost clinical scores.
- **Actionable Alerts:** Dynamic prioritization of critical patients with visual & auditory cues.
- **Automated Sepsis Supply Chain Trigger:** Real-time logistics integration that auto-queries the Pharmacy DB when a patient enters Sepsis protocol, securing needed antibiotics prior to doctor intervention.
- **Dynamic UX Toggling:** Instantly switch between high-contrast "Dark Mode" and clinical "Light Mode" interfaces globally across both Mobile and Web views.
- **Multi-Modal GenAI Auto-Briefing:** Instantly swallows 8 hours of live patient vitals and predictive ML flags to dynamically generate a coherent medical shift handoff narrative via Google Gemini automatically on the dashboard.
- **AR Lens Bed Scanner:** Mobile-first augmented reality camera matrix. Doctors scan physical bed QR codes to spawn live floating holographic readouts of patient HR, MAP, and ML Risk assessments.
- **Family-Link GenAI Translator:** Converts raw ICU clinical telemetry into comforting, jargon-free patient status updates simultaneously in English, Hindi, and Punjabi (ਪੰਜਾਬੀ) — breaking language barriers for diverse families in the hospital lobby.

### 2. OmniMed AI Subsystems
- **SentinelIQ:** Anomaly detection on patient vitals using advanced XGBoost models.
- **Nidana Vision:** Browser/Mobile-based CNN scanner for dermatological clustering and lesion diagnosis.
- **PulseWatch:** Real-time anomaly drift visualization powered by IoT simulation.
- **ToneScore Voice AI:** NLP-based acoustic urgency analysis of patient distress calls.
- **TrialBridge:** Semantic similarity matching (Sentence Transformers) to dynamically link patient symptoms to experimental treatments.
- **District Pulse:** Geospatial clustering of symptom outbreaks using KD-Tree mapping.

---

## 🏗️ Project Architecture

This is a unified monolithic infrastructure consisting of three core parts:

1. **`setu_drishti_backend`:** The single Brain of the operation. A FastAPI server running on `port 8000`. It processes all ICU telemetry, mounts every ML model, stores the SQLite datasets, and serves the OmniMed inference endpoints.
2. **`frontend`:** The React & Vite web application. It houses the primary ICU Ward view, and incorporates the OmniMed AI Suite as an advanced subsystem embedded directly into the React Router.
3. **`SetuDrishtiApp`:** The Expo & React Native mobile application for on-the-go doctors and nurses, fully featuring tabs for both the core ICU command list and the OmniMed role-based portals.

---

## 🚀 Setup & Execution Guide

To run the unified stack locally for the presentation, open **FOUR** separate terminal windows and run the following commands. Ensure you have activated your Python virtual environment where required.

### Terminal 1: Real-Time ICU Data Simulator
This feeds live telemetry into the backend.
```bash
cd setu_drishti_backend
python simulator.py
```

### Terminal 2: The Unified AI Backend
This hosts the Setu-Drishti router and the OmniMed inference logic.
```bash
cd setu_drishti_backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*(Backend runs on http://127.0.0.1:8000)*

### Terminal 3: The Web Dashboard
The main command center GUI.
```bash
cd frontend
npm install   # Only required the first time
npm run dev
```
*(Web UI runs on http://localhost:5173)*

### Terminal 4: The Mobile Command Center
The companion app for medical staff.
```bash
cd SetuDrishtiApp
npm install   # Only required the first time
npx expo start
```
*(Use the Expo Go app on your phone, or press 'a' for Android Emulator. Note: Native Voice features will simulate over Expo Go).*

---

## 🔒 Configuration & Private Keys
Because this repository is configured for a private hackathon submission, `.env` files and `package.json` configurations are explicitly compiled into the repository (un-ignored) so your teammates do not have to configure secrets or dependencies from scratch! 

Just clone, install, and run.

---
*Built with ❤️ for Hacknation Shivalik Hackathon.*

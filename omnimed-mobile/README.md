# omnimed-mobile Module

Part of the Setu-Drishti x OmniMed Hacknation 2.0 Repository.

### Private Repo Notice
This repo is preconfigured so all team members can run it instantly. Internal configuration files, environments (.env), and package structures are explicitly tracked to reduce setup time. Pull the repo and run it immediately!

# OmniMed Mobile — React Native (Expo)

The offline-first mobile application for frontline health workers. Built with React Native and Expo, it runs all AI models on-device and syncs data opportunistically when connectivity is available.

---

## Key Features

- ✅ 100% offline capable — all AI models run on-device
- ✅ Opportunistic sync — pushes compressed JSON when Wi-Fi/4G is available
- ✅ Voice-based triage via ToneScore (emotional urgency scoring)
- ✅ Camera-based skin analysis via Nidana Vision (MobileNetV2 CNN)
- ✅ Clinical trial matching via TrialBridge (SentenceBERT NLP)
- ✅ EHR security audit via SentinelIQ (Isolation Forest ML)
- ✅ District health intelligence via PopulationPulse

---

## Project Structure

```
omnimed-mobile/
├── app/
│   ├── index.tsx          ← Splash / Landing screen
│   ├── dashboard.tsx      ← Main clinical dashboard
│   ├── triage.tsx         ← ToneScore voice triage screen
│   ├── nidana.tsx         ← Nidana Vision camera screen
│   ├── trialbridge.tsx    ← TrialBridge patient matching
│   ├── sentineliq.tsx     ← SentinelIQ EHR audit
│   └── district.tsx       ← PopulationPulse district map
├── components/
│   ├── ToneScore.tsx      ← Reusable voice urgency component
│   └── TrialBridge.tsx    ← Reusable trial matching component
├── services/
│   ├── OfflineSync.ts     ← ⚠️ Contains BACKEND_URL — update IP here
│   └── ModelRunner.ts     ← ⚠️ Contains BACKEND_URL — update IP here
└── package.json
```

---

## Setup

```bash
cd omnimed-mobile

# Install dependencies
npm install

# Install Expo CLI globally (first time only)
npm install -g expo-cli
```

---

## ⚠️ Critical: Set the Backend IP

The mobile app communicates with the FastAPI backend over your local Wi-Fi. You **must** set the correct IP address before running.

### Find Your PC's IP

```powershell
# Windows
ipconfig
# Look for "IPv4 Address" under your active Wi-Fi adapter
# Example: 10.110.123.227
```

### Update All Backend URLs

Search for and replace the IP in **all 5 files** below:

| File | Line |
|------|------|
| `services/OfflineSync.ts` | `const BACKEND_URL = "http://<IP>:8000"` |
| `services/ModelRunner.ts` | `const BACKEND_URL = "http://<IP>:8000"` |
| `components/ToneScore.tsx` | `const BACKEND_URL = "http://<IP>:8000"` |
| `components/TrialBridge.tsx` | `const BACKEND_URL = "http://<IP>:8000"` |
| `app/district.tsx` | `const BACKEND_URL = "http://<IP>:8000"` |

### One-Command Fix (PowerShell)

```powershell
$newIP = "10.110.123.227"  # ← replace with your actual IP
$files = @(
  "services\OfflineSync.ts",
  "services\ModelRunner.ts",
  "components\ToneScore.tsx",
  "components\TrialBridge.tsx",
  "app\district.tsx"
)
foreach ($f in $files) {
  (Get-Content $f) -replace '10\.\d+\.\d+\.\d+', $newIP | Set-Content $f -Encoding UTF8
}
Write-Host "All BACKEND_URLs updated to $newIP"
```

---

## Running the App

```bash
npx expo start --dev-client -c
```

**Flags explained:**
- `--dev-client` — uses the Expo Dev Client (required for native modules)
- `-c` — clears Metro bundler cache (recommended after IP changes)

### On your phone:
- **Android:** Open Expo Go → Scan QR code from terminal
- **iOS:** Open Camera → Scan QR code from terminal

Phone and PC **must be on the same Wi-Fi network**.

---

## After IP Change

If your Wi-Fi changes or your PC gets a new IP:

1. Run the PowerShell fix above with the new IP
2. Restart the Expo dev server: `npx expo start --dev-client -c`
3. Press `r` in the Expo terminal to force a full reload

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| "Network Request Failed" | Phone and PC are not on same Wi-Fi, or IP is wrong |
| "Expo Go crashed" | Try `--dev-client` instead of regular Expo Go |
| Screen shows old data | Press `r` in Expo terminal to reload |
| Backend 404 errors | Ensure backend is running: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload` |
| Metro bundler errors | Add `-c` flag to clear cache |

# omnimed-web Module

Part of the Setu-Drishti x OmniMed Hacknation 2.0 Repository.

### Private Repo Notice
This repo is preconfigured so all team members can run it instantly. Internal configuration files, environments (.env), and package structures are explicitly tracked to reduce setup time. Pull the repo and run it immediately!

# OmniMed Web Dashboard — React + Vite

The web-based clinical intelligence dashboard for OmniMed. Built with React 18 and Vite 5, it provides a full-featured browser interface for all six AI modules.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 5.4.x | Dev server + bundler |
| @vitejs/plugin-react | 4.3.x | JSX transform + HMR |
| Vanilla CSS | — | Design system (no framework) |
| Fetch API | Native | Backend API communication |

---

## Project Structure

```
omnimed-web/
├── index.html                 ← HTML entry point (Vite)
├── vite.config.js             ← Vite config (base: /web/, dev proxy to :8000)
├── package.json               ← Node dependencies
├── styles/
│   └── main.css               ← Original CSS (backup reference)
└── src/
    ├── main.jsx               ← React root — mounts App, imports CSS
    ├── App.jsx                ← Root component: view routing, state management
    ├── styles/
    │   └── main.css           ← Design system (tokens, dark/light themes, all components)
    ├── services/
    │   └── api.js             ← All fetch() calls to FastAPI backend
    ├── hooks/
    │   └── useApp.js          ← Custom React hooks:
    │                              useTheme, useBackendStatus,
    │                              useCurrentTime, useAuditLog, useToast
    ├── components/
    │   ├── Landing.jsx        ← Landing page (hero, module cards, architecture strip)
    │   ├── Sidebar.jsx        ← Navigation sidebar + backend status indicator
    │   ├── Toast.jsx          ← Toast notification system
    │   └── Loader.jsx         ← Full-screen loading overlay
    └── modules/
        ├── Dashboard.jsx      ← Patient stats, patient list, live audit log
        ├── Triage.jsx         ← ToneScore: symptom input + animated urgency gauge
        ├── Nidana.jsx         ← Nidana Vision: drag-and-drop image + CNN results
        ├── TrialBridge.jsx    ← Clinical trial semantic matching + results cards
        ├── SentinelIQ.jsx     ← EHR audit: sliders + isolation forest result
        └── Sync.jsx           ← Offline patient record sync
```

---

## Setup

```bash
cd omnimed-web
npm install
```

---

## Running (Development)

```bash
npm run dev
```

Opens at: **`http://localhost:3000/web/`**

- Hot Module Replacement (HMR) enabled — changes reflect instantly
- API calls are proxied to `http://localhost:8000` automatically (configured in `vite.config.js`)
- **Backend must be running** at port 8000 for AI modules to function

---

## Building for Production

```bash
npm run build
```

Outputs to `omnimed-web/dist/`. The FastAPI backend automatically detects and serves this folder at `http://localhost:8000/web/`.

```bash
npm run preview   # Preview the production build locally
```

---

## Environment Notes

- **Development:** Use `http://localhost:3000/web/` (Vite dev server)
- **Production:** Run `npm run build`, then access `http://localhost:8000/web/` (served by FastAPI)
- The Vite `base: '/web/'` config ensures asset paths resolve correctly under the FastAPI mount point

---

## Theming

The app supports full **dark/light mode** switching:
- Default: Dark theme
- Toggle: Click the ☀/☾ button in sidebar footer or topbar
- Preference persists via `localStorage` across sessions
- CSS custom properties (variables) power all theme tokens — no JS theme injection

---

## Backend API Endpoints Used

| Module | Endpoint | Method |
|--------|----------|--------|
| Backend status | `/` | GET |
| ToneScore Triage | `/api/v1/voice/analyze_tone` | POST |
| Nidana Vision | `/api/v1/analyze_image` | POST |
| TrialBridge | `/api/v1/trials/match` | POST |
| SentinelIQ | `/api/v1/security/audit` | POST |
| Patient Sync | `/api/v1/sync` | POST |

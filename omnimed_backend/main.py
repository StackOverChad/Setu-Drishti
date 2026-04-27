import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from routers import sync_layer, trial_bridge, security, disease_classifier, voice_triage, population_pulse

app = FastAPI(title="OmniMed Edge AI Engine")

# Allow requests from both the web frontend and the mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register all API routers ──────────────────────────────────────────────────
app.include_router(sync_layer.router)
app.include_router(trial_bridge.router)
app.include_router(security.router)
app.include_router(disease_classifier.router)
app.include_router(voice_triage.router)
app.include_router(population_pulse.router)

# ── Serve the OmniMed React Web Dashboard (Vite build) ───────────────────────
# In production: run `npm run build` inside omnimed-web/ first, then restart.
# In development: use the Vite dev server at http://localhost:3000/web/ directly.
WEB_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "omnimed-web", "dist"))

if os.path.isdir(WEB_DIST):
    # /web (no slash) → redirect to /web/ so Vite base-path assets resolve
    @app.get("/web", include_in_schema=False)
    def redirect_web():
        return RedirectResponse(url="/web/", status_code=301)

    # /web/ → serve the Vite-built React index.html
    @app.get("/web/", include_in_schema=False)
    def serve_web_dashboard():
        return FileResponse(os.path.join(WEB_DIST, "index.html"))

    # Mount the Vite dist folder (contains assets/ with hashed JS/CSS bundles)
    app.mount("/web", StaticFiles(directory=WEB_DIST, html=True), name="web")

# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {
        "system": "OmniMed Cloud Analytics API",
        "status": "Online",
        "web_dashboard": "http://localhost:8000/web/"
    }

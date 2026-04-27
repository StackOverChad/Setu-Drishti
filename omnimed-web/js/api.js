/* ══════════════════════════════════════════════════════════════
   OmniMed API Client — FastAPI backend at localhost:8000
   + shared UI utilities: loader, toast, audit log
══════════════════════════════════════════════════════════════ */

const API_BASE = 'http://localhost:8000';

const OmniAPI = {
  async healthCheck() {
    const res = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('Backend unreachable');
    return res.json();
  },

  async analyzeImage(base64String) {
    const res = await fetch(`${API_BASE}/api/v1/analyze_image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: base64String })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `Server error ${res.status}`); }
    return res.json();
  },

  async analyzeTone(transcribed_text, audio_base64 = '') {
    const res = await fetch(`${API_BASE}/api/v1/voice/analyze_tone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_base64, transcribed_text })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `Server error ${res.status}`); }
    return res.json();
  },

  async matchTrials(medical_text) {
    const res = await fetch(`${API_BASE}/api/v1/trials/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medical_text })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `Server error ${res.status}`); }
    return res.json();
  },

  async auditEHR(provider_role, access_hour, billing_coherence_score) {
    const res = await fetch(`${API_BASE}/api/v1/security/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_role, access_hour, billing_coherence_score })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `Server error ${res.status}`); }
    return res.json();
  },

  async syncPatient(patient_id, clinical_notes, vitals_drift_score) {
    const res = await fetch(`${API_BASE}/api/v1/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id, clinical_notes, vitals_drift_score })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `Server error ${res.status}`); }
    return res.json();
  }
};

/* ── LOADER ── */
function showLoader(text = 'Processing…') {
  document.getElementById('loaderText').textContent = text;
  document.getElementById('globalLoader').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('globalLoader').style.display = 'none';
}

/* ── TOAST ── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = { success: '✓', error: '✕', info: 'ℹ' };

  toast.innerHTML = `
    <div class="toast-icon" aria-hidden="true">${iconMap[type] || 'ℹ'}</div>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  // Auto dismiss
  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 4000);
}

/* ── AUDIT LOG ── */
function addToAuditLog(text, color = 'cyan') {
  const log = document.getElementById('auditLog');
  if (!log) return;

  const now  = new Date();
  const time = now.toTimeString().slice(0, 8);

  const entry = document.createElement('div');
  entry.className  = 'audit-entry';
  entry.setAttribute('role', 'listitem');
  entry.innerHTML = `
    <div class="audit-dot dot-${color}" aria-hidden="true"></div>
    <span class="audit-txt">${text}</span>
    <span class="audit-time" aria-label="at ${time}">${time}</span>
  `;

  log.insertBefore(entry, log.firstChild);

  // Keep max 25 entries
  while (log.children.length > 25) log.removeChild(log.lastChild);
}

/* ── FILE → BASE64 ── */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

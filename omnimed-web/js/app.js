/* ══════════════════════════════════════════════════════════════
   OmniMed App — Router, Theme, Clock, Backend Health
══════════════════════════════════════════════════════════════ */

// ── THEME ──────────────────────────────────────────────
const THEME_KEY = 'omnimed-theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// ── LANDING ──────────────────────────────────────────────

function enterApp() {
  const landing = document.getElementById('landing');
  const shell   = document.getElementById('appShell');

  landing.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  landing.style.opacity    = '0';
  landing.style.transform  = 'scale(0.98)';

  setTimeout(() => {
    landing.style.display = 'none';
    shell.style.display   = 'flex';
    shell.style.opacity   = '0';
    shell.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => { shell.style.opacity = '1'; });
    checkBackendStatus();
    renderDashboard();
    addToAuditLog('Platform loaded — OmniMed AI OS v1.0', 'cyan');
  }, 380);
}

function exitToLanding() {
  const landing = document.getElementById('landing');
  const shell   = document.getElementById('appShell');

  shell.style.transition = 'opacity 0.3s ease';
  shell.style.opacity    = '0';

  setTimeout(() => {
    shell.style.display   = 'none';
    landing.style.display = 'block';
    landing.style.opacity = '1';
    landing.style.transform = 'scale(1)';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}

function smoothScroll(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── NAVIGATION ──────────────────────────────────────────────

const PAGE_TITLES = {
  dashboard:    'Clinical Dashboard',
  triage:       'ToneScore Triage',
  nidana:       'Nidana Vision+',
  trialbridge:  'TrialBridge',
  sentineliq:   'SentinelIQ',
  sync:         'Patient Sync',
};

function navigate(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    n.removeAttribute('aria-current');
  });

  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  if (el) {
    el.classList.add('active');
    el.setAttribute('aria-current', 'page');
  }

  const title = PAGE_TITLES[page] || page;
  const topbarTitle = document.getElementById('topbarTitle');
  const topbarBC    = document.getElementById('topbarBreadcrumb');
  if (topbarTitle) topbarTitle.textContent = title;
  if (topbarBC)    topbarBC.textContent     = title;

  addToAuditLog(`Navigated to ${title}`, 'cyan');
}

// ── REALTIME CLOCK ──────────────────────────────────────────────

function updateClock() {
  const el = document.getElementById('currentTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// ── BACKEND STATUS ──────────────────────────────────────────────

async function checkBackendStatus() {
  const dot     = document.getElementById('statusDot');
  const text    = document.getElementById('statusText');
  const retry   = document.getElementById('retryBtn');
  const modList = document.getElementById('moduleHealthList');

  try {
    await OmniAPI.healthCheck();

    if (dot)   { dot.className   = 'status-dot online'; }
    if (text)  { text.textContent = 'Backend Online'; }
    if (retry) { retry.style.display = 'none'; }

    const modules = [
      { name: 'ToneScore Triage',  status: 'online' },
      { name: 'Nidana Vision+',    status: 'online' },
      { name: 'TrialBridge NLP',   status: 'online' },
      { name: 'SentinelIQ ML',     status: 'loading' },
      { name: 'Patient Sync',      status: 'online' },
    ];

    if (modList) {
      modList.innerHTML = modules.map(m => `
        <div class="module-health-row">
          <span class="module-health-name">${m.name}</span>
          <span class="health-chip health-${m.status}">${m.status}</span>
        </div>
      `).join('');
    }

    addToAuditLog('Backend health check: all systems nominal', 'green');

  } catch {
    if (dot)   { dot.className   = 'status-dot offline'; }
    if (text)  { text.textContent = 'Backend Offline'; }
    if (retry) { retry.style.display = 'inline'; }

    const modules = ['ToneScore', 'Nidana', 'TrialBridge', 'SentinelIQ', 'Sync'];
    if (modList) {
      modList.innerHTML = modules.map(m => `
        <div class="module-health-row">
          <span class="module-health-name">${m}</span>
          <span class="health-chip health-offline">offline</span>
        </div>
      `).join('');
    }

    showToast('Backend is offline — start FastAPI at localhost:8000', 'error');
    addToAuditLog('Backend offline — run: uvicorn main:app --reload', 'red');
  }
}

// ── SLIDER SYNC ──────────────────────────────────────────────

function syncHourInput(val) {
  val = parseInt(val);
  const hourIn    = document.getElementById('accessHour');
  const hourRange = document.getElementById('accessHourRange');
  const hourPrev  = document.getElementById('hourPreview');
  if (hourIn)    hourIn.value    = val;
  if (hourRange) hourRange.value = val;
  if (hourPrev) {
    const ampm = val < 12 ? 'AM' : 'PM';
    const h12  = val % 12 || 12;
    hourPrev.textContent = `${h12}:00 ${ampm}`;
  }
}

function syncBillingInput(val) {
  val = parseFloat(val);
  const bilIn    = document.getElementById('billingScore');
  const bilRange = document.getElementById('billingScoreRange');
  const bilPrev  = document.getElementById('billingPreview');
  if (bilIn)    bilIn.value    = val.toFixed(2);
  if (bilRange) bilRange.value = val;
  if (bilPrev)  bilPrev.textContent = `${Math.round(val * 100)}%`;
}

function syncDriftInput(val) {
  val = parseFloat(val);
  const drIn    = document.getElementById('vitalsDrift');
  const drRange = document.getElementById('vitalsDriftRange');
  const drPrev  = document.getElementById('driftPreview');
  if (drIn)    drIn.value    = val.toFixed(1);
  if (drRange) drRange.value = val;
  if (drPrev)  drPrev.textContent = val <= 3 ? 'Low Risk' : val <= 6 ? 'Moderate' : 'High Risk';
}

// ── INIT ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme immediately
  applyTheme(getTheme());

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Backend poll every 30s (only fires when app shell is visible)
  setInterval(() => {
    if (document.getElementById('appShell').style.display !== 'none') {
      checkBackendStatus();
    }
  }, 30000);

  // Initialize slider displays
  syncHourInput(14);
  syncBillingInput(0.85);
  syncDriftInput(2.5);

  // Two-way slider ↔ input binding
  const bindings = [
    { input: 'accessHour',    fn: syncHourInput },
    { input: 'billingScore',  fn: syncBillingInput },
    { input: 'vitalsDrift',   fn: syncDriftInput },
  ];

  bindings.forEach(({ input, fn }) => {
    const el = document.getElementById(input);
    if (el) el.addEventListener('input', e => fn(e.target.value));
  });

  // Seed audit log with initial entries (shown after app enters)
  // Actual audit log population happens in enterApp()
});

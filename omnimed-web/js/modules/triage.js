/* Triage Module — ToneScore API */

function setTriagePhrase(text) {
  document.getElementById('triageText').value = text;
  document.getElementById('triageText').focus();
}

async function runTriage() {
  const text = document.getElementById('triageText').value.trim();
  const pid  = document.getElementById('triagePatientId').value.trim() || 'UNKNOWN';

  if (!text) { showToast('Please enter patient symptoms or voice transcript', 'error'); return; }

  const btn = document.getElementById('triageBtn');
  btn.disabled = true;
  showLoader('Running ToneScore AI analysis…');
  addToAuditLog(`ToneScore analysis initiated for ${pid}`, 'cyan');

  try {
    const data = await OmniAPI.analyzeTone(text);
    renderTriageResult(data, pid);
    addToAuditLog(
      `Triage complete — ${data.triage_color} [${data.acoustic_urgency_score.toFixed(0)}%] · ${pid}`,
      data.triage_color === 'RED' ? 'red' : data.triage_color === 'YELLOW' ? 'amber' : 'green'
    );
    showToast(
      `Triage result: ${data.triage_color} priority — ${data.recommendation}`,
      data.triage_color === 'RED' ? 'error' : data.triage_color === 'YELLOW' ? 'info' : 'success'
    );
  } catch (err) {
    showToast(`Triage failed: ${err.message}`, 'error');
    addToAuditLog(`ToneScore error: ${err.message}`, 'red');
  } finally {
    hideLoader();
    btn.disabled = false;
  }
}

function renderTriageResult(data, pid) {
  const resultEl = document.getElementById('triageResult');
  const emptyEl  = document.getElementById('triageEmpty');

  resultEl.style.display = 'block';
  emptyEl.style.display  = 'none';

  // Badge
  const badge = document.getElementById('triageColorBadge');
  badge.textContent  = data.triage_color;
  badge.className    = `result-badge badge-${data.triage_color}`;

  // Gauge animation
  const score    = Math.min(Math.max(data.acoustic_urgency_score, 0), 100);
  const fill     = document.getElementById('gaugeFill');
  const valText  = document.getElementById('gaugeValue');

  // Full arc dasharray = 267 (semicircle arc of radius 85)
  const offset   = 267 - (score / 100) * 267;

  valText.textContent = `${score.toFixed(0)}%`;

  const gaugeColor = data.triage_color === 'RED'    ? '#ef4444' :
                     data.triage_color === 'YELLOW'  ? '#f59e0b' : '#22c55e';

  valText.style.fill = gaugeColor;

  requestAnimationFrame(() => {
    fill.style.strokeDashoffset = offset;
    fill.style.stroke           = gaugeColor;
  });

  // Emotions
  const emotEl = document.getElementById('triageEmotions');
  emotEl.innerHTML = (data.detected_emotions || []).map(e =>
    `<span class="emotion-chip" role="listitem">${e}</span>`
  ).join('');

  // Recommendation
  const recBox  = document.getElementById('triageRecommendation');
  const recText = document.getElementById('triageRecommText');
  recText.textContent = data.recommendation;
  recBox.className = `recommendation-box ${
    data.triage_color === 'RED'    ? 'rec-red'   :
    data.triage_color === 'YELLOW' ? 'rec-amber' : 'rec-green'
  }`;
}

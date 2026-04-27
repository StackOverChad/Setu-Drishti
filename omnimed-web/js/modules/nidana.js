/* Nidana Vision+ Module — Skin Lesion CNN */

let selectedImageBase64 = null;

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.add('drag-over');
}

function handleDragLeave() {
  document.getElementById('dropZone').classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    loadImageFile(file);
  } else {
    showToast('Please drop a valid image file (PNG, JPG, WEBP)', 'error');
  }
}

function handleImageSelect(e) {
  const file = e.target.files[0];
  if (file) loadImageFile(file);
}

async function loadImageFile(file) {
  try {
    selectedImageBase64 = await fileToBase64(file);

    const preview    = document.getElementById('previewImg');
    const dropContent = document.getElementById('dropContent');

    preview.src          = `data:${file.type};base64,${selectedImageBase64}`;
    preview.style.display = 'block';
    dropContent.style.display = 'none';

    const btn = document.getElementById('nidanaBtn');
    btn.disabled          = false;
    btn.removeAttribute('aria-disabled');

    // Reset results to empty state
    document.getElementById('nidanaResult').style.display = 'none';
    document.getElementById('nidanaEmpty').style.display  = 'flex';

    addToAuditLog(`Image loaded: ${file.name} (${(file.size/1024).toFixed(1)} KB)`, 'cyan');
    showToast('Image ready. Click Analyze Lesion to run AI.', 'info');
  } catch {
    showToast('Failed to load image file', 'error');
  }
}

async function runNidana() {
  if (!selectedImageBase64) { showToast('Please select a skin image first', 'error'); return; }

  const btn = document.getElementById('nidanaBtn');
  btn.disabled = true;
  showLoader('Running MobileNetV2 CNN inference…');
  addToAuditLog('Nidana Vision+ analysis started', 'cyan');

  try {
    const data = await OmniAPI.analyzeImage(selectedImageBase64);
    renderNidanaResult(data);
    addToAuditLog(
      `Nidana result: ${data.diagnosis} · ${data.urgency_level} · ${(data.confidence_score*100).toFixed(1)}% confidence`,
      data.urgency_level === 'HIGH' ? 'red' : data.urgency_level === 'MEDIUM' ? 'amber' : 'green'
    );
    showToast(`Analysis: ${data.diagnosis} (${data.urgency_level})`, data.urgency_level === 'HIGH' ? 'error' : 'success');
  } catch (err) {
    showToast(`Analysis failed: ${err.message}`, 'error');
    addToAuditLog(`Nidana error: ${err.message}`, 'red');
  } finally {
    hideLoader();
    btn.disabled = false;
  }
}

function renderNidanaResult(data) {
  document.getElementById('nidanaResult').style.display = 'block';
  document.getElementById('nidanaEmpty').style.display  = 'none';

  // Urgency badge
  const urgBadge = document.getElementById('nidanaUrgencyBadge');
  urgBadge.textContent = data.urgency_level;
  urgBadge.className   = `result-badge badge-${data.urgency_level}`;

  const isSuspicious = data.confidence_score > 0.5;

  // Diagnosis icon
  const iconEl = document.getElementById('diagnosisIcon');
  iconEl.className = `diagnosis-icon-wrap ${isSuspicious ? 'icon-suspicious' : 'icon-benign'}`;
  iconEl.innerHTML = isSuspicious
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:28px;height:28px"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:28px;height:28px"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  document.getElementById('diagnosisLabel').textContent = data.diagnosis;
  document.getElementById('diagnosisDetail').textContent = isSuspicious
    ? 'Potential malignant features detected — please refer to a dermatologist'
    : 'No significant malignant features at this confidence threshold';

  // Confidence bar
  const pct = Math.round(data.confidence_score * 100);
  document.getElementById('confidenceValue').textContent = `${pct}%`;

  const barEl = document.getElementById('confidenceBarFill');
  const barWrap = document.getElementById('confidenceBar');
  barWrap.setAttribute('aria-valuenow', pct);

  const barColor = data.urgency_level === 'HIGH'   ? 'linear-gradient(90deg, #ef4444, #f87171)' :
                   data.urgency_level === 'MEDIUM'  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                   'linear-gradient(90deg, #14b8a6, #22c55e)';

  requestAnimationFrame(() => {
    barEl.style.width      = `${pct}%`;
    barEl.style.background = barColor;
  });
}

/* Patient Sync Module */

async function runSync() {
  const patientId = document.getElementById('syncPatientId').value.trim();
  const notes     = document.getElementById('syncNotes').value.trim();
  const drift     = parseFloat(document.getElementById('vitalsDrift').value);

  if (!patientId) { showToast('Please enter a Patient ID', 'error'); return; }
  if (!notes)     { showToast('Please enter clinical notes', 'error'); return; }
  if (isNaN(drift)) { showToast('Please enter a valid vitals drift score', 'error'); return; }

  const btn = document.getElementById('syncBtn');
  btn.disabled = true;
  showLoader('Syncing patient data to cloud database…');
  addToAuditLog(`Sync initiated for patient ${patientId}`, 'cyan');

  try {
    const data = await OmniAPI.syncPatient(patientId, notes, drift);
    renderSyncResult(data, patientId, drift);
    addToAuditLog(`Sync success: ${patientId} — ${data.bytes_processed} bytes pushed`, 'green');
    showToast(`Patient ${patientId} successfully synced to cloud`, 'success');
  } catch (err) {
    showToast(`Sync failed: ${err.message}`, 'error');
    addToAuditLog(`Sync error for ${patientId}: ${err.message}`, 'red');
  } finally {
    hideLoader();
    btn.disabled = false;
  }
}

function renderSyncResult(data, patientId, drift) {
  document.getElementById('syncResult').style.display = 'block';
  document.getElementById('syncEmpty').style.display  = 'none';

  const driftLabel = drift <= 3 ? 'Low Risk' : drift <= 6 ? 'Moderate' : 'High Risk';
  const now        = new Date();

  document.getElementById('syncMeta').innerHTML = [
    { k: 'Status',         v: data.status.toUpperCase() },
    { k: 'Patient ID',     v: patientId },
    { k: 'Bytes Synced',   v: `${data.bytes_processed.toLocaleString()} bytes` },
    { k: 'Vitals Drift',   v: `${drift.toFixed(1)} — ${driftLabel}` },
    { k: 'Timestamp',      v: now.toISOString().replace('T',' ').slice(0,19) + ' UTC' },
    { k: 'Server Message', v: data.message },
  ].map(r => `
    <div class="data-row" role="row">
      <span class="data-key" role="rowheader">${r.k}</span>
      <span class="data-val" role="cell"
            style="${r.k==='Status'?'color:var(--color-success)':''}">${r.v}</span>
    </div>
  `).join('');
}

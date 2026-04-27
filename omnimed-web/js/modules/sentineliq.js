/* SentinelIQ Module — EHR Anomaly Detection */

function setSentinelScenario(role, hour, billing) {
  document.getElementById('providerRole').value = role;
  syncHourInput(hour);
  syncBillingInput(billing);
  showToast(`Scenario loaded: ${role} @ ${hour}:00 · billing ${(billing*100).toFixed(0)}%`, 'info');
}

async function runSentinel() {
  const role    = document.getElementById('providerRole').value;
  const hour    = parseInt(document.getElementById('accessHour').value);
  const billing = parseFloat(document.getElementById('billingScore').value);

  if (isNaN(hour) || isNaN(billing)) {
    showToast('Please enter valid values for all fields', 'error');
    return;
  }

  const btn = document.getElementById('sentinelBtn');
  btn.disabled = true;
  showLoader('Running Isolation Forest anomaly detection…');
  addToAuditLog(`SentinelIQ audit: ${role} @ hour ${hour}, billing ${(billing*100).toFixed(0)}%`, 'cyan');

  try {
    const data = await OmniAPI.auditEHR(role, hour, billing);
    renderSentinelResult(data, role, hour, billing);
    const flagged = data.is_anomaly;
    addToAuditLog(
      `SentinelIQ: ${data.action_taken} — ${role} access @ ${hour}:00`,
      flagged ? 'red' : 'green'
    );
    showToast(
      flagged ? `Anomaly detected for ${role}` : `Access cleared for ${role}`,
      flagged ? 'error' : 'success'
    );
  } catch (err) {
    showToast(`SentinelIQ error: ${err.message}`, 'error');
    addToAuditLog(`SentinelIQ API error: ${err.message}`, 'red');
  } finally {
    hideLoader();
    btn.disabled = false;
  }
}

function renderSentinelResult(data, role, hour, billing) {
  document.getElementById('sentinelResult').style.display = 'block';
  document.getElementById('sentinelEmpty').style.display  = 'none';

  const flagged = data.is_anomaly;
  const iconEl  = document.getElementById('auditResultIcon');

  iconEl.className = `audit-hero-icon ${flagged ? 'audit-icon-flagged' : 'audit-icon-cleared'}`;
  iconEl.innerHTML = flagged
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:36px;height:36px"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:36px;height:36px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;

  const labelEl  = document.getElementById('auditResultLabel');
  const detailEl = document.getElementById('auditResultDetail');

  labelEl.textContent  = flagged ? 'ANOMALY FLAGGED' : 'ACCESS CLEARED';
  labelEl.style.color  = flagged ? 'var(--color-danger)' : 'var(--color-success)';
  detailEl.textContent = flagged
    ? 'Unusual access pattern detected — flagged for security review'
    : 'Access pattern is within normal operational parameters';

  const ampm = hour < 12 ? 'AM' : 'PM';
  const h12  = hour % 12 || 12;

  document.getElementById('auditMeta').innerHTML = [
    { k: 'Provider Role',      v: role },
    { k: 'Access Time',        v: `${h12}:00 ${ampm} (Hour ${hour})` },
    { k: 'Billing Coherence',  v: `${(billing*100).toFixed(0)}%` },
    { k: 'Model',              v: 'Isolation Forest (scikit-learn)' },
    { k: 'Action Taken',       v: data.action_taken },
    { k: 'Anomaly Detected',   v: data.is_anomaly ? 'Yes' : 'No' },
  ].map(r => `
    <div class="data-row" role="row">
      <span class="data-key" role="rowheader">${r.k}</span>
      <span class="data-val" role="cell">${r.v}</span>
    </div>
  `).join('');
}

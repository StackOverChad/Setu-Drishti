/* TrialBridge Module — NLP Semantic Matching */

function setTrialPhrase(text) {
  document.getElementById('trialText').value = text;
  document.getElementById('trialText').focus();
}

async function runTrialBridge() {
  const text = document.getElementById('trialText').value.trim();
  if (!text) { showToast('Please enter a patient medical summary', 'error'); return; }

  const btn = document.getElementById('trialBtn');
  btn.disabled = true;
  showLoader('Running NLP semantic vector matching…');
  addToAuditLog('TrialBridge semantic search initiated', 'cyan');

  try {
    const data = await OmniAPI.matchTrials(text);
    renderTrialResult(data);
    addToAuditLog(
      `TrialBridge: ${data.matches.length} match(es) from ${data.total_active_trials_scanned} trials scanned`,
      data.matches.length > 0 ? 'green' : 'amber'
    );
    showToast(
      `Found ${data.matches.length} trial match(es) from ${data.total_active_trials_scanned} scanned`,
      data.matches.length > 0 ? 'success' : 'info'
    );
  } catch (err) {
    showToast(`TrialBridge error: ${err.message}`, 'error');
    addToAuditLog(`TrialBridge API error: ${err.message}`, 'red');
  } finally {
    hideLoader();
    btn.disabled = false;
  }
}

function renderTrialResult(data) {
  document.getElementById('trialResult').style.display = 'block';
  document.getElementById('trialEmpty').style.display  = 'none';

  const countBadge = document.getElementById('trialMatchCount');
  countBadge.textContent = `${data.matches.length} found`;
  countBadge.className   = `result-badge ${data.matches.length > 0 ? 'badge-GREEN' : 'badge-YELLOW'}`;

  document.getElementById('trialScannedText').textContent =
    `Semantically scanned ${data.total_active_trials_scanned} active clinical trials in database`;

  const list = document.getElementById('trialList');

  if (data.matches.length === 0) {
    list.innerHTML = `
      <div class="placeholder-inner" style="padding:2rem 0">
        <p class="placeholder-title" style="font-size:var(--text-base)">No matches found</p>
        <p class="placeholder-text">No trials passed the semantic similarity threshold (&gt;20%). Try broadening your description.</p>
      </div>`;
    return;
  }

  list.innerHTML = data.matches.map(m => {
    const conf = m.confidence_score;
    const barColor = conf >= 60 ? 'linear-gradient(90deg,#14b8a6,#22c55e)' :
                     conf >= 40 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' :
                                  'linear-gradient(90deg,#3b82f6,#60a5fa)';
    return `
      <article class="trial-card" role="listitem">
        <div class="trial-card-hd">
          <span class="trial-id">${m.trial_id}</span>
          <span class="trial-conf">${conf.toFixed(1)}% match</span>
        </div>
        <div class="trial-cond">${m.condition}</div>
        <div class="trial-why">${m.match_reason}</div>
        <div class="progress-bar-wrap" role="progressbar" aria-valuenow="${conf}" aria-valuemin="0" aria-valuemax="100" aria-label="${conf.toFixed(1)}% confidence">
          <div class="progress-bar-fill" style="width:${conf}%;background:${barColor}"></div>
        </div>
      </article>
    `;
  }).join('');
}

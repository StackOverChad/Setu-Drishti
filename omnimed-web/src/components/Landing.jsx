import React from 'react';

export default function Landing({ onEnter, theme, onToggleTheme }) {
  return (
    <div className="landing" id="landing">
      {/* Animated BG */}
      <div className="landing-bg" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-grid" />
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="logo-mark">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 8v16M8 16h16M11 11l10 10M21 11L11 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-name">OmniMed</span>
        </div>
        <div className="landing-nav-actions">
          <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            <span className="theme-icon-sun" aria-hidden="true">☀</span>
            <span className="theme-icon-moon" aria-hidden="true">☾</span>
          </button>
          <button className="btn-launch" onClick={onEnter} id="navEnterBtn">
            Open Platform
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" aria-labelledby="heroTitle">
        <div className="hero-eyebrow">
          <span className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            AI-Powered · Offline-First · India-Built
          </span>
        </div>
        <h1 className="hero-title" id="heroTitle">
          One Platform.<br />
          <span className="hero-gradient-text">Six AI Modules.</span><br />
          Zero Limits.
        </h1>
        <p className="hero-subtitle">
          OmniMed is the clinical intelligence OS for frontline health workers,
          physicians, and hospital administrators — delivering real-time AI diagnostics,
          EHR security, and patient triage even without internet connectivity.
        </p>
        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={onEnter} id="heroEnterBtn">
            Open Clinical Dashboard
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a className="btn-hero-secondary" href="#features">Explore Modules</a>
        </div>
        <div className="hero-stats" role="list" aria-label="Platform statistics">
          <div className="hero-stat" role="listitem"><span className="hero-stat-value">3.5M+</span><span className="hero-stat-label">Frontline Users</span></div>
          <div className="hero-stat-sep" aria-hidden="true" />
          <div className="hero-stat" role="listitem"><span className="hero-stat-value">6</span><span className="hero-stat-label">AI Modules</span></div>
          <div className="hero-stat-sep" aria-hidden="true" />
          <div className="hero-stat" role="listitem"><span className="hero-stat-value">100%</span><span className="hero-stat-label">Offline Capable</span></div>
          <div className="hero-stat-sep" aria-hidden="true" />
          <div className="hero-stat" role="listitem"><span className="hero-stat-value">&lt;10s</span><span className="hero-stat-label">Trial Match Latency</span></div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="features" id="features" aria-labelledby="featuresTitle">
        <div className="section-header">
          <p className="section-eyebrow">Platform Modules</p>
          <h2 className="section-title" id="featuresTitle">Six Engines. One Intelligence.</h2>
          <p className="section-subtitle">Each module solves a distinct clinical problem. Together, they create emergent intelligence impossible in any single solution.</p>
        </div>
        <div className="module-grid" role="list">
          {[
            { tag: 'TONESCORE', title: 'Emotion-Aware Triage', desc: 'Analyzes vocal acoustics and transcript sentiment to produce a composite urgency score — catching silent crises before they escalate.', chips: ['openSMILE', 'distilBERT', 'Offline'], color: 'red', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> },
            { tag: 'NIDANA VISION+', title: 'Non-Invasive Diagnostics', desc: 'Turns a smartphone camera into a clinical instrument — detecting anemia, malnutrition, skin lesions, and jaundice without any extra hardware.', chips: ['MobileNetV2', 'EfficientNet', 'On-Device'], color: 'blue', icon: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></> },
            { tag: 'TRIALBRIDGE', title: 'Clinical Trial Matching', desc: 'Semantically matches patient profiles to active clinical trials using NLP vector embeddings — in under 10 seconds.', chips: ['SentenceBERT', 'Cosine Sim', 'Real-time'], color: 'green', icon: <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/> },
            { tag: 'SENTINELIQ', title: 'EHR Fraud Detection', desc: 'Runs continuous unsupervised anomaly detection on EHR access logs — flagging role mismatches, billing fraud, and ghost patient records.', chips: ['Isolation Forest', 'FHIR R4', 'Zero Labels'], color: 'amber', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
            { tag: 'PULSEWATCH', title: 'Wearable RPM', desc: 'Aggregates multi-device wearable data and detects physiological deterioration 6–12 hours before it becomes clinically apparent.', chips: ['LSTM Autoencoder', 'BLE GATT', 'TFLite'], color: 'purple', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
            { tag: 'SCRIBEFLOW+', title: 'Ambient Clinical Scribe', desc: 'Records conversations, transcribes in real time, extracts ICD-10 codes, and auto-fills EHR forms — all entirely offline.', chips: ['Whisper-small', 'spaCy NER', 'Offline'], color: 'cyan', icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></> },
          ].map(m => (
            <article key={m.tag} className="module-card" role="listitem">
              <div className={`module-card-icon module-icon-${m.color}`} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{m.icon}</svg>
              </div>
              <div className="module-card-tag">{m.tag}</div>
              <h3 className="module-card-title">{m.title}</h3>
              <p className="module-card-desc">{m.desc}</p>
              <div className="module-card-meta">
                {m.chips.map(c => <span key={c} className="module-meta-chip">{c}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Architecture Strip */}
      <section className="arch-strip" aria-labelledby="archTitle">
        <div className="arch-inner">
          <div className="arch-text">
            <p className="section-eyebrow">Architecture</p>
            <h2 id="archTitle">Three-Layer Intelligence Stack</h2>
            <p>Edge AI models run 100% offline on-device. A sync layer pushes compressed JSON payloads opportunistically. The cloud layer handles analytics, trial matching, and dashboards — only when connectivity exists.</p>
            <button className="btn-hero-primary" style={{ marginTop: '2rem' }} onClick={onEnter}>Enter Platform →</button>
          </div>
          <div className="arch-diagram" aria-label="Architecture layers diagram">
            <div className="arch-layer arch-layer-cloud"><span className="arch-layer-label">LAYER 3</span><span className="arch-layer-name">Cloud Analytics &amp; API</span><span className="arch-layer-tech">FastAPI · PostgreSQL · Pinecone · Kafka</span></div>
            <div className="arch-arrow" aria-hidden="true">⇕ Opportunistic Sync</div>
            <div className="arch-layer arch-layer-sync"><span className="arch-layer-label">LAYER 2</span><span className="arch-layer-name">Sync &amp; Enrichment</span><span className="arch-layer-tech">HTTP/2 · Bluetooth RFCOMM · FHIR R4</span></div>
            <div className="arch-arrow" aria-hidden="true">⇕ On-Device</div>
            <div className="arch-layer arch-layer-edge"><span className="arch-layer-label">LAYER 1</span><span className="arch-layer-name">Edge Intelligence</span><span className="arch-layer-tech">ONNX Runtime · TFLite · SQLite + AES-256</span></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta" aria-labelledby="ctaTitle">
        <h2 id="ctaTitle">Ready to transform clinical care?</h2>
        <p>Open the platform and experience all six AI modules working in concert — triage, vision, trials, security, sync, and scribing.</p>
        <button className="btn-hero-primary" onClick={onEnter}>
          Open OmniMed Platform
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <div className="logo-mark small" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span>OmniMed</span>
        </div>
        <p className="footer-copy">© 2026 OmniMed. Hackathon Build. All rights reserved.</p>
        <p className="footer-tagline">One Platform. Six Modules. Zero Internet Required.</p>
      </footer>
    </div>
  );
}

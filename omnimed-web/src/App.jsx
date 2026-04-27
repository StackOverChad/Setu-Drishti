import React, { useState } from 'react';
import { useTheme, useBackendStatus, useCurrentTime, useAuditLog, useToast } from './hooks/useApp.js';
import Landing from './components/Landing.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import Loader from './components/Loader.jsx';
import Dashboard from './modules/Dashboard.jsx';
import Triage from './modules/Triage.jsx';
import Nidana from './modules/Nidana.jsx';
import TrialBridge from './modules/TrialBridge.jsx';
import SentinelIQ from './modules/SentinelIQ.jsx';
import Sync from './modules/Sync.jsx';

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { status: backendStatus, retry } = useBackendStatus();
  const time = useCurrentTime();
  const { entries: auditEntries, add: addAudit } = useAuditLog();
  const { toasts, show: showToast } = useToast();

  const [view, setView] = useState('landing'); // 'landing' | 'app'
  const [page, setPage] = useState('dashboard');
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loaderText, setLoaderText] = useState('Processing…');

  const showLoader = (text = 'Processing…') => { setLoaderText(text); setLoaderVisible(true); };
  const hideLoader = () => setLoaderVisible(false);

  const pageProps = { onAddAudit: addAudit, onShowToast: showToast, onShowLoader: showLoader, onHideLoader: hideLoader };

  const PAGE_TITLES = {
    dashboard: 'Clinical Dashboard',
    triage: 'ToneScore Triage',
    nidana: 'Nidana Vision+',
    trialbridge: 'TrialBridge',
    sentineliq: 'SentinelIQ',
    sync: 'Patient Sync',
  };

  return (
    <>
      <Toast toasts={toasts} />
      <Loader visible={loaderVisible} text={loaderText} />

      {view === 'landing' ? (
        <Landing onEnter={() => setView('app')} theme={theme} onToggleTheme={toggleTheme} />
      ) : (
        <div className="app-shell" id="appShell">
          <Sidebar
            currentPage={page}
            onNavigate={setPage}
            onExit={() => setView('landing')}
            onToggleTheme={toggleTheme}
            backendStatus={backendStatus}
            onRetry={retry}
          />

          <main className="main-content" id="mainContent" role="main">
            {/* Topbar */}
            <header className="topbar" role="banner">
              <div className="topbar-left">
                <h2 className="topbar-title">{PAGE_TITLES[page]}</h2>
                <div className="topbar-breadcrumb" aria-label="Current page">
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </div>
              </div>
              <div className="topbar-right">
                <div className="topbar-time" aria-live="off">{time}</div>
                <div className="topbar-divider" aria-hidden="true" />
                <button className="theme-toggle-topbar" onClick={toggleTheme} aria-label="Toggle theme">
                  <span className="theme-icon-sun" aria-hidden="true">☀</span>
                  <span className="theme-icon-moon" aria-hidden="true">☾</span>
                </button>
              </div>
            </header>

            {/* Page router */}
            {page === 'dashboard'   && <Dashboard {...pageProps} auditEntries={auditEntries} onAddAudit={addAudit} />}
            {page === 'triage'      && <Triage {...pageProps} />}
            {page === 'nidana'      && <Nidana {...pageProps} />}
            {page === 'trialbridge' && <TrialBridge {...pageProps} />}
            {page === 'sentineliq'  && <SentinelIQ {...pageProps} />}
            {page === 'sync'        && <Sync {...pageProps} />}
          </main>
        </div>
      )}
    </>
  );
}

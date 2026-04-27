import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import OmnimedApp from './OmnimedApp';

export default function App({ mockupAuth }) {
  if (mockupAuth) {
    return (
      <Routes>
        <Route path="/" element={<Landing mockupAuth={true} />} />
        <Route element={<Layout mockupAuth={true} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/omnimed/*" element={<OmnimedApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <>
          <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
          <SignedOut><Landing /></SignedOut>
        </>
      } />

      <Route element={
        <>
          <SignedIn><Layout mockupAuth={false} /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="/omnimed/*" element={
        <>
          <SignedIn><OmnimedApp /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
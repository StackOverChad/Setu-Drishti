import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isDemoMode = !PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {isDemoMode ? (
        <App mockupAuth={true} />
      ) : (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <App mockupAuth={false} />
        </ClerkProvider>
      )}
    </BrowserRouter>
  </StrictMode>
);
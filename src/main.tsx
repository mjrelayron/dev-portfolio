import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './styles/globals.css';
import './styles/app.css';
import { App } from './app/App';
import { SeoProvider } from './app/Seo';

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.dataset.motion = 'reduced';

// Prerendered HTML is shown until the app takes over; createRoot (not hydrate)
// keeps client-only differences (viewport, saved settings) from causing mismatches.
const root = document.getElementById('root')!;
createRoot(root).render(
  <StrictMode>
      <SeoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SeoProvider>
    {/* the insights script only exists on Vercel deployments */}
    {!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && <Analytics />}
  </StrictMode>,
);

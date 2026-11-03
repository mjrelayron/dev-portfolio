// Debug script to check if Vercel Analytics is working
// Run this in browser console

console.log('=== Vercel Analytics Debug ===');

// Check if analytics script is loaded
const analyticsScript = document.querySelector('script[src*="vercel"]');
console.log('Analytics script found:', analyticsScript);

// Check for analytics in window object
console.log('Window.va:', window.va);
console.log('Window.__VERCEL_ANALYTICS__:', window.__VERCEL_ANALYTICS__);

// Check for any analytics-related scripts
const allScripts = Array.from(document.querySelectorAll('script'));
const vercelScripts = allScripts.filter(script => 
  script.src && script.src.includes('vercel')
);
console.log('Vercel scripts found:', vercelScripts);

// Check localStorage for analytics
const analyticsKeys = Object.keys(localStorage).filter(key => 
  key.toLowerCase().includes('vercel') || 
  key.toLowerCase().includes('analytics')
);
console.log('Analytics localStorage keys:', analyticsKeys);

// Check if we're on Vercel domain
console.log('Current domain:', window.location.hostname);
console.log('Is Vercel domain:', window.location.hostname.includes('vercel.app'));

// Check for CSP headers blocking analytics
console.log('=== Debug Complete ===');

import type { Page } from '@playwright/test';

/** Skip the intro for returning-visitor tests. */
export async function skipIntro(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('dv-settings', JSON.stringify({ state: { sound: false, introSeen: true }, version: 0 }));
  });
}

/** Collect console errors and failed same-origin requests. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  page.on('response', (r) => {
    const u = new URL(r.url());
    if (r.status() >= 400 && u.hostname === 'localhost' && !u.pathname.startsWith('/api/')) errors.push(`${r.status()} ${u.pathname}`);
  });
  return errors;
}

/** Never let tests reach EmailJS or the Gemini function. */
export async function mockNetwork(page: Page) {
  await page.route('**/api.emailjs.com/**', (r) => r.fulfill({ status: 200, body: 'OK' }));
  await page.route('**/api/chat', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reply: 'Test reply' }) }));
}

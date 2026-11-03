import { test, expect } from '@playwright/test';
import { skipIntro, trackErrors, mockNetwork } from './helpers';

const ROUTES = [
  '/', '/world', '/projects', '/projects?view=exhibition', '/projects/guro-ai', '/projects/workflow-automation-challenger',
  '/skills', '/experience', '/lab', '/lab/simulators', '/lab/scraping-dashboard', '/lab/chat', '/lab/practice',
  '/about', '/contact', '/resume', '/os', '/arcade', '/arcade/stack-builder', '/arcade/bug-hunter',
  '/arcade/project-explorer', '/arcade/workflow-challenger', '/classic', '/does-not-exist',
];

test.beforeEach(async ({ page }) => {
  await skipIntro(page);
  await mockNetwork(page);
});

for (const route of ROUTES) {
  test(`loads ${route} without console errors`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(route);
    await expect(page.locator('#main')).toBeAttached();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);
    // the scraping dashboard and workflow challenger call external backends that
    // may be unreachable from a test machine; only fail on our own code/assets
    const ours = errors.filter((e) => !/Failed to fetch|NetworkError|ERR_|railway|youtube|googleapis|net::/i.test(e));
    expect(ours, ours.join('\n')).toEqual([]);
  });
}

test('legacy URLs redirect', async ({ page }) => {
  const pairs = [
    ['/workflow-challenger', '/arcade/workflow-challenger'],
    ['/chat', '/lab/chat'],
    ['/practice', '/lab/practice'],
    ['/scraping-dashboard', '/lab/scraping-dashboard'],
  ];
  for (const [from, to] of pairs) {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(`${to}$`));
  }
});

test('every dock button navigates', async ({ page }) => {
  await page.goto('/world');
  const dock = page.getByRole('navigation', { name: 'Destinations' });
  const stops = [
    ['Skill Academy', '/skills'],
    ['Project District', '/projects'],
    ['Experience Tower', '/experience'],
    ['Experiment Lab', '/lab'],
    ['Contact Portal', '/contact'],
    ['Central Hub', '/about'],
  ];
  for (const [name, path] of stops) {
    await dock.getByRole('link', { name: new RegExp(name) }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator('h1').first()).toBeVisible();
  }
});

test('keyboard: number keys, H and Esc', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'keyboard shortcuts are a desktop feature');
  await page.goto('/world');
  await page.locator('body').click({ position: { x: 5, y: 300 } });
  await page.keyboard.press('3');
  await expect(page).toHaveURL(/\/skills$/);
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/world$/);
  await page.keyboard.press('6');
  await expect(page).toHaveURL(/\/contact$/);
  await page.keyboard.press('h');
  await expect(page).toHaveURL(/\/world$/);
});

test('hub buildings are real links', async ({ page }) => {
  await page.goto('/world');
  await expect(page.locator('a.bld')).toHaveCount(6);
  for (const href of ['/about', '/projects', '/skills', '/experience', '/lab', '/contact']) {
    await expect(page.locator(`a.bld[href="${href}"]`)).toHaveCount(1);
  }
});

test('clicking a building enters the destination', async ({ page, isMobile }) => {
  await page.goto('/world');
  const b = page.locator('a.bld[href="/projects"]');
  await b.click({ force: true });
  if (isMobile) await b.click({ force: true }); // first tap only shows the label
  await expect(page).toHaveURL(/\/projects$/, { timeout: 5000 });
});

test('first visit plays the intro and it can be skipped', async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto('/');
  const skip = page.getByRole('button', { name: 'Skip intro' });
  await expect(skip).toBeVisible();
  await expect(page.getByRole('link', { name: /classic view/i }).first()).toBeVisible();
  await skip.click();
  await expect(skip).toHaveCount(0);
  await page.reload();
  await page.waitForTimeout(500);
  await expect(page.getByRole('button', { name: 'Skip intro' })).toHaveCount(0);
  await page.close();
});

test('an achievement unlocks with a toast', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByText('Unlocked: First Contact')).toBeVisible();
  await page.getByRole('button', { name: /Achievements: 1 of 5/ }).click();
  await expect(page.getByRole('dialog', { name: 'Achievements' })).toContainText('Unlocked');
});

test('reduced motion: intro collapses, navigation still works', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Skip intro' })).toHaveCount(0, { timeout: 4000 });
  await page.getByRole('navigation', { name: 'Destinations' }).getByRole('link', { name: /Project District/ }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator('h1').first()).toBeVisible();
  await ctx.close();
});

test('prerendered HTML has per-route SEO tags', async ({ request }) => {
  const html = await (await request.get('/projects/guro-ai')).text();
  expect(html).toMatch(/<title>[^<]*Guro\.AI/);
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('og:image');
  expect(html).toContain('"@type":"CreativeWork"');
  const home = await (await request.get('/')).text();
  expect(home).toContain('"@type":"Person"');
});

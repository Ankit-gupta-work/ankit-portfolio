import { test, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const REFERENCE_PATH = path.resolve(__dirname, '../design/portfolio-reference.html');
const REFERENCE_URL = `file:///${REFERENCE_PATH.replace(/\\/g, '/')}`;
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844 },
];

const SECTIONS = ['top', 'building', 'work', 'think', 'stack', 'contact'];

async function setTheme(page: Page, theme: 'dark' | 'light', toggleSelector: string) {
  const isLight = await page.evaluate(() => document.querySelector('.pf')?.classList.contains('light'));
  if ((theme === 'light') !== !!isLight) {
    await page.click(toggleSelector);
    await page.waitForTimeout(350);
  }
}

async function scrollToSection(page: Page, id: string) {
  await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
  }, id);
  await page.waitForTimeout(400);
}

for (const viewport of VIEWPORTS) {
  for (const theme of ['dark', 'light'] as const) {
    test(`reference @ ${viewport.name} / ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(REFERENCE_URL);
      await setTheme(page, theme, '#themeToggle');
      for (const section of SECTIONS) {
        await scrollToSection(page, section);
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `reference_${viewport.name}_${theme}_${section}.png`),
        });
      }
    });

    test(`app @ ${viewport.name} / ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await setTheme(page, theme, '.tgl');
      for (const section of SECTIONS) {
        await scrollToSection(page, section);
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `app_${viewport.name}_${theme}_${section}.png`),
        });
      }
    });
  }
}

test('app respects prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'app_reduced_motion_top.png') });
});

test('app keyboard navigation reaches all links and toggle', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const focusable = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href], button')).length,
  );
  let reached = 0;
  for (let i = 0; i < focusable + 5; i++) {
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => document.activeElement?.tagName);
    if (tag === 'A' || tag === 'BUTTON') reached++;
  }
  console.log(`Reached ${reached} focusable elements out of ${focusable}`);
});

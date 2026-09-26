import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots/chat');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function setTheme(page: Page, theme: 'dark' | 'light') {
  const isLight = await page.evaluate(() => document.querySelector('.pf')?.classList.contains('light'));
  if ((theme === 'light') !== !!isLight) {
    await page.click('.tgl');
    await page.waitForTimeout(350);
  }
}

async function openWidget(page: Page) {
  await page.click('.launcher');
  await page.waitForSelector('.panel', { state: 'visible' });
  await page.waitForTimeout(400); // let the 300ms open animation finish before screenshotting
}

for (const viewport of VIEWPORTS) {
  for (const theme of ['dark', 'light'] as const) {
    test(`chat widget closed @ ${viewport.name} / ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await setTheme(page, theme);
      await page.waitForSelector('.launcher', { state: 'visible', timeout: 10000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `closed_${viewport.name}_${theme}.png`) });
    });

    test(`chat widget open-empty @ ${viewport.name} / ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await setTheme(page, theme);
      await page.waitForSelector('.launcher', { state: 'visible', timeout: 10000 });
      await openWidget(page);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `open-empty_${viewport.name}_${theme}.png`) });
    });
  }
}

test('chat widget: keyboard — Esc closes and focus returns to launcher', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForSelector('.launcher', { state: 'visible', timeout: 10000 });
  await openWidget(page);
  await expect(page.locator('.chat-input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.panel')).toHaveCount(0);
  await expect(page.locator('.launcher')).toBeFocused();
});

test('chat widget: suggestion chips are present with correct text', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForSelector('.launcher', { state: 'visible', timeout: 10000 });
  await openWidget(page);
  const chips = page.locator('.chip-btn');
  await expect(chips).toHaveCount(4);
  await expect(chips.nth(0)).toHaveText("What's JobPing's architecture?");
  await expect(chips.nth(3)).toHaveText('How do I contact him?');
});

test('chat widget: network error surfaces friendly fallback message', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForSelector('.launcher', { state: 'visible', timeout: 10000 });
  await openWidget(page);

  await page.fill('.chat-input', 'What does Ankit work with?');
  await page.keyboard.press('Enter');

  // No API is running in this test env, so the fetch should fail and the
  // service should append its friendly fallback message.
  await page.waitForSelector('.msg-assistant', { timeout: 10000 });
  await page.waitForTimeout(500);
  const assistantText = await page.locator('.msg-assistant').first().innerText();
  expect(assistantText.toLowerCase()).toContain('ankitjguptaforwork@gmail.com');

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'network-error-fallback.png') });
});

async function mockStreamingFetch(page: Page) {
  await page.addInitScript(() => {
    const encoder = new TextEncoder();
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (!url.includes('/api/chat')) return originalFetch(input, init);

      const frames = [
        JSON.stringify('JobPing '),
        JSON.stringify('uses **RabbitMQ** for its pipeline:\n'),
        JSON.stringify('- fetch jobs\n'),
        JSON.stringify('- score matches\n'),
        JSON.stringify('- send alerts\n'),
      ];

      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          for (const frame of frames) {
            await new Promise((r) => setTimeout(r, 400));
            controller.enqueue(encoder.encode(`data: ${frame}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    };
  });
}

test('chat widget mid-stream and final answer (mocked provider, no live API needed)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockStreamingFetch(page);
  await page.goto('/');
  await page.waitForSelector('.launcher', { state: 'visible', timeout: 10000 });
  await openWidget(page);

  await page.fill('.chat-input', "What's JobPing's architecture?");
  await page.keyboard.press('Enter');

  await page.waitForSelector('.msg-assistant .caret', { timeout: 5000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mid-stream_desktop_dark.png') });

  await page.waitForSelector('.msg-assistant .caret', { state: 'detached', timeout: 5000 });
  await expect(page.locator('.msg-assistant a')).toHaveCount(0); // no links in this answer, sanity check renderer ran
  await expect(page.locator('.msg-assistant li')).toHaveCount(3);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'with-answer_desktop_dark.png') });
});

test('chat widget respects prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForSelector('.launcher', { state: 'visible', timeout: 10000 });
  await openWidget(page);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'open-reduced-motion.png') });
});

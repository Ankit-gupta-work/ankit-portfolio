import { test, expect } from '@playwright/test';

const WIDTHS = [390, 768, 1024, 1440];

for (const width of WIDTHS) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(300);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth, `scrollWidth ${scrollWidth} vs clientWidth ${clientWidth} at ${width}px`).toBeLessThanOrEqual(clientWidth);
    expect(errors, `console errors at ${width}px: ${errors.join(' | ')}`).toEqual([]);
  });
}

const { chromium } = require('@playwright/test');
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function setTheme(page, theme) {
  const isLight = await page.evaluate(() => document.querySelector('.pf')?.classList.contains('light'));
  if ((theme === 'light') !== !!isLight) {
    await page.click('.tgl');
    await page.waitForTimeout(350);
  }
}

function pixelAt(png, x, y) {
  const idx = (png.width * y + x) << 2;
  return { r: png.data[idx], g: png.data[idx + 1], b: png.data[idx + 2] };
}

// Scans a 2D block (must span at least one full 64px grid period in both axes) to robustly find
// an actual on-line and off-line pixel, rather than assuming an exact background-position offset
// or relying on a single row/column that might not cross a horizontal AND vertical line.
function findLineAndGap(png, xStart, xEnd, yStart, yEnd, theme) {
  let brightest = { x: xStart, y: yStart, v: -1 };
  let dimmest = { x: xStart, y: yStart, v: 999 };
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      const p = pixelAt(png, x, y);
      const v = p.r + p.g + p.b;
      if (v > brightest.v) brightest = { x, y, v };
      if (v < dimmest.v) dimmest = { x, y, v };
    }
  }
  // Dark theme: line is brighter than gap. Light theme: line is dimmer than gap.
  const onLine = theme === 'dark' ? brightest : dimmest;
  const offLine = theme === 'dark' ? dimmest : brightest;
  return { onLine, offLine };
}

async function fullPageBuffer(page) {
  const buf = await page.screenshot();
  return PNG.sync.read(buf);
}

(async () => {
  const browser = await chromium.launch();
  const results = {};

  for (const theme of ['dark', 'light']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4300/');
    await setTheme(page, theme);
    await page.waitForTimeout(300);

    // --- Top of page --- scan a clear black patch to the left of the hero text/nodes, spanning
    // more than one full 64px grid period in both axes.
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `bg-grid_${theme}_top.png`) });
    let png = await fullPageBuffer(page);

    const { onLine, offLine } = findLineAndGap(png, 20, 150, 250, 400, theme);
    results[`${theme}_top_onLine`] = { at: `(${onLine.x},${onLine.y})`, ...pixelAt(png, onLine.x, onLine.y) };
    results[`${theme}_top_offLine`] = { at: `(${offLine.x},${offLine.y})`, ...pixelAt(png, offLine.x, offLine.y) };

    // --- Scrolled to middle, between sections ---
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.evaluate((h) => window.scrollTo(0, h * 0.45), scrollHeight);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `bg-grid_${theme}_middle.png`) });
    png = await fullPageBuffer(page);
    const mid = findLineAndGap(png, 20, 150, 250, 400, theme);
    results[`${theme}_middle_onLine`] = { at: `(${mid.onLine.x},${mid.onLine.y})`, ...pixelAt(png, mid.onLine.x, mid.onLine.y) };
    results[`${theme}_middle_offLine`] = { at: `(${mid.offLine.x},${mid.offLine.y})`, ...pixelAt(png, mid.offLine.x, mid.offLine.y) };

    // --- Edge fade check: the true viewport corner (x=1, far outside the mask's ellipse), where
    // the mask should have faded fully to transparent regardless of any grid line underneath ---
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    png = await fullPageBuffer(page);
    const bgOnlyPixel = pixelAt(png, 700, 850); // far from any content, should equal plain bg
    results[`${theme}_farCorner (1,1)`] = pixelAt(png, 1, 1);
    results[`${theme}_farCorner (1439,899)`] = pixelAt(png, 1439, 899);
    results[`${theme}_bg_reference`] = bgOnlyPixel;

    await page.close();
  }

  await browser.close();

  console.log(JSON.stringify(results, null, 2));
})();

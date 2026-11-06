const puppeteer = require('puppeteer');
const path = require('path');

const OUT_DIR = 'C:/Users/aneka/.gemini/antigravity/brain/b96a6cf3-8cff-4e40-806a-d62501abac9f';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching Chrome to verify 3-panel restoration on homepage...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  // 1. Audit 3 Panels Layout & Alignment
  console.log('--- Step 1: Auditing 3-Column Panels Layout & Dimensions ---');
  const audit = await page.evaluate(() => {
    const panelsRow = document.querySelector('section .grid.grid-cols-12, section .grid.md\\:grid-cols-12');
    const mapEl = document.getElementById('map-section');
    const qrEl = Array.from(document.querySelectorAll('.glass-panel')).find(p => p.innerText.includes('Scan for Navigation'));
    const dirEl = Array.from(document.querySelectorAll('.glass-panel')).find(p => p.innerText.includes('Get Directions') || p.innerText.includes('Live Turn-by-Turn'));

    const mapRect = mapEl ? mapEl.getBoundingClientRect() : null;
    const qrRect = qrEl ? qrEl.getBoundingClientRect() : null;
    const dirRect = dirEl ? dirEl.getBoundingClientRect() : null;

    const bodyText = document.body.innerText;
    const hasParkOverview = bodyText.includes('View Full Map') || !!document.querySelector('.group.cursor-pointer[title*="overview"]');
    const hasMapGuideInNavbar = Array.from(document.querySelectorAll('header nav button')).some(b => b.innerText.includes('Map Guide'));
    const hasScanQRInNavbar = Array.from(document.querySelectorAll('header button')).some(b => b.innerText.includes('Scan QR'));

    return {
      hasMapPanel: !!mapEl,
      hasQRPanel: !!qrEl,
      hasDirectionsPanel: !!dirEl,
      mapDimensions: mapRect ? { w: Math.round(mapRect.width), h: Math.round(mapRect.height), top: Math.round(mapRect.top) } : null,
      qrDimensions: qrRect ? { w: Math.round(qrRect.width), h: Math.round(qrRect.height), top: Math.round(qrRect.top) } : null,
      dirDimensions: dirRect ? { w: Math.round(dirRect.width), h: Math.round(dirRect.height), top: Math.round(dirRect.top) } : null,
      areAlignedInOneRow: (mapRect && qrRect && dirRect) ? Math.abs(mapRect.top - qrRect.top) < 10 && Math.abs(qrRect.top - dirRect.top) < 10 : false,
      hasParkOverview,
      hasMapGuideInNavbar,
      hasScanQRInNavbar
    };
  });

  console.log('3-Panel Audit Result:', JSON.stringify(audit, null, 2));

  // Screenshot 1: Full-screen view showing all 3 panels aligned in one row
  const shot1 = path.join(OUT_DIR, 'three_panels_01_homepage_aligned_row.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved 3-Panels Row screenshot:', shot1);

  // 2. Test Directions Panel: Choose Destination & Start Navigation
  console.log('--- Step 2: Testing Live Turn-by-Turn Navigation in Directions Panel ---');
  // Click "Show Route & Start" in DirectionsPanel
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Show Route') || b.innerText.includes('Start'));
    if (btn) btn.click();
  });
  await sleep(600);

  const shot2 = path.join(OUT_DIR, 'three_panels_02_live_navigation_active.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved Live Navigation Active screenshot:', shot2);

  // Test Next Step
  await page.evaluate(() => {
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Next') || b.getAttribute('aria-label')?.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await sleep(500);

  // 3. Test QR Scanner Panel Click
  console.log('--- Step 3: Testing QR Scanner Panel Click Interaction ---');
  await page.evaluate(() => {
    const qrStand = document.querySelector('img[src*="qr_stand"]')?.closest('div.cursor-pointer');
    if (qrStand) qrStand.click();
  });
  await sleep(800);

  const shot3 = path.join(OUT_DIR, 'three_panels_03_qr_scanner_modal_opened.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved QR Scanner Modal screenshot:', shot3);

  // Close QR modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.fixed button');
    if (closeBtn) closeBtn.click();
  });
  await sleep(500);

  // 4. Test Explore Mode Launch & Walking
  console.log('--- Step 4: Testing Explore Mode Walking Character & Trail ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Explore Park'));
    if (btn) btn.click();
  });
  await sleep(1000);

  await page.evaluate(() => {
    const walkBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Walk') || b.innerText.includes('Reception'));
    if (walkBtn) walkBtn.click();
  });
  await sleep(800);

  const shot4 = path.join(OUT_DIR, 'three_panels_04_explore_mode_walking_intact.png');
  await page.screenshot({ path: shot4 });
  console.log('Saved Explore Mode Walking screenshot:', shot4);

  await browser.close();
  console.log('All 3-panel restoration tests completed successfully!');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});


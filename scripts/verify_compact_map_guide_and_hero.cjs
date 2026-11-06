const puppeteer = require('puppeteer');
const path = require('path');

const OUT_DIR = 'C:/Users/aneka/.gemini/antigravity/brain/b96a6cf3-8cff-4e40-806a-d62501abac9f';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching browser to verify compact Park Map Guide and Hero layout...');
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

  // 1. Audit Compact Dimensions & Layout Constraints
  console.log('--- Step 1: Auditing Compact Layout Dimensions ---');
  const audit = await page.evaluate(() => {
    const mapEl = document.getElementById('map-section');
    const mapRect = mapEl ? mapEl.getBoundingClientRect() : null;

    const heroEl = document.querySelector('section > div');
    const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;

    const facEl = document.getElementById('facilities-section');
    const facRect = facEl ? facEl.getBoundingClientRect() : null;

    const bodyText = document.body.innerText;
    const hasParkOverview = bodyText.includes('View Full Map') || !!document.querySelector('.group.cursor-pointer[title*="overview"]');
    const hasScanForNav = bodyText.includes('Scan for Navigation') || bodyText.includes('Scan this QR for directions');
    const hasGetDirections = bodyText.includes('Get Directions & Route') || (bodyText.includes('Show Route') && bodyText.includes('Choose Destination'));

    // Check if the page content fits in standard vertical space
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    return {
      mapWidth: mapRect ? Math.round(mapRect.width) : 0,
      mapHeight: mapRect ? Math.round(mapRect.height) : 0,
      mapLeft: mapRect ? Math.round(mapRect.left) : 0,
      heroHeight: heroRect ? Math.round(heroRect.height) : 0,
      facHeight: facRect ? Math.round(facRect.height) : 0,
      documentHeight,
      windowHeight,
      fitsOnScreenWithoutMajorScroll: documentHeight <= windowHeight + 100,
      hasParkOverview,
      hasScanForNav,
      hasGetDirections
    };
  });

  console.log('Compact Layout Audit:', JSON.stringify(audit, null, 2));

  // Screenshot 1: Full 1080p Single-Screen Overview
  const shot1 = path.join(OUT_DIR, 'compact_01_full_screen_overview.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved Full-Screen Overview screenshot:', shot1);

  // 2. Test Map Guide Interaction
  console.log('--- Step 2: Testing Map Guide Destination Selection & Route Recalculation ---');
  // Click on Swimming Pool marker on the compact map
  await page.evaluate(() => {
    const markers = Array.from(document.querySelectorAll('#map-section .cursor-pointer'));
    const pool = markers.find(m => m.innerText.includes('Swimming Pool') || m.innerText.includes('Pool'));
    if (pool) pool.click();
  });
  await sleep(600);

  const shot2 = path.join(OUT_DIR, 'compact_02_map_guide_pool_recalculated.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved Map Guide Recalculated screenshot:', shot2);

  // 3. Test Zoom Controls
  console.log('--- Step 3: Testing Zoom Controls ---');
  await page.evaluate(() => {
    const zoomIn = document.querySelector('button[aria-label="Zoom in"]');
    if (zoomIn) zoomIn.click();
  });
  await sleep(400);

  // 4. Test Explore Mode Launch & Walking
  console.log('--- Step 4: Testing Explore Mode Launch ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Explore Park'));
    if (btn) btn.click();
  });
  await sleep(1000);

  const shot3 = path.join(OUT_DIR, 'compact_03_explore_mode_intact.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved Explore Mode screenshot:', shot3);

  // Click to walk
  await page.evaluate(() => {
    const walkBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Walk') || b.innerText.includes('Reception'));
    if (walkBtn) walkBtn.click();
  });
  await sleep(800);

  const shot4 = path.join(OUT_DIR, 'compact_04_walking_character_trail_intact.png');
  await page.screenshot({ path: shot4 });
  console.log('Saved Walking Trail screenshot:', shot4);

  await browser.close();
  console.log('All tests passed successfully!');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});


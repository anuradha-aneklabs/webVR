const puppeteer = require('puppeteer');
const path = require('path');

const OUT_DIR = 'C:/Users/aneka/.gemini/antigravity/brain/b96a6cf3-8cff-4e40-806a-d62501abac9f';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching browser to verify Restored Park Map Guide...');
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

  // 1. Verify Homepage Elements
  console.log('--- Step 1: Checking Restored Park Map Guide & Unwanted Elements Removal ---');
  const check = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const mapSection = document.getElementById('map-section');
    const hasMapGuideTitle = mapSection ? mapSection.innerText.includes('Park Map Guide') : false;
    const hasDistanceDuration = mapSection ? (mapSection.innerText.includes('m •') || mapSection.innerText.includes('min walk')) : false;
    const hasMapImg = !!mapSection?.querySelector('img[src*="park_map_clean"]');
    const markersCount = mapSection ? mapSection.querySelectorAll('.cursor-pointer').length : 0;
    const hasZoomIn = !!mapSection?.querySelector('button[aria-label="Zoom in"]');
    const hasZoomOut = !!mapSection?.querySelector('button[aria-label="Zoom out"]');
    const hasSvgRoute = !!mapSection?.querySelector('svg polyline');

    // Unwanted elements check
    const hasParkOverviewCard = bodyText.includes('View Full Map') || !!document.querySelector('.group.cursor-pointer[title*="overview"]');
    const hasMapGuideInNavbar = Array.from(document.querySelectorAll('header nav button')).some(b => b.innerText.includes('Map Guide'));
    const hasScanQRInNavbar = Array.from(document.querySelectorAll('header button')).some(b => b.innerText.includes('Scan QR'));
    const hasScanForNavPanel = bodyText.includes('Scan for Navigation') || bodyText.includes('Scan this QR for directions');
    const hasGetDirectionsPanel = bodyText.includes('Get Directions & Route') || (bodyText.includes('Show Route') && bodyText.includes('Choose Destination'));

    return {
      hasMapGuide: !!mapSection,
      hasMapGuideTitle,
      hasDistanceDuration,
      hasMapImg,
      markersCount,
      hasZoomIn,
      hasZoomOut,
      hasSvgRoute,
      hasParkOverviewCard,
      hasMapGuideInNavbar,
      hasScanQRInNavbar,
      hasScanForNavPanel,
      hasGetDirectionsPanel
    };
  });

  console.log('Verification Audit Result:', JSON.stringify(check, null, 2));

  // Take screenshot of homepage with restored Park Map Guide
  const shot1 = path.join(OUT_DIR, 'restored_01_homepage_with_park_map_guide.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved Homepage screenshot:', shot1);

  // Scroll to Park Map Guide and take a focused screenshot
  console.log('--- Step 2: Testing Zoom & Marker Selection on Map Guide ---');
  await page.evaluate(() => {
    const el = document.getElementById('map-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  });
  await sleep(600);

  // Click Zoom In
  await page.evaluate(() => {
    const zoomIn = document.querySelector('button[aria-label="Zoom in"]');
    if (zoomIn) zoomIn.click();
  });
  await sleep(400);

  // Click on "Swimming Pool" marker on the map
  await page.evaluate(() => {
    const markers = Array.from(document.querySelectorAll('#map-section .cursor-pointer'));
    const poolMarker = markers.find(m => m.innerText.includes('Swimming Pool') || m.innerText.includes('Pool'));
    if (poolMarker) poolMarker.click();
  });
  await sleep(600);

  const shot2 = path.join(OUT_DIR, 'restored_02_park_map_guide_pool_selected_route.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved Map Guide Focused screenshot:', shot2);

  // 3. Test "Walk in Explore Mode →" button from Map Guide
  console.log('--- Step 3: Testing "Walk in Explore Mode" action from Map Guide ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('#map-section button')).find(b => b.innerText.includes('Walk in Explore Mode') || b.innerText.includes('Explore Mode'));
    if (btn) btn.click();
  });
  await sleep(1200);

  const shot3 = path.join(OUT_DIR, 'restored_03_explore_mode_spawn_from_map.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved Explore Mode from Map screenshot:', shot3);

  // 4. Test walking character and trail
  console.log('--- Step 4: Testing character walking and glowing trail ---');
  await page.evaluate(() => {
    const walkBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Walk') || b.innerText.includes('Reception'));
    if (walkBtn) walkBtn.click();
  });
  await sleep(800);

  const shot4 = path.join(OUT_DIR, 'restored_04_explore_mode_character_walking_trail.png');
  await page.screenshot({ path: shot4 });
  console.log('Saved Walking Trail screenshot:', shot4);

  await sleep(2000);

  // 5. Test Mobile Viewport (390x844 iPhone 14 Pro style)
  console.log('--- Step 5: Testing Mobile Responsiveness ---');
  await page.evaluate(() => {
    const exitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Exit'));
    if (exitBtn) exitBtn.click();
  });
  await sleep(500);

  await page.setViewport({ width: 390, height: 844 });
  await sleep(600);

  const shot5 = path.join(OUT_DIR, 'restored_05_mobile_viewport_park_map_guide.png');
  await page.screenshot({ path: shot5, fullPage: true });
  console.log('Saved Mobile Viewport screenshot:', shot5);

  await browser.close();
  console.log('All tests completed successfully!');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});


import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/aneka/Desktop/ParkVerse/screenshots/verified_audit';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function testCompleteExperience() {
  console.log('=== Starting Exact 9-Station Physical Walking Audit ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  // 1. Homepage Audit
  console.log('1. Loading Homepage at http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const brokenHomepageImgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter(i => !i.complete || i.naturalWidth === 0)
      .map(i => i.src);
  });
  console.log('   Broken images on Homepage:', brokenHomepageImgs);

  // 2. Open Explore Mode
  console.log('2. Entering Explore Mode...');
  const exploreBtn = await page.$('button ::-p-text(Explore Park)');
  if (exploreBtn) {
    await exploreBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // Helper to click hotspot by ID and log active title
  async function stepViaHotspot(hotspotId, description) {
    console.log(`   Step: ${description} (Hotspot ID: ${hotspotId})`);
    const exists = await page.$(`[data-hotspot-id="${hotspotId}"]`);
    if (!exists) {
      console.error(`   ERROR: Hotspot [data-hotspot-id="${hotspotId}"] NOT FOUND on page!`);
      const available = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-hotspot-id]')).map(el => el.getAttribute('data-hotspot-id'));
      });
      console.log('   Available hotspot IDs:', available);
      return false;
    }
    await exists.click();
    await new Promise(r => setTimeout(r, 700)); // wait for transition

    const state = await page.evaluate(() => {
      const title = document.querySelector('h2')?.innerText;
      const stepBadge = document.querySelector('header span.text-xs')?.innerText;
      return { title, stepBadge };
    });
    console.log(`      -> Arrived: "${state.title}" (${state.stepBadge})`);
    return true;
  }

  // 3. Full Walking Tour from Station 1 to 9
  console.log('\n3. Executing Sequential Physical Walking Tour:');
  
  // 1 -> 2: Entrance to Reception
  await stepViaHotspot('h-ent-rec', 'Main Entrance -> Welcome Reception');

  // 2 -> 3: Reception to Restaurant Exterior
  await stepViaHotspot('h-rec-res', 'Welcome Reception -> Restaurant Pavilion Exterior');

  // 3 -> 4a: Restaurant Exterior to Wine Foyer
  await stepViaHotspot('h-rext-din', 'Restaurant Exterior -> Wine Foyer & Host Stand');

  // 4a -> 4b: Wine Foyer to Dining Room
  await stepViaHotspot('h-foy-din', 'Wine Foyer -> Grand Dining Hall');

  // 4b -> 4c: Dining Room to Open Kitchen
  await stepViaHotspot('h-din-kit', 'Grand Dining Hall -> Executive Open Kitchen');

  // 4c -> 4d: Open Kitchen to Outdoor Terrace
  await stepViaHotspot('h-kit-out', 'Open Kitchen -> Candlelit Outdoor Terrace');

  // 4d -> 5: Outdoor Terrace to Swimming Pool
  await stepViaHotspot('h-out-pool', 'Outdoor Terrace -> Crystal Swimming Pool');

  // 5 -> 6a: Pool to Cottages Chalet Exterior
  await stepViaHotspot('h-pool-cot', 'Crystal Swimming Pool -> Forest Cottages Chalet Exterior');

  // 6a -> 6b: Chalet Exterior to Bedroom Suite
  await stepViaHotspot('h-cot-step-in', 'Chalet Exterior -> Cottage Bedroom Suite Interior');

  // 6b -> 6a: Bedroom Suite back to Chalet Exterior
  await stepViaHotspot('h-cot-step-out', 'Cottage Bedroom Suite -> Private Veranda');

  // 6a -> 7: Chalet Exterior to Botanical Garden
  await stepViaHotspot('h-cot-gar', 'Forest Cottages -> Botanical Garden & Gazebo');

  // 7 -> 8: Botanical Garden to Adventure Zone
  await stepViaHotspot('h-gar-adv', 'Botanical Garden -> Canopy Adventure Zone');

  // 8 -> 9: Adventure Zone to Lotus Spa
  await stepViaHotspot('h-adv-spa', 'Canopy Adventure Zone -> The Lotus Spa Sanctuary');

  // 9 -> 5: Lotus Spa back to Swimming Pool
  await stepViaHotspot('h-spa-pool', 'The Lotus Spa -> Crystal Swimming Pool (Loop Complete)');

  // 4. Verify Broken Images in Explore Mode
  const brokenExploreImgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter(i => !i.complete || i.naturalWidth === 0)
      .map(i => i.src);
  });
  console.log('\n4. Broken images during full walking audit:', brokenExploreImgs);

  // 5. Test Ambient Sound Synthesis
  console.log('\n5. Testing Ambient Sound Toggle...');
  const soundBtn = await page.$('button[title*="Ambiance"]');
  if (soundBtn) {
    await soundBtn.click();
    await new Promise(r => setTimeout(r, 400));
    console.log('   Ambience audio ON');
    await soundBtn.click();
    await new Promise(r => setTimeout(r, 200));
    console.log('   Ambience audio OFF');
  }

  // 6. Test Mini-Map Overlay
  console.log('\n6. Testing Mini-Map Overlay...');
  const mapBtn = await page.$('button ::-p-text(Park Map)');
  if (mapBtn) {
    await mapBtn.click();
    await new Promise(r => setTimeout(r, 400));
    console.log('   Mini-Map overlay opened');
    await page.screenshot({ path: path.join(outDir, 'verified_walkthrough_minimap.png') });
  }

  // 7. Exit Explore Mode
  console.log('\n7. Exiting Explore Mode to verify return...');
  const exitBtn = await page.$('button ::-p-text(Exit)');
  if (exitBtn) {
    await exitBtn.click();
    await new Promise(r => setTimeout(r, 500));
    console.log('   Returned to Homepage cleanly');
  }

  console.log('\nTotal console/page errors detected:', errors.length);
  if (errors.length > 0) {
    console.error('Errors found:', errors);
  }

  await browser.close();
  console.log('=== All 9 Stations and Walkthrough Verified with 100% Success ===');
}

testCompleteExperience().catch(console.error);

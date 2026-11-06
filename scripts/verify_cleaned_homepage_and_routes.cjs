const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = 'C:/Users/aneka/.gemini/antigravity/brain/b96a6cf3-8cff-4e40-806a-d62501abac9f';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching Chrome to verify cleaned homepage and walking routes...');
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

  // 1. Verify Cleaned Homepage
  console.log('--- Step 1: Checking Cleaned Homepage Elements ---');
  const homepageCheck = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasParkOverviewCard = !!document.querySelector('.group.cursor-pointer[title*="overview"]') || bodyText.includes('View Full Map');
    const hasMapGuideInNavbar = Array.from(document.querySelectorAll('header nav button')).some(b => b.innerText.includes('Map Guide'));
    const hasScanQRInNavbar = Array.from(document.querySelectorAll('header button')).some(b => b.innerText.includes('Scan QR'));
    const hasParkMapGuideSection = !!document.getElementById('map-section') || bodyText.includes('Click any location to get directions');
    const hasScanForNavPanel = bodyText.includes('Scan for Navigation') || bodyText.includes('Scan this QR for directions');
    const hasGetDirectionsPanel = bodyText.includes('Get Directions & Route') || (bodyText.includes('Show Route') && bodyText.includes('Choose Destination'));

    const facilityCardsCount = document.querySelectorAll('#facilities-section .grid > div').length;
    const hasExploreCTA = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Explore Park'));

    return {
      hasParkOverviewCard,
      hasMapGuideInNavbar,
      hasScanQRInNavbar,
      hasParkMapGuideSection,
      hasScanForNavPanel,
      hasGetDirectionsPanel,
      facilityCardsCount,
      hasExploreCTA
    };
  });

  console.log('Cleaned Homepage Check:', JSON.stringify(homepageCheck, null, 2));

  // Take screenshot of Cleaned Homepage
  const hpPath = path.join(OUT_DIR, 'cleaned_01_homepage_clean_layout.png');
  await page.screenshot({ path: hpPath, fullPage: false });
  console.log('Saved Homepage screenshot:', hpPath);

  // 2. Open Explore Mode from Hero CTA
  console.log('--- Step 2: Opening Explore Mode ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Explore Park'));
    if (btn) btn.click();
  });
  await sleep(1200);

  // Check Explore Mode initial state
  const exploreInitState = await page.evaluate(() => {
    const heading = document.querySelector('h2')?.innerText || '';
    const badge = document.querySelector('header')?.innerText || '';
    const char = document.getElementById('walking-character');
    let charStyle = '';
    if (char) {
      charStyle = char.getAttribute('style') || '';
    }
    const hasNavigatorPanel = document.body.innerText.includes('Park Navigator') || document.body.innerText.includes('Select Target');
    return { heading, badge, charStyle, hasNavigatorPanel };
  });
  console.log('Explore Mode Initial State:', JSON.stringify(exploreInitState, null, 2));

  const exp1Path = path.join(OUT_DIR, 'cleaned_02_explore_mode_entrance_spawn.png');
  await page.screenshot({ path: exp1Path });
  console.log('Saved Explore Mode Entrance screenshot:', exp1Path);

  // 3. Walk from Entrance to Reception
  console.log('--- Step 3: Walking Entrance -> Reception ---');
  await page.evaluate(() => {
    const actionBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.innerText.includes('Walk') || b.innerText.includes('Follow') || b.innerText.includes('Reception')
    );
    if (actionBtn) actionBtn.click();
  });
  await sleep(800);

  // Screenshot mid-walk showing glowing trail and walking character
  const walk1Path = path.join(OUT_DIR, 'cleaned_03_walking_entrance_to_reception.png');
  await page.screenshot({ path: walk1Path });
  console.log('Saved Walking to Reception screenshot:', walk1Path);

  // Wait for arrival at Reception
  await sleep(2200);

  // 4. In Reception, walk to Restaurant
  console.log('--- Step 4: In Reception, Walking to Restaurant ---');
  const receptionState = await page.evaluate(() => {
    return {
      title: document.querySelector('h2')?.innerText || '',
      bodyExcerpt: document.body.innerText.slice(0, 300)
    };
  });
  console.log('Reception State:', receptionState.title);

  // Click Next Station / Walk to Restaurant
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => 
      b.innerText.includes('Restaurant') || b.innerText.includes('Follow') || b.innerText.includes('Walk')
    );
    if (btn) btn.click();
  });
  await sleep(800);

  const walk2Path = path.join(OUT_DIR, 'cleaned_04_walking_reception_to_restaurant.png');
  await page.screenshot({ path: walk2Path });
  console.log('Saved Walking to Restaurant screenshot:', walk2Path);

  await sleep(2200);

  // 5. In Restaurant, walk to Pool
  console.log('--- Step 5: In Restaurant, Walking to Pool ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => 
      b.innerText.includes('Pool') || b.innerText.includes('Follow') || b.innerText.includes('Swimming')
    );
    if (btn) btn.click();
  });
  await sleep(800);

  const walk3Path = path.join(OUT_DIR, 'cleaned_05_walking_restaurant_to_pool.png');
  await page.screenshot({ path: walk3Path });
  console.log('Saved Walking to Pool screenshot:', walk3Path);

  await sleep(2200);

  // 6. In Pool, check left teak deck path to Cottages
  console.log('--- Step 6: In Pool, Walking to Cottages (left teak deck) ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => 
      b.innerText.includes('Cottages') || b.innerText.includes('Chalet') || b.innerText.includes('Follow')
    );
    if (btn) btn.click();
  });
  await sleep(800);

  const walk4Path = path.join(OUT_DIR, 'cleaned_06_walking_pool_to_cottages_teak_deck.png');
  await page.screenshot({ path: walk4Path });
  console.log('Saved Walking to Cottages screenshot:', walk4Path);

  await sleep(2200);

  // 7. In Cottages, test reverse walk to Pool
  console.log('--- Step 7: In Cottages, Testing Reverse Walk to Pool ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => 
      b.innerText.includes('Swimming Pool') || b.innerText.includes('Return') || b.innerText.includes('Pool')
    );
    if (btn) btn.click();
  });
  await sleep(800);

  const revWalkPath = path.join(OUT_DIR, 'cleaned_07_reverse_walk_cottages_to_pool.png');
  await page.screenshot({ path: revWalkPath });
  console.log('Saved Reverse Walk to Pool screenshot:', revWalkPath);

  await sleep(2200);

  // 8. Exit Explore Mode and check Facility Modal interaction
  console.log('--- Step 8: Exiting Explore Mode and testing Facility Card ---');
  await page.evaluate(() => {
    const exitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Exit'));
    if (exitBtn) exitBtn.click();
  });
  await sleep(1000);

  // Click on Swimming Pool facility card
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#facilities-section .grid > div'));
    const poolCard = cards.find(c => c.innerText.includes('Swimming Pool') || c.innerText.includes('Pool'));
    if (poolCard) poolCard.click();
  });
  await sleep(800);

  const modalPath = path.join(OUT_DIR, 'cleaned_08_facility_modal_pool.png');
  await page.screenshot({ path: modalPath });
  console.log('Saved Facility Modal screenshot:', modalPath);

  await browser.close();
  console.log('All automated browser tests completed successfully!');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});


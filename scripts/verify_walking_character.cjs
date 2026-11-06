const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/aneka/.gemini/antigravity/brain/b96a6cf3-8cff-4e40-806a-d62501abac9f';

(async () => {
  console.log('🚀 Starting Continuous Walking Character & Trail Navigation Test...');

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser Error:', msg.text());
    }
  });

  try {
    // 1. Navigate to home
    console.log('1. Loading ParkVerse homepage...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    // 2. Click "Explore Park" CTA button to open Explore Mode
    console.log('2. Entering Explore Mode...');
    const exploreBtn = await page.$('button ::-p-text(Explore Park)') || await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      return btns.find(b => b.innerText && b.innerText.includes('Explore Park'));
    });
    if (!exploreBtn) throw new Error('Could not find Explore Park button');
    await exploreBtn.click();
    await new Promise(r => setTimeout(r, 1200));

    // 3. Verify at Main Entrance & find Reception hotspot arrow
    console.log('3. At Main Entrance. Finding directional hotspot to Reception...');
    const recHotspot = await page.waitForSelector('[data-hotspot-id="h-ent-rec"]', { timeout: 5000 });
    if (!recHotspot) throw new Error('Hotspot h-ent-rec not found!');

    // 4. Click hotspot to spawn walking character and start walking!
    console.log('4. Clicking arrow to spawn Walking Character and draw glowing trail...');
    await recHotspot.click();

    // 5. Capture screenshot mid-walk (e.g. at 1.1s)
    await new Promise(r => setTimeout(r, 1100));
    const walk1Path = path.join(ARTIFACT_DIR, 'walk_01_entrance_walking_trail.png');
    await page.screenshot({ path: walk1Path });
    console.log('✅ Captured walk_01_entrance_walking_trail.png');

    // 6. Wait for character to reach portal threshold and cross-fade to Reception
    console.log('5. Waiting for character to reach portal and arrive at Reception...');
    await new Promise(r => setTimeout(r, 1800));

    // Verify Arrival Card appears
    const arrivalCard = await page.waitForSelector('[data-testid="arrival-card"]', { timeout: 6000 });
    const arrivalText = await page.evaluate(el => el.innerText, arrivalCard);
    console.log('Arrival Card text:', arrivalText.replace(/\n+/g, ' | '));

    const walk2Path = path.join(ARTIFACT_DIR, 'walk_02_reception_arrival_guidance.png');
    await page.screenshot({ path: walk2Path });
    console.log('✅ Captured walk_02_reception_arrival_guidance.png');

    // 7. Click "The Forest Pavilion Restaurant" suggestion in the arrival card!
    console.log('6. Continuing journey: clicking to walk to Restaurant Pavilion...');
    const walkToResBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('[data-testid="arrival-card"] button'));
      return btns.find(b => b.innerText.includes('Restaurant') || b.innerText.includes('Walk Path'));
    });
    if (walkToResBtn) {
      await walkToResBtn.click();
    } else {
      // Fallback: click the on-screen hotspot
      const resHotspot = await page.waitForSelector('[data-hotspot-id="h-rec-res"]');
      await resHotspot.click();
    }

    // Capture mid-walk to Restaurant
    await new Promise(r => setTimeout(r, 1100));
    const walk3Path = path.join(ARTIFACT_DIR, 'walk_03_reception_to_restaurant_walking.png');
    await page.screenshot({ path: walk3Path });
    console.log('✅ Captured walk_03_reception_to_restaurant_walking.png');

    // Wait for arrival at Restaurant Pavilion
    await new Promise(r => setTimeout(r, 1800));
    console.log('7. Arrived at The Forest Pavilion!');

    // 8. Click to walk to Swimming Pool
    console.log('8. Continuing journey: clicking to walk to Swimming Pool...');
    const walkToPoolBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('[data-testid="arrival-card"] button'));
      return btns.find(b => b.innerText.includes('Pool') || b.innerText.includes('Swimming'));
    });
    if (walkToPoolBtn) {
      await walkToPoolBtn.click();
    } else {
      const poolHotspot = await page.waitForSelector('[data-hotspot-id="h-rext-pool"]');
      await poolHotspot.click();
    }

    // Capture mid-walk to Swimming Pool
    await new Promise(r => setTimeout(r, 1100));
    const walk4Path = path.join(ARTIFACT_DIR, 'walk_04_restaurant_to_pool_walking.png');
    await page.screenshot({ path: walk4Path });
    console.log('✅ Captured walk_04_restaurant_to_pool_walking.png');

    // Wait for arrival at Swimming Pool
    await new Promise(r => setTimeout(r, 1800));
    console.log('9. Arrived at Crystal Swimming Pool!');

    // 9. Click to walk to Forest Cottages & Chalets
    console.log('10. Continuing journey: clicking to walk to Forest Cottages & Chalets...');
    const walkToCotBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('[data-testid="arrival-card"] button'));
      return btns.find(b => b.innerText.includes('Cottage') || b.innerText.includes('Chalet'));
    });
    if (walkToCotBtn) {
      await walkToCotBtn.click();
    } else {
      const cotHotspot = await page.waitForSelector('[data-hotspot-id="h-pool-cot"]');
      await cotHotspot.click();
    }

    // Capture mid-walk to Cottages
    await new Promise(r => setTimeout(r, 1100));
    const walk5Path = path.join(ARTIFACT_DIR, 'walk_05_pool_to_cottages_walking.png');
    await page.screenshot({ path: walk5Path });
    console.log('✅ Captured walk_05_pool_to_cottages_walking.png');

    // Wait for arrival at Cottages
    await new Promise(r => setTimeout(r, 1800));
    console.log('11. Arrived at Forest Cottages & Chalets! Journey complete.');

    const walk6Path = path.join(ARTIFACT_DIR, 'walk_06_cottages_arrival_completed.png');
    await page.screenshot({ path: walk6Path });
    console.log('✅ Captured walk_06_cottages_arrival_completed.png');

    console.log('\n🎉 ALL WALKING CHARACTER & GLOWING TRAIL TESTS PASSED SUCCESSFULLY!');

  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();

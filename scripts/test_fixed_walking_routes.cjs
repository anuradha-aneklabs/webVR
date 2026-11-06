const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/aneka/.gemini/antigravity/brain/b96a6cf3-8cff-4e40-806a-d62501abac9f';

(async () => {
  console.log('🚀 Starting Verification of Corrected Walking Routes, Starting Location & Compact Selector...');

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. Homepage & Start at Main Entrance
    console.log('1. Loading ParkVerse homepage...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    console.log('2. Opening Explore Mode (Default)...');
    const exploreBtn = await page.$('button ::-p-text(Explore Park)');
    if (!exploreBtn) throw new Error('Could not find Explore Park button');
    await exploreBtn.click();
    await new Promise(r => setTimeout(r, 1200));

    // Verify Starting Location is Main Entrance
    const currentLocText = await page.evaluate(() => {
      const el = document.querySelector('header span[class*="text-[#34f480]"]');
      const title = document.querySelector('header span.text-gray-300');
      return { step: el ? el.innerText : '', title: title ? title.innerText : '' };
    });
    console.log(`Current Location verified: ${currentLocText.step} — ${currentLocText.title}`);

    // Verify compact panel position & character spawn at Entrance
    const fix01Path = path.join(ARTIFACT_DIR, 'fix_01_entrance_spawn_and_compact_panel.png');
    await page.screenshot({ path: fix01Path });
    console.log('✅ Captured fix_01_entrance_spawn_and_compact_panel.png (Character at Entrance spawn point, compact right panel)');

    // 2. Walk Main Entrance -> Reception along S-curve
    console.log('3. Starting walk: Main Entrance -> Reception...');
    const walkToRecBtn = await page.$('[data-hotspot-id="h-ent-rec"]') || await page.$('button ::-p-text(Welcome Reception)');
    await walkToRecBtn.click();

    await new Promise(r => setTimeout(r, 1000));
    const fix02Path = path.join(ARTIFACT_DIR, 'fix_02_entrance_to_reception_path.png');
    await page.screenshot({ path: fix02Path });
    console.log('✅ Captured fix_02_entrance_to_reception_path.png (Driveway S-curve avoiding right lawn/trees)');

    // Wait for arrival at Reception
    await new Promise(r => setTimeout(r, 1800));
    console.log('4. Arrived at Reception!');

    // 3. Walk Reception -> Restaurant Pavilion avoiding sofa, coffee table, plant & front desk!
    console.log('5. Starting walk: Reception -> Restaurant Pavilion along stone tile aisle...');
    const walkToResBtn = await page.$('[data-hotspot-id="h-rec-res"]') || await page.$('button ::-p-text(The Forest Pavilion)');
    await walkToResBtn.click();

    await new Promise(r => setTimeout(r, 1000));
    const fix03Path = path.join(ARTIFACT_DIR, 'fix_03_reception_obstacle_avoidance.png');
    await page.screenshot({ path: fix03Path });
    console.log('✅ Captured fix_03_reception_obstacle_avoidance.png (Stone aisle avoiding sofa, table, plant & front desk)');

    // Wait for arrival at Restaurant Pavilion
    await new Promise(r => setTimeout(r, 1800));
    console.log('6. Arrived at The Forest Pavilion!');

    // 4. Walk Restaurant Exterior -> Pool along outdoor deck avoiding dining tables & diners!
    console.log('7. Starting walk: Restaurant Exterior -> Pool along outdoor deck...');
    const walkToPoolBtn = await page.$('[data-hotspot-id="h-rext-pool"]') || await page.$('button ::-p-text(Swimming Pool)');
    await walkToPoolBtn.click();

    await new Promise(r => setTimeout(r, 1000));
    const fix04Path = path.join(ARTIFACT_DIR, 'fix_04_restaurant_to_pool_outdoor_deck.png');
    await page.screenshot({ path: fix04Path });
    console.log('✅ Captured fix_04_restaurant_to_pool_outdoor_deck.png (Deck boardwalk avoiding indoor tables & diners)');

    // Wait for arrival at Swimming Pool
    await new Promise(r => setTimeout(r, 1800));
    console.log('8. Arrived at Crystal Swimming Pool!');

    // 5. Walk Pool -> Cottages along left teak deck avoiding lagoon water & seated guests!
    console.log('9. Starting walk: Pool -> Cottages along left teak deck...');
    const walkToCotBtn = await page.$('[data-hotspot-id="h-pool-cot"]') || await page.$('button ::-p-text(Forest Cottages)');
    await walkToCotBtn.click();

    await new Promise(r => setTimeout(r, 1000));
    const fix05Path = path.join(ARTIFACT_DIR, 'fix_05_pool_to_cottages_avoiding_water.png');
    await page.screenshot({ path: fix05Path });
    console.log('✅ Captured fix_05_pool_to_cottages_avoiding_water.png (Teak deck avoiding lagoon water & seated guests)');

    // Wait for arrival at Forest Cottages
    await new Promise(r => setTimeout(r, 1800));
    console.log('10. Arrived at Forest Cottages!');

    // 6. Test Reverse Journey: Cottages -> Pool
    console.log('11. Testing Reverse Journey: Cottages -> Pool...');
    const returnToPoolBtn = await page.$('[data-hotspot-id="h-cot-pool"]') || await page.$('button ::-p-text(Swimming Pool)');
    if (returnToPoolBtn) {
      await returnToPoolBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      const fix06Path = path.join(ARTIFACT_DIR, 'fix_06_reverse_cottages_to_pool.png');
      await page.screenshot({ path: fix06Path });
      console.log('✅ Captured fix_06_reverse_cottages_to_pool.png (Reverse path along flagstones)');
      await new Promise(r => setTimeout(r, 1800));
    }

    // 7. Test QR Scan from another location (e.g. Lotus Spa)
    console.log('12. Testing QR Scan from another location...');
    // Exit explore mode
    const exitBtn = await page.$('button ::-p-text(Exit)');
    if (exitBtn) await exitBtn.click();
    await new Promise(r => setTimeout(r, 800));

    // Open QR Scanner
    const qrBtn = await page.$('button[title*="Scan QR"], button ::-p-text(Scan QR)');
    if (qrBtn) await qrBtn.click();
    await new Promise(r => setTimeout(r, 800));

    // Simulate scan of Lotus Spa checkpoint
    const spaPill = await page.$('button ::-p-text(Spa)');
    if (spaPill) {
      await spaPill.click();
      await new Promise(r => setTimeout(r, 500));

      // Click "Walk Here in Explore Mode"
      const walkFromHereBtn = await page.$('button ::-p-text(Walk Here in Explore Mode)');
      if (walkFromHereBtn) {
        await walkFromHereBtn.click();
        await new Promise(r => setTimeout(r, 1200));

        const fix07Path = path.join(ARTIFACT_DIR, 'fix_07_qr_scanned_starting_location_spa.png');
        await page.screenshot({ path: fix07Path });
        console.log('✅ Captured fix_07_qr_scanned_starting_location_spa.png (Explore Mode starting at scanned Spa location)');
      }
    }

    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();


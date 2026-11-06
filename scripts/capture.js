import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/aneka/Desktop/ParkVerse/screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching browser for comprehensive immersion capture...');
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Homepage at 1440x900
  console.log('1. Capturing Homepage 1440x900...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '01_homepage_desktop.png') });

  // 2. Open Fullscreen Explore Mode
  console.log('2. Capturing Fullscreen Explore Mode at Main Entrance...');
  const exploreBtn = await page.$('button ::-p-text(Explore Park)');
  if (exploreBtn) {
    await exploreBtn.click();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(outDir, '02_explore_entrance.png') });

    // Click "Park Map" button to show mini-map overlay
    console.log('3. Capturing Explore Mode with Mini-Map Overlay...');
    const mapToggleBtn = await page.$('button ::-p-text(Park Map)');
    if (mapToggleBtn) {
      await mapToggleBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(outDir, '03_explore_minimap_overlay.png') });
      await mapToggleBtn.click(); // close map
    }

    // Step to Next Location (Welcome Lounge / Reception)
    console.log('4. Capturing Explore Mode: Reception with 360 Pano...');
    const nextBtn = await page.$('button ::-p-text(Next Location)');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(outDir, '04_explore_reception.png') });

      // Toggle 360 panorama on reception
      const panoBtn = await page.$('button ::-p-text(360° Panorama)');
      if (panoBtn) {
        await panoBtn.click();
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: path.join(outDir, '05_explore_reception_360_pano.png') });
      }
    }

    // Exit Explore Mode back to homepage
    const exitBtn = await page.$('button ::-p-text(Exit Explore)');
    if (exitBtn) {
      await exitBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 5. Open Dedicated Restaurant 5-Stage Tour
  console.log('5. Capturing Restaurant 5-Stage Walkthrough Tour...');
  const restaurantCard = await page.$('::-p-text(Restaurant)');
  if (restaurantCard) {
    await restaurantCard.click();
    await new Promise(r => setTimeout(r, 1000));
    // Click "Enter Immersive Tour"
    const tourBtn = await page.$('button ::-p-text(Enter Immersive Tour)');
    if (tourBtn) {
      await tourBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }
    // Screenshot Stage 1: Exterior Deck
    await page.screenshot({ path: path.join(outDir, '06_restaurant_stage1_exterior.png') });

    // Click Next Station to Foyer Entrance
    const nextStnBtn = await page.$('button ::-p-text(Next Station)');
    if (nextStnBtn) {
      await nextStnBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(outDir, '07_restaurant_stage2_foyer.png') });

      // Click Next Station to Grand Dining Hall
      await nextStnBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(outDir, '08_restaurant_stage3_dining.png') });

      // Toggle 360 Panorama on Grand Dining Hall
      const diningPanoBtn = await page.$('button ::-p-text(Switch to 360° Pano)');
      if (diningPanoBtn) {
        await diningPanoBtn.click();
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: path.join(outDir, '09_restaurant_stage3_dining_360_pannellum.png') });
        await diningPanoBtn.click(); // switch back
      }

      // Next Station to Open Kitchen
      await nextStnBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(outDir, '10_restaurant_stage4_kitchen.png') });

      // Next Station to Outdoor Terrace
      await nextStnBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(outDir, '11_restaurant_stage5_outdoor.png') });
    }

    // Close tour
    const closeBtn = await page.$('button svg.lucide-x');
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 6. Test QR Scanner & Simulated Navigation Arrival
  console.log('6. Capturing QR Navigation Flow & Arrival...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  const scanQrBtn = await page.$('button ::-p-text(Scan QR)');
  if (scanQrBtn) {
    await scanQrBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, '12_qr_scanner_modal.png') });

    // Click demo check-in station (Restaurant)
    const stnBtn = await page.$('button ::-p-text(The Forest Pavilion)');
    if (stnBtn) {
      await stnBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(outDir, '13_qr_station_verified_and_route.png') });

      // Simulate walk and arrive
      const arriveBtn = await page.$('button ::-p-text(Simulate Walk)');
      if (arriveBtn) {
        await arriveBtn.click();
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.join(outDir, '14_destination_arrival_state.png') });
      }
    }
  }

  // 7. Mobile Viewport 390x844
  console.log('7. Capturing Mobile Viewport 390x844...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '15_mobile_homepage.png') });

  await browser.close();
  console.log('Comprehensive immersion screenshots successfully captured and saved to', outDir);
}

run().catch(console.error);

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/aneka/Desktop/ParkVerse/screenshots/verified_audit';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Starting Verified Scene Audit Capture...');
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Open Homepage
  console.log('1. Loading Homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, '01_homepage_verified.png') });

  // 2. Open Explore Mode
  console.log('2. Entering Explore Mode...');
  const exploreBtn = await page.$('button ::-p-text(Explore Park)');
  if (exploreBtn) {
    await exploreBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // 3. Capture all 9 stations in order
  const stations = [
    '01_Main_Entrance',
    '02_Welcome_Reception',
    '03_Restaurant_Exterior',
    '04_Restaurant_Dining',
    '05_Swimming_Pool',
    '06_Forest_Cottages',
    '07_Botanical_Garden',
    '08_Adventure_Zone',
    '09_Lotus_Spa'
  ];

  for (let i = 0; i < stations.length; i++) {
    const stationName = stations[i];
    console.log(`Capturing Station ${i + 1}: ${stationName}...`);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, `${stationName}.png`) });

    // If at Cottages (index 5), also capture the Suite Interior sub-view!
    if (i === 5) {
      console.log('Capturing Cottage Suite Interior sub-view...');
      const suiteTab = await page.$('button ::-p-text(Bedroom Suite)');
      if (suiteTab) {
        await suiteTab.click();
        await new Promise(r => setTimeout(r, 800));
        await page.screenshot({ path: path.join(outDir, '06b_Cottage_Bedroom_Suite.png') });
      }
    }

    // If at Restaurant Dining (index 3), also capture Open Kitchen and Outdoor Terrace!
    if (i === 3) {
      console.log('Capturing Open Kitchen sub-view...');
      const kitchenTab = await page.$('button ::-p-text(Open Kitchen)');
      if (kitchenTab) {
        await kitchenTab.click();
        await new Promise(r => setTimeout(r, 800));
        await page.screenshot({ path: path.join(outDir, '04b_Open_Kitchen.png') });
      }
      console.log('Capturing Outdoor Terrace sub-view...');
      const outdoorTab = await page.$('button ::-p-text(Outdoor Terrace)');
      if (outdoorTab) {
        await outdoorTab.click();
        await new Promise(r => setTimeout(r, 800));
        await page.screenshot({ path: path.join(outDir, '04c_Outdoor_Terrace.png') });
      }
    }

    // Advance to next station if not last
    if (i < stations.length - 1) {
      const nextBtn = await page.$('button ::-p-text(Next Station)');
      if (nextBtn) {
        await nextBtn.click();
      }
    }
  }

  // 4. Capture Mini-Map Overlay in Explore Mode
  console.log('Capturing Mini-Map Overlay...');
  const mapToggle = await page.$('button ::-p-text(Park Map)');
  if (mapToggle) {
    await mapToggle.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, '10_Explore_MiniMap_Overlay.png') });
  }

  await browser.close();
  console.log('All verified scenes successfully captured in', outDir);
}

run().catch(console.error);


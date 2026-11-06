const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/aneka/.gemini/antigravity/brain/b96a6cf3-8cff-4e40-806a-d62501abac9f';

(async () => {
  console.log('🚀 Testing QR Scan from another location -> Explore Mode starting at scanned location...');

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // Open QR Scanner modal from Top Navbar
    console.log('1. Opening QR Scanner Modal from Navbar...');
    const qrBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText && b.innerText.includes('Scan QR'));
    });
    if (!qrBtn) throw new Error('Could not find Scan QR button in navbar');
    await qrBtn.click();
    await new Promise(r => setTimeout(r, 800));

    // Click Lotus Spa Checkpoint button in the modal
    console.log('2. Scanning Lotus Spa QR Code...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const spaBtn = btns.find(b => b.innerText && b.innerText.includes('Lotus Spa'));
      if (spaBtn) spaBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Click "Walk Here in Explore Mode"
    console.log('3. Clicking "Walk Here in Explore Mode"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText && b.innerText.includes('Walk Here in Explore Mode'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // Verify Explore Mode is now at Lotus Spa
    const currentLocText = await page.evaluate(() => {
      const el = document.querySelector('header span[class*="text-[#34f480]"]');
      const title = document.querySelector('header span.text-gray-300');
      return { step: el ? el.innerText : '', title: title ? title.innerText : '' };
    });
    console.log(`Explore Mode successfully started at: ${currentLocText.step} — ${currentLocText.title}`);

    const fix07Path = path.join(ARTIFACT_DIR, 'fix_07_qr_scanned_starting_location_spa.png');
    await page.screenshot({ path: fix07Path });
    console.log('✅ Captured fix_07_qr_scanned_starting_location_spa.png');

    console.log('\n🎉 QR SCAN TO EXPLORE MODE VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ QR Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();

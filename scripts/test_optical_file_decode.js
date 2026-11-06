import puppeteer from 'puppeteer';
import path from 'path';

async function testOpticalFileDecode() {
  console.log('=== Testing Optical QR Code File Decoding in Live Browser ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Test 1: Upload PARK-RESTAURANT-04.png
  console.log('\n1. Uploading real QR code image: PARK-RESTAURANT-04.png ...');
  // Open QR modal
  const openQrBtn = await page.$('button ::-p-text(Scan QR), button[title*="Scan QR"]');
  if (openQrBtn) await openQrBtn.click();
  await new Promise(r => setTimeout(r, 600));

  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) {
    throw new Error('File input not found in QR modal!');
  }

  const qrFile1 = path.resolve('public/assets/qr/PARK-RESTAURANT-04.png');
  await fileInput.uploadFile(qrFile1);
  await new Promise(r => setTimeout(r, 1200));

  const decodedResult1 = await page.evaluate(() => {
    const title = document.querySelector('h4')?.innerText || '';
    const badge = document.querySelector('span[class*="font-mono"]')?.innerText || '';
    return { title, badge };
  });

  console.log(`   Decoded Result 1: "${decodedResult1.badge}" | "${decodedResult1.title}"`);
  const success1 = decodedResult1.badge.includes('PARK-RESTAURANT-04') && decodedResult1.title.includes('Restaurant');
  console.log(`   -> Optical Decode 1 Verified: ${success1}`);

  // Close and re-open modal for Test 2
  const closeBtn = await page.$('button[class*="w-7 h-7"]');
  if (closeBtn) await closeBtn.click();
  await new Promise(r => setTimeout(r, 400));

  // Test 2: Upload Junction QR code image: PARK-JCT-CENTRAL.png
  console.log('\n2. Uploading real Junction QR code image: PARK-JCT-CENTRAL.png ...');
  if (openQrBtn) await openQrBtn.click();
  await new Promise(r => setTimeout(r, 600));

  const fileInput2 = await page.$('input[type="file"]');
  const qrFile2 = path.resolve('public/assets/qr/PARK-JCT-CENTRAL.png');
  await fileInput2.uploadFile(qrFile2);
  await new Promise(r => setTimeout(r, 1200));

  const decodedResult2 = await page.evaluate(() => {
    const title = document.querySelector('h4')?.innerText || '';
    const badge = document.querySelector('span[class*="font-mono"]')?.innerText || '';
    return { title, badge };
  });

  console.log(`   Decoded Result 2: "${decodedResult2.badge}" | "${decodedResult2.title}"`);
  const success2 = decodedResult2.badge.includes('PARK-JCT-CENTRAL') && decodedResult2.title.includes('Central Promenade Fork');
  console.log(`   -> Optical Decode 2 Verified: ${success2}`);

  await browser.close();
  console.log('\n=== Optical QR Decoding Tests Passed: ' + (success1 && success2) + ' ===');
}

testOpticalFileDecode().catch(console.error);


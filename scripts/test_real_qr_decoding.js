import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function testRealQRDecoding() {
  console.log('Testing optical decoding of real QR codes with Html5Qrcode in Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Evaluate optical scanFile using the Html5Qrcode library loaded in the app
  const testResults = await page.evaluate(async () => {
    // Dynamically access Html5Qrcode from window or import
    const { Html5Qrcode } = await import('/node_modules/html5-qrcode/esm/index.js');
    
    // Create temporary element for scanner
    const div = document.createElement('div');
    div.id = 'temp-qr-target';
    div.style.display = 'none';
    document.body.appendChild(div);

    const scanner = new Html5Qrcode('temp-qr-target');

    const codesToTest = [
      { file: '/assets/qr/PARK-ENTRANCE-01.png', expected: 'PARK-ENTRANCE-01' },
      { file: '/assets/qr/PARK-RESTAURANT-04.png', expected: 'PARK-RESTAURANT-04' },
      { file: '/assets/qr/PARK-JCT-CENTRAL.png', expected: 'PARK-JCT-CENTRAL' },
      { file: '/assets/qr/PARK-POOL-05.png', expected: 'PARK-POOL-05' },
    ];

    const results = [];
    for (const test of codesToTest) {
      try {
        const response = await fetch(test.file);
        const blob = await response.blob();
        const file = new File([blob], 'test.png', { type: 'image/png' });
        const decoded = await scanner.scanFile(file, false);
        results.push({
          file: test.file,
          expected: test.expected,
          decoded: decoded,
          matches: decoded === test.expected
        });
      } catch (err) {
        results.push({
          file: test.file,
          expected: test.expected,
          error: err.toString(),
          matches: false
        });
      }
    }

    scanner.clear();
    div.remove();
    return results;
  });

  console.log('Real QR Code Optical Decoding Results:');
  console.dir(testResults, { depth: null });

  await browser.close();
}

testRealQRDecoding().catch(console.error);


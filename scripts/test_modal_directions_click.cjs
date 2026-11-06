const puppeteer = require('puppeteer');
const path = require('path');

const OUT_DIR = 'C:/Users/aneka/.gemini/antigravity/brain/b96a6cf3-8cff-4e40-806a-d62501abac9f';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  // Click Swimming Pool card
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#facilities-section .grid > div'));
    const poolCard = cards.find(c => c.innerText.includes('Swimming Pool'));
    if (poolCard) poolCard.click();
  });
  await sleep(600);

  // Click Get Directions inside modal
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Get Directions'));
    if (btn) btn.click();
  });
  await sleep(1200);

  // Verify Explore Mode opened with destination = Swimming Pool
  const result = await page.evaluate(() => {
    const isExploreOpen = !!document.getElementById('walking-character') || !!document.querySelector('header .truncate');
    const navigatorText = document.querySelector('.glass-card')?.innerText || document.body.innerText;
    const hasPoolAsTarget = navigatorText.includes('Swimming Pool') || navigatorText.includes('Crystal Swimming Pool');
    return { isExploreOpen, hasPoolAsTarget };
  });

  console.log('Modal Directions Click Test Result:', result);

  const shotPath = path.join(OUT_DIR, 'cleaned_09_modal_directions_to_explore_pool.png');
  await page.screenshot({ path: shotPath });
  console.log('Saved screenshot:', shotPath);

  await browser.close();
}

run().catch(console.error);


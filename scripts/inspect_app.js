import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const errors = [];
  const logs = [];

  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  console.log('Loaded. Total console errors:', errors.length);

  // Check if all images on the page load without 404
  const brokenImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs
      .filter(img => !img.complete || img.naturalWidth === 0)
      .map(img => img.src);
  });
  console.log('Broken images on Homepage:', brokenImages);

  // Test Explore Mode
  const exploreBtn = await page.$('button ::-p-text(Explore Park)');
  if (exploreBtn) {
    await exploreBtn.click();
    await new Promise(r => setTimeout(r, 600));
    console.log('Opened Explore Mode.');
  }

  const brokenExploreImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs
      .filter(img => !img.complete || img.naturalWidth === 0)
      .map(img => img.src);
  });
  console.log('Broken images in Explore Mode:', brokenExploreImages);

  await browser.close();
  console.log('Inspection complete.');
}

run().catch(console.error);


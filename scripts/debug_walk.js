import puppeteer from 'puppeteer';

async function check() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Open explore
  const exploreBtn = await page.$('button ::-p-text(Explore Park)');
  await exploreBtn.click();
  await new Promise(r => setTimeout(r, 600));

  // Jump to cottages
  const cotBtn = await page.$('button ::-p-text(Cottages)');
  await cotBtn.click();
  await new Promise(r => setTimeout(r, 600));

  const pageInfo = await page.evaluate(() => {
    const title = document.querySelector('h2')?.innerText;
    const hotspots = Array.from(document.querySelectorAll('main div.cursor-pointer')).map(el => el.innerText);
    const subTabs = Array.from(document.querySelectorAll('nav button')).map(el => el.innerText);
    return { title, hotspots, subTabs };
  });

  console.log('Page info at Cottages:', pageInfo);
  await browser.close();
}

check().catch(console.error);


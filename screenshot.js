const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://www.rishabh-upadhyay.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 15000));
  await page.screenshot({ path: '/Users/sayanpatra/Desktop/project/sayanos/screenshot.png' });
  await browser.close();
  console.log("Screenshot taken.");
})();

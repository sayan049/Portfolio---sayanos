const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to http://localhost:3002...');
  try {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.screenshot({ path: 'screenshot.png' });
    console.log('Screenshot saved to screenshot.png');
  } catch (err) {
    console.log('GOTO ERROR:', err.message);
  }

  await browser.close();
})();

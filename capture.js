const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log("Navigating to site...");
  await page.goto('https://www.rishabh-upadhyay.com/', { waitUntil: 'networkidle0', timeout: 60000 });
  
  console.log("Waiting for 10 seconds for animations to start...");
  await new Promise(r => setTimeout(r, 10000));
  
  console.log("Simulating wheel scroll...");
  const steps = 6;
  for(let i=0; i<steps; i++) {
    // Dispatch wheel event on window
    await page.mouse.wheel({ deltaY: 800 });
    await new Promise(r => setTimeout(r, 1500)); // wait for animation
    await page.screenshot({ path: `scratch/scroll_frame${i}.jpg`, quality: 80, type: 'jpeg' });
  }

  await browser.close();
  console.log("Done");
}

run();

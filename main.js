import { app } from 'electron';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import readlineSync from 'readline-sync';
import { generateUsernamesList } from './utils.js';

// Use Puppeteer stealth mode to avoid detection
puppeteer.use(StealthPlugin());

app.on('ready', async () => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
  
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

    const username = readlineSync.question('username: ');
    const password = readlineSync.question('password: ', { hideEchoBack: true });

    await page.locator('[name="username"]').fill(username);
    await page.locator('[name="password"]').fill(password);
    await page.click('[type="submit"]');
  
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
    console.log('Login initiated.');
  
    await handleTwoFactorAuthentication(page);
  
    const usernames = generateUsernamesList();
    for (const username of usernames) {
      await cancelFollowRequest(page, username);
    }
  
    await browser.close();
    console.log('Accounts unfollowed.');

    app.quit();

  } catch (error) {
    console.error('Error during automation:', error);
  }
});

async function handleTwoFactorAuthentication(page) {
    while(true) {
      console.log('Checking for 2FA');
      const currentUrl = page.url();

      if (!currentUrl.includes('challenge') && !currentUrl.includes('two_factor')) {
        console.log('Verification completed.');
        break;
      } else {
        const verificationInput = page.locator('[name="verificationCode"]');
        const securityCode = readlineSync.question('Enter the security code: ');
        await verificationInput.fill('');
        await verificationInput.fill(securityCode);
        await page.click('button[type="button"]');
      }

      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
}

async function cancelFollowRequest(page, username) {
  try {
    await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle2' });

    const requestedButton = await page.locator('text/Requested').setTimeout(500);
    await requestedButton.click();
    await new Promise(resolve => setTimeout(resolve, 300));
    await page.locator('text=Unfollow').click();
    console.log(`Follow request cancelled for ${username}`);

    // Wait to prevent detection
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.log(`No follow request found for ${username}`);
  }
}

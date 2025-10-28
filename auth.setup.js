import { chromium, expect } from '@playwright/test';
import { PATH_AFTER_LOGIN } from 'src/routes/paths';

const MAIN_URL = 'http://localhost:3030'

const AFTER_LOGIN_URL = `${MAIN_URL}${PATH_AFTER_LOGIN}`;

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(MAIN_URL + '/');
  await page.getByLabel('כתובת מייל').fill('zalmanjacob@gmail.com');
  await page.getByLabel('סיסמה').fill('123456');
  await page.getByRole('button', { name: 'כניסה' }).click();
  await expect(page).toHaveURL(page.url());
  // ודא שהגענו לדף הנכון
  await expect(page).toHaveURL(AFTER_LOGIN_URL);

  // שומר את ה-cookies + localStorage
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

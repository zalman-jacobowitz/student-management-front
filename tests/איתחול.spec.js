import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%AA%D7%91%D7%A0%D7%99%D7%95%D7%AA'


test.beforeEach(async ({ page }) => {
  // runs before each test in the file
  // go to: http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%AA%D7%91%D7%A0%D7%99%D7%95%D7%AA
  await page.goto(URL);
  console.log('beforeEach');  
});


test.describe('בסיס', () => {

    test('תלמידים', async ({ page }) => {})
    test('זמנים', async ({ page }) => {})
    test('הגדרת עמודות', async ({ page }) => {})
    
})

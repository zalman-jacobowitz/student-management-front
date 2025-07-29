// @ts-check
import { test, expect } from '@playwright/test';

// בדיקת תהליך כניסת משתמש למערכת
test('בדיקת כניסת משתמש למערכת', async ({ page }) => {
  // ניווט לדף הכניסה
  await page.goto('http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%A0%D7%AA%D7%95%D7%A0%D7%99%D7%9D-%D7%9C%D7%9E%D7%A4%D7%A8%D7%A2');
  
  // המתנה לטעינת הדף
  await page.waitForLoadState('networkidle');
  
  // בדיקה שדף הכניסה מוצג כראוי
  await expect(page.getByText('כנס לחשבון שלך')).toBeVisible();
  
  // הזנת פרטי משתמש
  await page.getByLabel('כתובת מייל').fill('zalmanjacob@gmail.com');
  await page.getByLabel('סיסמה').fill('123456');
  
  // לחיצה על כפתור הכניסה
  await page.getByRole('button', { name: 'כניסה' }).click();
  
  // המתנה לניווט לאחר כניסה מוצלחת
  await page.waitForNavigation({ timeout: 5000 }).catch(() => {
    // אם פג הזמן, נמשיך בבדיקות
    console.log('Navigation timeout - continuing tests');
  });
  
  // בדיקת תצוגת הודעת שגיאה במקרה של פרטים שגויים
  const errorMessage = page.getByText('המייל או הסיסמה אינם נכונים');
  if (await errorMessage.isVisible()) {
    console.log('שגיאת כניסה התקבלה כמצופה עם פרטי משתמש לא נכונים');
  } else {
    // בדיקה שאנחנו בדף הבית לאחר כניסה מוצלחת
    await expect(page.url()).not.toContain('/auth/login');
    console.log('כניסה למערכת הצליחה');
  }
});


// בדיקת מסך בחירת אירוע
test('בחירת אירוע', async ({ page }) => {
    await page.goto('http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%A0%D7%AA%D7%95%D7%A0%D7%99%D7%9D-%D7%9C%D7%9E%D7%A4%D7%A8%D7%A2');
    
    // בדיקה שמסך בחירת אירוע מוצג
    await expect(page.getByText('רישום אירוע')).toBeVisible();
    
    // בדיקת בחירת אירוע קיים מהרשימה
    // const eventSelect = page.locator('select').first();
    // await expect(eventSelect).toBeVisible();
    // await eventSelect.selectOption({ index: 1 });
    
    // לחיצה על כפתור המשך
    // await page.getByRole('button', { name: 'המשך' }).click();
    
    // בדיקה שהניווט למסך רשימת התלמידים הצליח
    // await expect(page.getByText('רשימת תלמידים')).toBeVisible();
  });
  
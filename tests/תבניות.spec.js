import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%AA%D7%91%D7%A0%D7%99%D7%95%D7%AA'


test.beforeEach(async ({ page }) => {
  // runs before each test in the file
  // go to: http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%AA%D7%91%D7%A0%D7%99%D7%95%D7%AA
  await page.goto(URL);
  console.log('beforeEach');  
});


test.describe('תבניות', () => {

test('הוספה', async ({ page }) => {
    
    await page.getByTestId('btn-green').click();

    await page.getByRole('textbox', { name: 'שם תבנית' }).fill('תבנית אוטומטית');
    // כפתור הבא:
    await page.getByRole('button', { name: 'הבא' }).click();
    // הוספת אירוע:
    await page.getByRole('button', { name: 'הוסף אירוע' }).click();
    // בחירת שם אירוע:
    await page.getByPlaceholder('שם האירוע').fill('שיעור אוטומטי');
    // בחירת שעה התחלה: type='time'
    await page.getByPlaceholder('תאריך התחלה').fill('09:00');
    // בחירת שעה סיום: type='time'
    await page.getByPlaceholder('תאריך סיום').fill('10:00');

    // שמירת התבנית: type='submit'
    await page.getByRole('button', { name: 'שמור שינויים' }).click();
    
    // בדיקה שנוספה תבנית חדשה במסך התבניות
    const newTemplate = page.getByText('תבנית אוטומטית');
    await expect(newTemplate).toBeVisible();

});

test('עריכה', async ({ page }) => {

    // לחיצה על כפתור עריכה של התבנית הראשונה ברשימה
    // מציאת התבנית דמה:  "תבנית אוטומטית"
    const templateToEdit = page.getByText('תבנית אוטומטית');
    await templateToEdit.getByTestId('btn-blue').click();

    // שינוי שם התבנית
    const nameInput = page.getByRole('textbox', { name: 'שם תבנית' });
    await nameInput.fill('תבנית אוטומטית - ערוכה');
    // לחיצה על הבא
    await page.getByRole('button', { name: 'הבא' }).click();
    // הוספת אירוע נוסף
    await page.getByRole('button', { name: 'הוסף אירוע' }).click();
    // מילוי פרטי האירוע החדש
    await page.getByPlaceholder('שם האירוע').last().fill('שיעור אוטומטי נוסף');
    await page.getByPlaceholder('תאריך התחלה').last().fill('10:00');
    await page.getByPlaceholder('תאריך סיום').last().fill('11:00');
    
    // שמירת השינויים
    await page.getByRole('button', { name: 'שמור שינויים' }).click();
    // בדיקה שהתבנית שונתה
    const editedTemplate = page.getByText('תבנית אוטומטית - ערוכה');
    await expect(editedTemplate).toBeVisible();

})

test('מחיקה', async ({ page }) => {    
    // לחיצה על כפתור מחיקה של התבנית הראשונה ברשימה
})

})

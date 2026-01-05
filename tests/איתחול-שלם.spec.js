import { test, expect } from '@playwright/test';

const INITIALIZATION_URL = 'http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%90%D7%99%D7%AA%D7%97%D7%95%D7%9C';
const STUDENTS_LIST_URL = 'http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%A8%D7%A9%D7%99%D7%9E%D7%94';

test.describe('תהליך איתחול המערכת', () => {
  
  test('איתחול מלא של המערכת עם קובץ DEMO.csv', async ({ page }) => {
    // שלב 1: כניסה למסך האיתחול
    console.log('שלב 1: כניסה למסך האיתחול');
    await page.goto(INITIALIZATION_URL);
    
    // בדיקת שנכנס למסך האיתחול
    const welcomeTitle = page.getByText('ברוכים הבאים');
    await expect(welcomeTitle).toBeVisible({ timeout: 5000 });
    console.log('✓ נכנס למסך האיתחול בהצלחה');

    // שלב 2: ללחוץ על כפתור הבא
    console.log('שלב 2: לחיצה על כפתור הבא');
    const nextButton = page.getByRole('button', { name: 'הבא' }).first();
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    console.log('✓ לחץ על כפתור הבא');

    // שלב 3: ללחוץ על גרר או בחר קובץ, ולבחור בקובץ: DEMO.CSV
    console.log('שלב 3: בחירת קובץ DEMO.CSV');
    
    // המתן לטעינת מסך העלאת הקובץ
    await page.waitForTimeout(1000);
    
    // חפש את אזור ההעלאה
    const uploadArea = page.locator('div[id="upload-file"]');
    await expect(uploadArea).toBeVisible({ timeout: 10000 });
    console.log('✓ נראה אזור ההעלאה');

    // מצא את input[type="file"] והעלה את הקובץ
    const fileInput = page.locator('input[type="file"]').first();
    const filePath = './tests/fixtures/DEMO.csv';
    await fileInput.setInputFiles(filePath);
    console.log('✓ הועלה קובץ DEMO.csv');

    // שלב 4: צפייה לטבלה עם תלמידים
    console.log('שלב 4: צפייה לטבלה עם תלמידים');
    
    // המתן להצגה של הטבלה עם התלמידים
    const studentTable = page.getByText('ישראל');
    await expect(studentTable).toBeVisible({ timeout: 5000 });
    console.log('✓ הטבלה עם התלמידים נטענה בהצלחה');

    // שלב 5: לחיצה על הבא
    console.log('שלב 5: לחיצה על כפתור הבא');
    const nextButton2 = page.getByRole('button', { name: 'הבא' }).first();
    await expect(nextButton2).toBeVisible();
    await nextButton2.click();
    console.log('✓ לחץ על כפתור הבא');

    // שלב 6: מלוי הטופס בשם האירוע משעה עד שעה
    console.log('שלב 6: מלוי טופס האירוע');
    
    // המתן לטעינת הטופס
    await page.waitForTimeout(500);
    
    // מלוי שם האירוע
    const eventNameInput = page.locator('input#event-name').first();
    await expect(eventNameInput).toBeVisible();
    await eventNameInput.fill('סדר א');
    console.log('✓ הוכנס שם האירוע: סדר א');

    // מלוי זמן התחלה
    const eventStartInput = page.locator('input#event-start').first();
    await expect(eventStartInput).toBeVisible();
    await eventStartInput.fill('08:00');
    console.log('✓ הוכנס זמן התחלה: 08:00');

    // מלוי זמן סיום
    const eventEndInput = page.locator('input#event-end').first();
    await expect(eventEndInput).toBeVisible();
    await eventEndInput.fill('09:30');
    console.log('✓ הוכנס זמן סיום: 09:30');

    // שלב 7: לחיצה על הבא
    console.log('שלב 7: לחיצה על כפתור הבא');
    const nextButton3 = page.getByRole('button', { name: 'הבא' }).first();
    await expect(nextButton3).toBeVisible();
    await nextButton3.click();
    console.log('✓ לחץ על כפתור הבא');

    // שלב 8: בחירת העמודות
    console.log('שלב 8: בחירת העמודות');
    
    // המתן לטעינת הטופס
    await page.waitForTimeout(500);

    // בחירה בעמודה: שם בשדה הראשון
    console.log('בחירה בעמודת שם פרטי');
    const nameColumnSelect = page.locator('#columnSelection\\.nameColumn').first();
    await expect(nameColumnSelect).toBeVisible();
    await nameColumnSelect.click();
    
    // חפש ובחר את "שם פרטי"
    let optionName = page.getByText('שם פרטי').first();
    await expect(optionName).toBeVisible({ timeout: 5000 });
    await optionName.click();
    console.log('✓ נבחרה עמודת שם פרטי');

    // בחירה בעמודה: משפחה בשדה השני
    console.log('בחירה בעמודת משפחה');
    const familyColumnSelect = page.locator('#columnSelection\\.familyColumn').first();
    await expect(familyColumnSelect).toBeVisible();
    await familyColumnSelect.click();
    
    // חפש ובחר את "משפחה"
    let optionFamily = page.getByText('משפחה').first();
    await expect(optionFamily).toBeVisible({ timeout: 5000 });
    await optionFamily.click();
    console.log('✓ נבחרה עמודת משפחה');

    // בחירה בעמודה: דואל בשדה השלישי (accessibleColumn)
    console.log('בחירה בעמודה נגישה (דואל)');
    const accessibleColumnSelect = page.locator('#columnSelection\\.accessibleColumn').first();
    await expect(accessibleColumnSelect).toBeVisible();
    await accessibleColumnSelect.click();
    
    // חפש ובחר את "דואל"
    let optionAccessible = page.getByText('דואל').first();
    await expect(optionAccessible).toBeVisible({ timeout: 5000 });
    await optionAccessible.click();
    console.log('✓ נבחרה עמודה נגישה (דואל)');

    // בחירה בעמודות לפילטרים נגישים (עד 2)
    console.log('בחירה בעמודות לפילטרים נגישים');
    const filterColumnsInput = page.locator('input[name="columnSelection.filterColumns"]').first();
    await expect(filterColumnsInput).toBeVisible();
    await filterColumnsInput.click();
    
    // בחור את "עיר" כעמודה ראשונה לפילטר
    let optionCity = page.getByText('עיר').first();
    await expect(optionCity).toBeVisible({ timeout: 5000 });
    await optionCity.click();
    console.log('✓ נבחרה עמודת עיר לפילטרים');

    // סגור את הלחצן של הפילטרים
    await filterColumnsInput.click();

    // בחירה בעמודות למציאת כפילויות
    console.log('בחירה בעמודות למציאת כפילויות');
    const duplicateColumnsInput = page.locator('input[name="columnSelection.duplicateColumns"]').first();
    await expect(duplicateColumnsInput).toBeVisible();
    await duplicateColumnsInput.click();
    
    // בחור את "דואל" כעמודה למציאת כפילויות
    let optionEmail = page.getByText('דואל').first();
    await expect(optionEmail).toBeVisible({ timeout: 5000 });
    await optionEmail.click();
    console.log('✓ נבחרה עמודת דואל למציאת כפילויות');

    // סגור את הלחצן של הכפילויות
    await duplicateColumnsInput.click();

    // שלב 9: לחיצה על שמור
    console.log('שלב 9: לחיצה על כפתור שמור');
    
    // המתן קצר לחידוש הממשק
    await page.waitForTimeout(500);
    
    // חפש כפתור שמור / סיום
    const saveButton = page.getByRole('button', { name: /שמור|סיום/ }).first();
    await expect(saveButton).toBeVisible({ timeout: 5000 });
    await saveButton.click();
    console.log('✓ לחץ על כפתור שמור');

    // שלב 10: צפייה להעברה לעמוד רשימת התלמידים
    console.log('שלב 10: צפייה להעברה לעמוד הרשימה');
    
    // המתן להעברה לעמוד הרשימה
    await page.waitForURL(STUDENTS_LIST_URL, { timeout: 15000 });
    console.log('✓ התבצע ניתוב לעמוד רשימת התלמידים בהצלחה');

    // בדיקה נוספת - ודא שנמצא בעמוד הרשימה
    const studentsList = page.getByText(/תלמידים|Student/i);
    await expect(studentsList).toBeVisible({ timeout: 5000 });
    console.log('✓ המערכת אותחלה בהצלחה!');
  });
});

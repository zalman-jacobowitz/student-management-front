import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%A8%D7%A9%D7%99%D7%9E%D7%94';

// Field labels
const FIELD_LABELS = {
  firstName: 'שם פרטי',
  lastName: 'משפחה',
  class: 'שיעור',
  email: 'אימייל',
};

// Test data for adding a student
const STUDENT_DATA = {
  add: {
    firstName: 'ישראל',
    lastName: 'ישראלי',
    class: 'א',
    email: 'israel@example.com',
  },
  edit: {
    firstName: 'שון',
    lastName: 'שוניביץ',
    class: 'א',
    email: 'edited@example.com',
  },
};

// Helper function to fill a form field
async function fillField(page, fieldLabel, value) {
  const field = page.getByLabel(fieldLabel).last();
  await expect(field).toBeVisible();
  await field.fill(value);
}

test.beforeEach(async ({ page }) => {
  // runs before each test in the file
  // go to: http://localhost:3030/%D7%A0%D7%99%D7%94%D7%95%D7%9C/%D7%A8%D7%A9%D7%99%D7%9E%D7%94
  await page.goto(URL);
});

test.describe('תלמידים', () => {

test('הוספה', async ({ page }) => {

  // 2. תצפה להצגה של כפתור ההוספה הירוק
  const addButton = page.getByTestId('add-button');
  await expect(addButton).toBeVisible();
  // 3. תלחץ עליו
  await addButton.click();
  // 4. תצפה לשדות ותמלא כל אחד מהם במשהו:
  // | תזהה על ידי פלייסהולדר 
  // הדפס את רשימת השדות בטופס

  await fillField(page, FIELD_LABELS.firstName, STUDENT_DATA.add.firstName);
  await fillField(page, FIELD_LABELS.lastName, STUDENT_DATA.add.lastName);
  await fillField(page, FIELD_LABELS.class, STUDENT_DATA.add.class);
  await fillField(page, FIELD_LABELS.email, STUDENT_DATA.add.email);

  // שמירת התלמיד
  const saveButton = page.getByRole('button', { name: 'עדכן' }).last();
  await expect(saveButton).toBeVisible();
  await saveButton.click();
  // יציאה מהדיאלוג: כפתור עדכן לא מופיע:
  await expect(saveButton).toBeHidden();
  // 6. תצפה לתצוגה של התלמיד ברשימת התלמידים

  const newStudent = page.getByText(STUDENT_DATA.add.lastName).first();
  await expect(newStudent).toBeVisible();
  
  /*
  +---------------------------------------------|                                
2. תצפה להצגה של כפתור ההוספה הירוק 
V

3. תלחץ עליו

4. תצפה לשדות ותמלא כל אחד מהם במשהו:
  | תזהה על ידי פלייסהולדר 

5. תצפה להודעת עידכון בהצלחה
  | על ידי זיהוי של הטקסט של ההתראה

6. תצפה לתצוגה של התלמיד ברשימת התלמידים
  | על ידי זיהוי של השם ברשימה ומספר התלמידים

+-------------------------------------------------

  */

});

test('עריכה', async ({ page }) => {
/*

לשנות נתונים על תלמיד מסויים.

- עבור לדף הרשימה של התלמידים
- תצפה להצגה של תלמיד מסויים
- תלחץ על כפתור העריכה
- תצפה לשדות ותמלא כל אחד מהם במשהו
- תצפה להודעת עידכון בהצלחה
- תצפה לתצוגה של התלמיד ברשימת התלמידים

*/
  // לחץ על כפתור עריכה מהירה לפי הARIA-LABEL: <button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium rtl-19d7u6i-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button" aria-label="עריכה מהירה" data-mui-internal-clone-element="true">flex

  const editButton = page.locator('button[aria-label="עריכה מהירה"]').first();
  await expect(editButton).toBeVisible();
  await editButton.click();

   // 4. תצפה לשדות ותמלא כל אחד מהם במשהו:
  // | תזהה על ידי פלייסהולדר 
  await fillField(page, FIELD_LABELS.firstName, STUDENT_DATA.edit.firstName);
  await fillField(page, FIELD_LABELS.lastName, STUDENT_DATA.edit.lastName);
  await fillField(page, FIELD_LABELS.class, STUDENT_DATA.edit.class);
  await fillField(page, FIELD_LABELS.email, STUDENT_DATA.edit.email);

  // שמירת התלמיד
  const saveButton = page.getByRole('button', { name: 'עדכן' }).last();
  await expect(saveButton).toBeVisible();
  await saveButton.click();
  // יציאה מהדיאלוג: כפתור עדכן לא מופיע:
  await expect(saveButton).toBeHidden();
  // 6. תצפה לתצוגה של התלמיד ברשימת התלמידים

  const newStudent = page.getByText(STUDENT_DATA.edit.lastName).first();
  await expect(newStudent).toBeVisible();

});

test('מחיקה', async ({ page }) => {
/*
מחיקה של תלמיד.
- תלחץ על כפתור בחירת התלמידים: <input class="PrivateSwitchBase-input rtl-1m9pwf3" id="1021-H" type="checkbox" data-indeterminate="false">
- תצפה לכפתור מחיקה אדום למעלה: <button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorPrimary MuiIconButton-sizeMedium rtl-2srmw9-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button" aria-label="מחק" data-mui-internal-clone-element="true">flex
- תלחץ עליו
- תצפה למספר התלמידים שהקטן ב1

מספר התלמידים זה האלמנט: <p class="MuiTablePagination-displayedRows rtl-fojknx-MuiTablePagination-displayedRows">1–6 of 333</p>
*/

  const rowsInfoBefore = page.locator('.MuiTablePagination-displayedRows').first();
  await expect(rowsInfoBefore).toBeVisible();
  const textBefore = await rowsInfoBefore.textContent();
  const matchBefore = textBefore?.match(/of (\d+)/);
  if (matchBefore) {
    const countBefore = parseInt(matchBefore[1], 10);
  }
  else {
    throw new Error('Could not parse number of students before');
  }
  // תלחץ על כפתור בחירת התלמידים: <input class="PrivateSwitchBase-input rtl-1m9pwf3" id="1021-H" type="checkbox" data-indeterminate="false">
  // אם הוא נמצא תחת class: MuiTableRow-root
  const selectCheckbox = page.locator('tr.MuiTableRow-root').first().locator('input[type="checkbox"]').first();
  await expect(selectCheckbox).toBeVisible();
  await selectCheckbox.check();
  // תצפה לכפתור מחיקה אדום למעלה: <button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorPrimary MuiIconButton-sizeMedium rtl-2srmw9-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button" aria-label="מחק" data-mui-internal-clone-element="true">flex
  const deleteButton = page.locator('button[aria-label="מחק"]').first();
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
// אישור המחיקה בדיאלוג
  const confirmButton = page.getByText('אישור').last();
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();

  // תצפה למספר התלמידים שהקטן ב1
  const rowsInfo = page.locator('.MuiTablePagination-displayedRows').first();
  await expect(rowsInfo).toBeVisible();
  const textAfter = await rowsInfo.textContent();
  const matchAfter = textAfter?.match(/of (\d+)/);
  if (matchAfter) {
    const countAfter = parseInt(matchAfter[1], 10);
    const countBefore = parseInt(matchBefore[1], 10);
    await page.waitForTimeout(5000);
    expect(countAfter).toBe(countBefore - 1);
  }
  else {
    throw new Error('Could not parse number of students after');
  }
});

});

test.describe('ייבוא תלמידים', () => {

test('ייבוא', async ({ page }) => {
  // ייבוא של תלמידים חדשים:
  
  // לחיצה על כפתור ייבוא
  const importButton = page.getByTestId('import-button');
  await expect(importButton).toBeVisible();
  await importButton.click();

  // העלה קובץ
  // 'upload-placeholder'
  const uploadPlaceholder = page.getByTestId('upload-placeholder');
  await expect(uploadPlaceholder).toBeVisible();

  // העלאת קובץ לדראג אנד דרופ
  // שימוש בsetInputFiles
  const filePath = './tests/fixtures/students-import.xlsx';
  const fileInput = uploadPlaceholder.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  // המתן להודעת הצלחה
  const successAlert = page.getByTestId('upload-success-alert');
  await expect(successAlert).toBeVisible({ timeout: 10000 });
  
  // עבור לחלק הבא של התאמת עמודות
  const nextButton = page.getByRole('button', { name: 'הבא' }).last();
  await expect(nextButton).toBeVisible();
  await nextButton.click();

  // שליחת הטופס: submit - לפי סוג הכפתור
  const submitButton = page.getByRole('button', { name: 'שמור שינויים' }).last();
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  // המתן להודעת הצלחה
  const rowsInfo = page.locator('.MuiTablePagination-displayedRows').first();
  await expect(rowsInfo).toBeVisible();
  const text = await rowsInfo.textContent();
  const matchLength = text?.match(/of (\d+)/);
  // max time for update to happen
  await page.waitForTimeout(10000);
  if (matchLength) {
    const countAfter = parseInt(matchLength[1], 10);
    expect(countAfter).toBe(4);
  }
})

test('כפילות', async ({ page }) => {
  // ייבוא של תלמידים חדשים עם כפילויות:
});

test('פורמט לא תקין', async ({ page }) => {
  // ייבוא של תלמידים חדשים עם פורמט לא תקין:
});

test('הגדרת שמות עמודות', async ({ page }) => {
  // הגדרת שמות עמודות

});

});
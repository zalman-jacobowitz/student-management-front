    // טסט מקיף למסך הכנסת נתונים - Playwright Test
// נבדק את כל זרימות העבודה של רישום נוכחות

import { test, expect } from "@playwright/test";

const URL = 'http://localhost:3030/ניהול/הכנסת-נתונים';

// test until 60 seconds
test.setTimeout(60000);

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  // המתנה לטעינת הדף הראשי
  await expect(page.getByText('רישום אירוע')).toBeVisible({ timeout: 60000 });
});

// ========== טסטים עיקריים ==========

test('זרימה מלאה: יצירת אירוע חדש ורישום נוכחות', async ({ page }) => {
  // שלב 1: וידוא טעינת הדף
  await expect(page.getByText('רישום אירוע')).toBeVisible();
  await expect(page.getByText('בחר אירוע לרישום')).toBeVisible();
  
  // שלב 2: בחירת תאריך עברי
  await page.getByTestId('hebrew-date-picker').click();
  // בחירת יום זמין ראשון בלוח השנה העברי
  await page.getByTestId('hebrew-date-picker-day-7').click();
  
  // שלב 3: בחירת אירוע מהרשימה
  const eventSelect = page.getByTestId('event-select');
  await expect(eventSelect).toBeVisible();
  await eventSelect.click();
  // בחירת האירוע הראשון ברשימה
  await page.getByRole('option').first().click();
  
  // שלב 4: התחלת רישום
  await page.getByTestId('start-registration').click();
  
  // שלב 5: המתנה לטעינת רשימת תלמידים
  await expect(page.getByTestId('student-list')).toBeVisible({ timeout: 10000 });
  
  // שלב 6: בדיקת הצגת הסיכום הראשוני
  await expect(page.getByTestId('נוכחים-count')).toBeVisible();
  await expect(page.getByTestId('חסרים-count')).toBeVisible();
  await expect(page.getByTestId('מתוך-count')).toBeVisible();
  
  // שלב 7: סימון כמה תלמידים כנוכחים
  const studentButtons = page.getByTestId('student-list').locator('button');
  const studentCount = await studentButtons.count();
  
  if (studentCount > 0) {
    // סימון 3 תלמידים ראשונים (או פחות אם אין מספיק)
    const studentsToMark = Math.min(3, studentCount);
    for (let i = 0; i < studentsToMark; i++) {
      await studentButtons.nth(i).click();
      await page.waitForTimeout(500); // המתנה קצרה בין לחיצות
    }
    
    // שלב 8: בדיקת שינוי במספרי הסיכום
    const presentCount = await page.getByTestId('נוכחים-count').textContent();
    expect(presentCount).toContain(studentsToMark.toString());
    
    // שלב 9: שמירת השינויים
    await page.getByTestId('update-button').click();
    
    // שלב 10: בדיקת הודעת הצלחה
    await expect(page.getByText('העדכון הצליח!')).toBeVisible({ timeout: 5000 });
  } else {
    // במקרה של "לא נמצאו תלמידים"
    await expect(page.getByText('לא נמצאו תלמידים')).toBeVisible();
  }
});

test('זרימת בחירת אירוע קיים ועריכה', async ({ page }) => {
  // שלב 1: לחיצה על "בחר אירוע קיים"
  await page.getByTestId('existing-events-button').click();
  
  // שלב 2: המתנה למסך טעינה
  await expect(page.getByTestId('loading-event-list')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('loading-event-list')).not.toBeVisible({ timeout: 10000 });
  
  // בדיקה אם יש אירועים קיימים או מצב ריק
  const hasEvents = await page.getByTestId('event-list').isVisible().catch(() => false);
  const isEmpty = await page.getByText('אין אירועים קודמים').isVisible().catch(() => false);
  
  if (hasEvents) {
    // שלב 4: בחירת אירוע מהרשימה
    await page.getByTestId('event-list-item').first().click();
    
    // שלב 5: התחלת רישום
    await page.getByTestId('start-registration').click();
    
    // שלב 6: וידוא מעבר למסך רישום
    await expect(page.getByTestId('student-list')).toBeVisible({ timeout: 10000 });
    
    // שלב 7: בדיקת שהנתונים נטענו מהאירוע הקיים
    const presentCount = await page.getByTestId('נוכחים-count').textContent();
    expect(presentCount).toMatch(/\d+/);
  } else if (isEmpty) {
    // וידוא הצגת מצב ריק
    await expect(page.getByText('אין אירועים קודמים')).toBeVisible();
  }
});

test('פונקציונליות העתק והדבק', async ({ page }) => {
  // יצירת אירוע ראשון
  await page.getByTestId('existing-events-button').click();
  
  // שלב 2: המתנה למסך טעינה
  await expect(page.getByTestId('loading-event-list')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('loading-event-list')).not.toBeVisible({ timeout: 10000 });
  
  // בדיקה אם יש אירועים קיימים או מצב ריק
  const hasEvents = await page.getByTestId('event-list').isVisible().catch(() => false);
  const isEmpty = await page.getByText('אין אירועים קודמים').isVisible().catch(() => false);
  
  if (hasEvents) {
    // שלב 4: בחירת אירוע מהרשימה
    await page.getByTestId('event-list-item').first().click();
    
    // שלב 5: התחלת רישום
    await page.getByTestId('start-registration').click();
    
    // שלב 6: וידוא מעבר למסך רישום
    await expect(page.getByTestId('student-list')).toBeVisible({ timeout: 10000 });
    
    // שלב 7: בדיקת שהנתונים נטענו מהאירוע הקיים
    const prevCount = await page.getByTestId('נוכחים-count').textContent();
    
    await expect(page.getByTestId('student-list')).toBeVisible({ timeout: 10000 });
  
    // העתקת הנתונים
    await page.getByText('העתק').first().click();
    await expect(page.getByText('הנתונים הועתקו בהצלחה')).toBeVisible({ timeout: 5000 });

    // חזרה למסך הראשי
    await page.getByText('חזור').first().click();
    await expect(page.getByText('רישום אירוע')).toBeVisible();
    
    // יצירת אירוע חדש
    await page.getByTestId('hebrew-date-picker').click();
    await page.getByTestId('hebrew-date-picker-day-8').click();
    await page.getByTestId('event-select').click();
    await page.getByRole('option').last().click(); // בחירת אירוע אחר
    await page.getByTestId('start-registration').click();
    
    await expect(page.getByTestId('student-list')).toBeVisible({ timeout: 10000 });
    
    // הדבקת הנתונים
    await page.getByText('הדבק').first().click();
    await expect(page.getByText('הנתונים הודבקו בהצלחה')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('העתק').first()).toBeVisible({ timeout: 5000 }); 
    // בדיקה שאותה כמות תלמידים נוכחים
    const presentCount = await page.getByTestId('נוכחים-count').textContent();
    expect(presentCount).toContain(prevCount);
  }
});


test('השפעת מחיקה והוספה של איורע לרשימה', async ({ page }) => {
  
  // בדיקת אורך הרשימה של אירועים הקיימים
  await page.getByTestId('existing-events-button').click();
  await expect(page.getByText('טוען אירועים...')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('טוען אירועים...')).not.toBeVisible({ timeout: 10000 });
  const eventsList = page.getByTestId('prev-events-count')
  const prevEventsCount = await eventsList.textContent();


  
  await page.getByText('ביטול').click();
  // יצירת אירוע
  
  await page.getByTestId('start-registration').click();
  await expect(page.getByTestId('student-list')).toBeVisible({ timeout: 10000 });
  
  // סימון תלמיד אחד
  const studentButtons = page.getByTestId('student-list').locator('button');
  const studentCount = await studentButtons.count();
  
  if (studentCount > 0) {
    await studentButtons.first().click();
    
    // שמירה
    await page.getByTestId('update-button').click();
    await expect(page.getByText('העדכון הצליח!')).toBeVisible({ timeout: 5000 });
    

    await page.getByText('חזור').click();
    await page.getByTestId('existing-events-button').click();

    await expect(page.getByText(`נמצאו ${Number(prevEventsCount) + 1} אירועים קודמים`)).toBeVisible();

    // כניסה למסך הרישום:
    await page.getByText('ביטול').click();
    await page.getByTestId('start-registration').click();


    // מחיקת האירוע
    await page.getByTestId('actions-menu').click();
    await page.getByText('מחק').click();
    await expect(page.getByText('העדכון הצליח!')).toBeVisible({ timeout: 5000 });
     
    // חזרה למסך הראשי
    await page.getByText('חזור').click();
    
    // בדיקת היעדר האירוע ברשימת האירועים הקיימים
    await page.getByTestId('existing-events-button').click();    
    await expect(page.getByText(`נמצאו ${Number(prevEventsCount)} אירועים קודמים`)).toBeVisible();

  }
});

// ========== טסטי פילטרים וחיפוש ==========

test('פונקציונליות פילטרים וחיפוש', async ({ page }) => {
  // יצירת אירוע עם נתונים
  await page.getByTestId('hebrew-date-picker').click();
  await page.getByTestId('hebrew-date-picker-day-10').click();
  await page.getByTestId('event-select').click();
  await page.getByRole('option').first().click();
  await page.getByTestId('start-registration').click();
  
  await expect(page.getByTestId('student-list')).toBeVisible({ timeout: 10000 });
  
  // בדיקת פילטר "סדר לפי"
  await page.getByTestId('sort-select').click();
  await page.getByText('סדר עולה').click();
  
  await page.getByTestId('sort-select').click();
  await page.getByText('סדר יורד').click();
  
  await page.getByTestId('sort-select').click();
  await page.getByText('שם פרטי').click();
  
  // בדיקת פילטר "הצג רק"
  await page.getByTestId('filter-select').click();
  await page.getByText('נוכחים').click();
  
  await page.getByTestId('filter-select').click();
  await page.getByText('חסרים').click();
  
  await page.getByTestId('filter-select').click();
  await page.getByText('מאחרים').click();
  
  await page.getByTestId('filter-select').click();
  await page.getByText('הכל').click();
  
  // בדיקת חיפוש
  const searchInput = page.getByTestId('search-input');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('תלמיד');
  await page.waitForTimeout(1000); // המתנה לביצוע החיפוש
  
  await searchInput.clear();
});

// ========== בדיקות validation ושגיאות ==========

test('בדיקת validation לטפסים', async ({ page }) => {
  // ניסיון שליחה ללא בחירת אירוע
  await page.getByTestId('start-registration').click();
  
  // בדיקת הודעות שגיאה
  const eventError = page.getByText('חובה לבחור סדר!');
  const dayError = page.getByText('חובה להכניס יום');
  
  // אחת מהשגיאות צריכה להופיע
  const hasEventError = await eventError.isVisible().catch(() => false);
  const hasDayError = await dayError.isVisible().catch(() => false);
  
  expect(hasEventError || hasDayError).toBeTruthy();
});

test('בדיקת מצבים ריקים', async ({ page }) => {
  // בדיקת מצב ללא אירועים
  await page.getByTestId('existing-events-button').click();
  await expect(page.getByText('טוען אירועים...')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('טוען אירועים...')).not.toBeVisible({ timeout: 10000 });
  
  // בדיקה שמופיע מצב ריק או רשימת אירועים
  const hasEvents = await page.getByTestId('event-list').isVisible().catch(() => false);
  const isEmpty = await page.getByText('אין אירועים קודמים').isVisible().catch(() => false);
  
  expect(hasEvents || isEmpty).toBeTruthy();
});

// ========== בדיקות ניווט ==========

test('בדיקת ניווט בין מסכים', async ({ page }) => {
  // מעבר למסך אירועים קיימים
  await page.getByTestId('existing-events-button').click();
  await expect(page.getByText('עריכת אירועים קודמים')).toBeVisible();
  
  // סגירת החלון
  await page.keyboard.press('Escape');
  await expect(page.getByText('רישום אירוע')).toBeVisible();
  
  // מעבר למסך רישום
  await page.getByTestId('hebrew-date-picker').click();
  await page.getByTestId('hebrew-date-picker-day-11').click();
  await page.getByTestId('event-select').click();
  await page.getByRole('option').first().click();
  await page.getByTestId('start-registration').click();
  
  await expect(page.getByTestId('student-list')).toBeVisible({ timeout: 10000 });
  
  // חזרה למסך הראשי
  await page.getByTestId('back-button').click();
  await expect(page.getByText('רישום אירוע')).toBeVisible();
});


/**
 * דוגמאות לשימוש בפונקציות מיון וסינון
 * (קובץ זה מוצג לצורכי הבנה בלבד - לא משמש בהרצה)
 */

import {
  applySorting,
  filterByStatus,
  filterBySearch,
  applyAllFilters,
  applySortingAndFiltering,
  SortType,
  FilterType,
  FilterState,
} from './insert-data-handlers';

// ========================================================================
// דוגמאות מיון
// ========================================================================

// דוגמה 1: מיון עולה
const studentsAscending = applySorting(students, 'עולה');
// תוצאה: [{ primary: 'אביב' }, { primary: 'בית' }, { primary: 'גלית' }]

// דוגמה 2: מיון יורד
const studentsDescending = applySorting(students, 'יורד');
// תוצאה: [{ primary: 'גלית' }, { primary: 'בית' }, { primary: 'אביב' }]

// דוגמה 3: מיון לפי שם
const studentsByName = applySorting(students, 'שם');
// תוצאה: ממויין לפי שם מלא (שם + משפחה)

// ========================================================================
// דוגמאות סינון
// ========================================================================

// דוגמה 4: סינון נוכחים בלבד
const presentStudents = filterByStatus(students, 'true');
// תוצאה: רק תלמידים עם data === 1

// דוגמה 5: סינון חסרים בלבד
const absentStudents = filterByStatus(students, 'false');
// תוצאה: רק תלמידים עם data === 0 וללא איחור

// דוגמה 6: סינון מאחרים בלבד
const lateStudents = filterByStatus(students, 'late');
// תוצאה: רק תלמידים שיש להם delay

// דוגמה 7: כל התלמידים (ללא סינון)
const allStudents = filterByStatus(students, 'all');
// תוצאה: כל התלמידים

// ========================================================================
// דוגמאות חיפוש
// ========================================================================

// דוגמה 8: חיפוש לפי שם
const searchResults = filterBySearch(students, 'משה');
// תוצאה: כל התלמידים שהשם שלהם מכיל 'משה'

// דוגמה 9: חיפוש ריק (מחזיר את כל התלמידים)
const noFilter = filterBySearch(students, '');
// תוצאה: כל התלמידים

// ========================================================================
// דוגמאות סינון משולב
// ========================================================================

// דוגמה 10: סינון לפי סטטוס וחיפוש ביחד
const filters: FilterState = {
  data: 'true', // נוכחים בלבד
  search: 'משה', // שמות המכילות 'משה'
};
const filtered = applyAllFilters(students, filters);
// תוצאה: תלמידים שנוכחים וגם שמם מכיל 'משה'

// ========================================================================
// דוגמאות מיון וסינון משולב
// ========================================================================

// דוגמה 11: סינון ואז מיון
const sortType: SortType = 'שם';
const result = applySortingAndFiltering(students, sortType, filters);
// תוצאה:
// 1. קודם סוננו לפי: נוכחים וחיפוש 'משה'
// 2. אח"כ ממויינו לפי שם

// ========================================================================
// דוגמא מציאותית בקומפוננטה
// ========================================================================

/*
function StudentList({ students, sortType, filters }) {
  // שלב 1: סינון מלא
  let processedData = applyAllFilters(students, filters);
  
  // שלב 2: מיון
  processedData = applySorting(processedData, sortType);
  
  // שלב 3: הצגה
  return (
    <div>
      {processedData.map(student => (
        <StudentCard key={student.student_id} student={student} />
      ))}
    </div>
  );
}
*/

// ========================================================================
// דוגמא לטיפול ברכיב RegularSelect
// ========================================================================

/*
<RegularSelect
  label="סדר לפי"
  onChange={(value) => {
    // value יהיה: 'עולה' | 'יורד' | 'שם'
    const sorted = applySorting(students, value as SortType);
    updateDisplay(sorted);
  }}
  options={[
    { label: 'סדר עולה', value: 'עולה' },
    { label: 'סדר יורד', value: 'יורד' },
    { label: 'שם פרטי', value: 'שם' },
  ]}
/>

<RegularSelect
  label="הצג רק"
  onChange={(value) => {
    // value יהיה: 'true' | 'false' | 'late' | 'all'
    setFilters(prev => ({ ...prev, data: value as FilterType }));
  }}
  options={[
    { label: 'נוכחים', value: 'true' },
    { label: 'חסרים', value: 'false' },
    { label: 'מאחרים', value: 'late' },
    { label: 'הכל', value: 'all' },
  ]}
/>

<RegularSearch
  onChange={(searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }}
/>
*/

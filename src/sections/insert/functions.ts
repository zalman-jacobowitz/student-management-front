import { InfoStudent } from "src/serverTypes";
import { orderBy } from 'lodash';

/**
 * 
 * @param infoStudents 
 * @returns Array of student IDs
 */
export const get_students_ids = (infoStudents: any[]): string[] => infoStudents.map((student) => student.student_id);


/**
 * 
 * @param getColumns 
 * @param row 
 * @returns 
 */
export function description(getColumns: any[], row: any): { primary: string; secondary: string } {
    const primary = getColumns.filter(e => e.group_name === 'primary').map(e => e.name)
    const primaryValue = primary.map(e => row[e]).join(' ')
    const secondary = getColumns.filter(e => e.group_name === 'secondary').map(e => e.name)
    const secondaryValue = secondary.map(e => row[e]).join(' ')
    return {
      primary: primaryValue,
      secondary: secondaryValue
    }
}

export const getDesc = (student: InfoStudent, desc: string[]): string => desc.map(e => student ? student[e] : '').join(' ')

export function descriptionColumns(getColumns: any[]): { primary: string[]; secondary: string[] } {
  const primary = getColumns.filter(e => e.group_name === 'primary').map(e => e.name)
  const secondary = getColumns.filter(e => e.group_name === 'secondary').map(e => e.name)
  return {
    primary,
    secondary
  }
}

export function insertTemplate(infoStudents: any[], selectedEvent: any): any[] {
    if (infoStudents.length && selectedEvent) {

        return infoStudents.map((item) => ({
            ...item,
            ...selectedEvent,
            data: false,
          }))
        };
    return [];    
}

export function changeBool(newData: any[]): any[] {
  // for base screen
  return newData.map((item) => ({...item, data: item.data? "100": "0"}))
}


export function formValues(tamplateData: any[]): Record<string, boolean> {
  return Object.fromEntries(tamplateData.map((item) => [item.student_id, !!item.data]))
}


// ============================================================
// סידור (Sorting) functions
// ============================================================

type SortOrder = 'עולה' | 'יורד' | 'שם';

/**
 * מיין נתונים לפי קריטריון נתון
 * @param data - מערך הנתונים לסידור
 * @param sortBy - סוג הסידור: 'עולה' (ascending), 'יורד' (descending), 'שם' (by name)
 * @returns מערך הנתונים המסודר
 */
export function sortStudents(data: any[], sortBy: SortOrder): any[] {
  if (!data || data.length === 0) return data;

  switch (sortBy) {
    case 'עולה':
      return orderBy(data, ['שם'], ['asc']);
    case 'יורד':
      return orderBy(data, ['שם'], ['desc']);
    case 'שם':
      return orderBy(data, ['שם', 'משפחה'], ['asc', 'asc']);
    default:
      return data;
  }
}

// ============================================================
// סינון (Filtering) functions
// ============================================================

type FilterStatus = 'true' | 'false' | 'late' | 'all';

/**
 * סנן נתונים לפי סטטוס נוכחות
 * @param data - מערך הנתונים לסינון
 * @param status - סטטוס: 'true' (נוכחים), 'false' (חסרים), 'late' (מאחרים), 'all' (הכל)
 * @returns מערך הנתונים המסוננים
 */
export function filterByAttendanceStatus(data: any[], status: FilterStatus): any[] {
  if (!data || data.length === 0) return data;
  if (status === 'all') return data;

  return data.filter((student) => {
    if (status === 'true') {
      return Number(student.data) === 1 && !student.delay && !student.reason;
    }
    if (status === 'false') {
      return Number(student.data) === 0 && !student.delay && !student.reason;
    }
    if (status === 'late') {
      return student.delay || student.delay_id;
    }
    return true;
  });
}

/**
 * סנן נתונים לפי חיפוש טקסט (שם ומשפחה)
 * @param data - מערך הנתונים לסינון
 * @param searchText - טקסט החיפוש
 * @returns מערך הנתונים המסוננים
 */
export function filterBySearch(data: any[], searchText: string): any[] {
  if (!data || data.length === 0 || !searchText) return data;

  const lowerSearchText = searchText.toLowerCase().trim();
  return data.filter((student) => {
    const fullName = `${student.שם || ''} ${student.משפחה || ''}`.toLowerCase();
    return fullName.includes(lowerSearchText);
  });
}

/**
 * סנן נתונים לפי עמודה מותאמת אישית
 * @param data - מערך הנתונים לסינון
 * @param filters - אובייקט סינונים (key = שם עמודה, value = ערך סינון)
 * @returns מערך הנתונים המסוננים
 */
export function filterByCustomColumns(data: any[], filters: Record<string, any>): any[] {
  if (!data || data.length === 0 || Object.keys(filters).length === 0) {
    return data;
  }

  return data.filter((student) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;

      const studentValue = student[key];
      
      // בדיקה לפי סוג הערך
      if (typeof value === 'boolean') {
        return studentValue === value;
      }
      if (typeof value === 'number') {
        return studentValue === value || String(studentValue).includes(String(value));
      }
      if (typeof value === 'string') {
        return String(studentValue).toLowerCase().includes(String(value).toLowerCase());
      }
      if (Array.isArray(value)) {
        return value.includes(studentValue);
      }
      
      return true;
    });
  });
}

/**
 * החל סינון וסידור מלא על הנתונים
 * @param data - מערך הנתונים
 * @param filters - אובייקט סינונים (status, search, customFilters וכו')
 * @param sortBy - סוג הסידור
 * @returns מערך הנתונים המסוננים והמסודרים
 */
export function applyFiltersAndSort(
  data: any[],
  filters: Record<string, any> = {},
  sortBy: SortOrder = 'עולה'
): any[] {
  let result = data;

  // החל סינון לפי סטטוס נוכחות
  if (filters.status) {
    result = filterByAttendanceStatus(result, filters.status);
  }

  // החל סינון לפי חיפוש
  if (filters.search) {
    result = filterBySearch(result, filters.search);
  }

  // החל סינון מותאם אישית (עמודות נוספות)
  const customFilters = { ...filters };
  delete customFilters.status;
  delete customFilters.search;
  if (Object.keys(customFilters).length > 0) {
    result = filterByCustomColumns(result, customFilters);
  }

  // החל סידור
  if (sortBy) {
    result = sortStudents(result, sortBy);
  }

  return result;
}
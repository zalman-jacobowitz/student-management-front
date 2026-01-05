/**
 * פונקציות למיון וסינון נתוני התלמידים במסך הרישום
 */

/**
 * סוגי המיון הזמינים
 */
export type SortType = 'עולה' | 'יורד' | 'שם';

/**
 * סוגי הסינון הזמינים
 */
export type FilterType = 'true' | 'false' | 'late' | 'all';

/**
 * ממשק לשמירת מצב הסינון החיפוש
 */
export interface FilterState {
  data?: FilterType;
  search?: string;
  [key: string]: any;
}

/**
 * ממשק לשמירת מצב המיון
 */
export interface SortState {
  type: SortType;
}

// ========================================================================
// פונקציות מיון
// ========================================================================

/**
 * ממיין את הנתונים בסדר עולה לפי השדה המבוקש
 * @param data - מערך התלמידים
 * @param field - השדה שיש למיין לפיו
 * @returns מערך ממויין בסדר עולה
 */
export const sortAscending = (data: any[], field: string = 'primary'): any[] => {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal, 'he');
    }
    return 0;
  });
};

/**
 * ממיין את הנתונים בסדר יורד לפי השדה המבוקש
 * @param data - מערך התלמידים
 * @param field - השדה שיש למיין לפיו
 * @returns מערך ממויין בסדר יורד
 */
export const sortDescending = (data: any[], field: string = 'primary'): any[] => {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return bVal.localeCompare(aVal, 'he');
    }
    return 0;
  });
};

/**
 * ממיין את הנתונים לפי שם התלמיד (שם ומשפחה)
 * @param data - מערך התלמידים
 * @returns מערך ממויין לפי שם
 */
export const sortByName = (data: any[]): any[] => {
  return [...data].sort((a, b) => {
    const aName = `${a.primary} ${a.secondary}`;
    const bName = `${b.primary} ${b.secondary}`;
    return aName.localeCompare(bName, 'he');
  });
};

/**
 * מיישמת את הפונקציה הנכונה לפי סוג המיון המבוקש
 * @param data - מערך התלמידים
 * @param sortType - סוג המיון
 * @returns מערך ממויין
 */
export const applySorting = (data: any[], sortType: SortType): any[] => {
  switch (sortType) {
    case 'עולה':
      return sortAscending(data);
    case 'יורד':
      return sortDescending(data);
    case 'שם':
      return sortByName(data);
    default:
      return data;
  }
};

// ========================================================================
// פונקציות סינון
// ========================================================================

/**
 * סינון לפי סטטוס נוכחות (נוכחי/חסר/מאחר)
 * @param data - מערך התלמידים
 * @param filterType - סוג הסינון
 * @returns מערך מסונן
 */
export const filterByStatus = (data: any[], filterType: FilterType): any[] => {
  if (filterType === 'all') {
    return data;
  }
  
  if (filterType === 'true') {
    // נוכחים - כאלה שיש להם data=1 וללא איחור או אישור
    return data.filter(
      (student) => student.data === 1 || student.data === '1'
    );
  }
  
  if (filterType === 'false') {
    // חסרים - כאלה שיש להם data=0 וללא איחור או אישור
    return data.filter(
      (student) => (student.data === 0 || student.data === '0') && !student.delay && !student.reason
    );
  }
  
  if (filterType === 'late') {
    // מאחרים - כאלה שיש להם delay
    return data.filter((student) => student.delay);
  }
  
  return data;
};

/**
 * סינון לפי שם התלמיד (חיפוש טקסט)
 * @param data - מערך התלמידים
 * @param searchTerm - מחרוזת החיפוש
 * @returns מערך מסונן
 */
export const filterBySearch = (data: any[], searchTerm: string): any[] => {
  if (!searchTerm || searchTerm.trim() === '') {
    return data;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  return data.filter((student) => {
    const fullName = `${student.primary || ''} ${student.secondary || ''}`;
    return fullName.toLowerCase().includes(term);
  });
};

/**
 * מיישמת את הסינון המלא לפי כל הפילטרים
 * @param data - מערך התלמידים
 * @param filters - אובייקט עם כל הפילטרים
 * @returns מערך מסונן
 */
export const applyAllFilters = (data: any[], filters: FilterState): any[] => {
  let result = [...data];
  
  // סינון לפי סטטוס נוכחות
  if (filters.data) {
    result = filterByStatus(result, filters.data);
  }
  
  // סינון לפי חיפוש טקסט
  if (filters.search) {
    result = filterBySearch(result, filters.search);
  }
  
  return result;
};

// ========================================================================
// פונקציות משולבות
// ========================================================================

/**
 * מיישמת את המיון והסינון ביחד
 * @param data - מערך התלמידים
 * @param sortType - סוג המיון
 * @param filters - אובייקט עם כל הפילטרים
 * @returns מערך ממויין ומסונן
 */
export const applySortingAndFiltering = (
  data: any[],
  sortType: SortType,
  filters: FilterState
): any[] => {
  // קודם מסננים, אח"כ ממיינים
  let result = applyAllFilters(data, filters);
  result = applySorting(result, sortType);
  return result;
};

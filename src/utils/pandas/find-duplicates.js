// יצירת מפתח יחודי לכל שורה בטבלה פונקציה שמקבלת שורה ומחזירה מפתח יחודי
const createKey = (record, columns) => columns.map((col) => record[col]).join('|');


/**
 * 
 * @param {Array} table1 - טבלה ראשונה
 * @param {Array} table2 - טבלה שנייה
 * @param {Array} columns - העמודות של הטבלה
 * @returns {Array} - השורות שמופיעות בשתי הטבלות
 * 
  */
export function findDuplicates({table1, table2, columns}) {
    
    const recordMap = new Map();
    table1.forEach((record) => recordMap.set(createKey(record, columns), true));
    return table2.filter((record) => recordMap.has(createKey(record, columns)));
    // מחזירה את השורות שמופיעות בשתי הטבלות
};
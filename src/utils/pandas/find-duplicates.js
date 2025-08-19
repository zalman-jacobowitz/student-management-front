
// פונקציה ליצירת מפתח ייחודי מהשדות הנבחרים
function createKey(record, columns) {
  return columns.map(col => record[col]).join('|');
}

// בדיקת כפילות בתוך טבלה אחת
export function findInternalDuplicates(table, columns) {

  const seen = [];
  const duplicates = [];
  
  table.forEach((record, index) => {
    const key = createKey(record, columns);
    console.log('Checking record:', record, 'with key:', key);
    if (seen.includes(key)) {
      duplicates.push(
        `ישנה כפילות של הערך: ${JSON.stringify(columns.map(col => record[col]))} בשורה ${index + 1}`
      );
    } else {

      seen.push(key);
    }
  });

  return duplicates;
}

// בדיקת כפילות בין שתי טבלאות
export function findDuplicates({table1, table2, columns}) {
  const recordMap = new Map();
  table1.forEach((record) => recordMap.set(createKey(record, columns), true));
  return table2.filter((record) => recordMap.has(createKey(record, columns)));
}
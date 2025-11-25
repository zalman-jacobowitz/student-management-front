

export function transformKeys({table, keyMapping}) {
    // הפונקציה מקבלת את טבלת התלמידים שעלתה.
    // ואת הקשר השמות של העמודות של מה צריך להיות ומה קיים בטבלה שהועלתה
    // לדוגמא: [{'שם פרטי': 'שם'}, {'שם משפחה': 'משפחה'}]
    

    // בדיקה שהטבלה לא ריקה
    if (!table?.length) return [];
    
    // יצירת מיפוי מפותחות למפתחות מקוריים.
    const reverseMapping = {};
    Object.entries(keyMapping).forEach(([newKey, originalKey]) => {
      reverseMapping[originalKey] = newKey;
    });

    // מעבד את כל התלמידים בטבלה ומחליפ את המפתחות בהתאם למיפוי המפותח
    return table.map(student => {
      const transformedStudent = { ...student };
      Object.keys(student).forEach(originalKey => {
        const matchingNewKey = reverseMapping[originalKey];
        if (matchingNewKey && matchingNewKey !== originalKey) {
          transformedStudent[matchingNewKey] = student[originalKey];
          delete transformedStudent[originalKey];
        }
      });
      // מחזיר את התלמיד המופנה
      return transformedStudent;
    });
  };

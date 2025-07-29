export const columnsDetails = [
  { 
    name: 'שם', 
    label: 'שם פרטי',
    onError: (row) => {
      if (!row.שם) {
        return 'שם פרטי חסר';
      }
      return null;
    }
  },
  {
    name: 'משפחה', 
    label: 'שם משפחה',
    onError: (row) => {
      if (!row.משפחה) {
        return 'שם משפחה חסר';
      }
      return null;
    }
  },
  { 
    name: 'מין', 
    label: 'מגדר',
    onError: (row) => {
      if (!row.מין) {
        return 'מגדר חסר';
      }
      return null;
    }
  },
  { 
    name: 'שנת_לידה', 
    label: 'שנת לידה',
    unique: true,
    onError: (row) => {
      if (!row.שנת_לידה) {
        return 'שנת לידה חסרה';
      }
      if (!/^\d{4}$/.test(row.שנת_לידה)) {
        return 'שנת לידה לא תקינה';
      }
      return null;
    }
  },
  { 
    name: 'מספר_טלפון', 
    label: 'מספר טלפון',
    onError: (row) => {
      if (!row.מספר_טלפון) {
        return 'מספר טלפון חסר';
      }
      return null;
    }
  },
  { 
    name: 'דואל', 
    label: 'דואר אלקטרוני',
    unique: true,
    onError: (row) => {
      if (row.דואל && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.דואל)) {
        return 'כתובת אימייל לא תקינה';
      }
      if (!row.דואל) {
        return 'כתובת דואר אלקטרוני חסרה';
      }
      return null;
    }
  },
  { 
    name: 'כתובת_מגורים', 
    label: 'כתובת מגורים',
    onError: (row) => {
      if (!row.כתובת_מגורים) {
        return 'כתובת מגורים חסרה';
      }
      return null;
    }
  },
  { 
    name: 'ארץ_לידה', 
    label: 'ארץ לידה',
    onError: (row) => {
      if (!row.ארץ_לידה) {
        return 'ארץ לידה חסרה';
      }
      return null;
    }
  },
  { 
    name: 'ארץ_לידה_הורים', 
    label: 'ארץ לידה של ההורים',  
    onError: (row) => {
      const currentYear = new Date().getFullYear();
      const birthYear = Number(row.שנת_לידה);
      const isMinor = birthYear >= currentYear - 18;
      
      if (!row.ארץ_לידה_הורים && isMinor) {
        return 'מתחת גיל 18 (שנת לידה מעל 2006 לא כולל) חובה לציין ארץ לידת הורה.';
      }
      return null;
    }
  },
  {
    'name': 'בן_מתחת_גיל_18',
    'label': 'בן מתחת לגיל 18',
    'onError': (row) => {
      const currentYear = new Date().getFullYear();
      const birthYear = Number(row.שנת_לידה);
      const isMinor = (currentYear - birthYear) >= 36
      
      if (isMinor && !row.בן_מתחת_גיל_18) {
        return `מעל גיל 36 (שנת לידה לפני 1990 לא כולל) חובה לציין אם יש לו בן מתחת לגיל 18.`;
      }
      return null;
    }
  }
];

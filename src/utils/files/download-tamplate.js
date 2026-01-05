// excel:
import * as XLSX from 'xlsx';

// Function to generate and download a template Excel file
export function downloadTemplateExcel(){
    // Define the columns for the template
    const columns = ['משפחה', 'מספר טלפון', 'מייל'];
    
    // Create an example data row (optional)
    const exampleRow = ['ישראלי', '0501234567', 'example@mail.com'];
    
    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([columns, exampleRow]);
    
    // Set RTL direction for better Hebrew support
    ws['!dir'] = 'rtl';
    
    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "תלמידים");
    
    // Write and download the file
    XLSX.writeFile(wb, "template.xlsx");
  };

// csv: 

export function downloadTemplateCSV(){
    const columns = ['משפחה', 'מספר_טלפון', 'מייל'];
    const example = ['ישראלי','0501234567','example@mail.com'];
    const csvContent = [columns.join(','), example.join(',')].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



/**
 * ייצוא נתונים לקובץ CSV
 * תומך בעברית ובקידודים אחרים באמצעות UTF-8 BOM
 * @param {Array} data - מערך של אובייקטים לייצוא
 * @param {Array} headers - כותרות העמודות
 * @param {string} filename - שם הקובץ להורדה
 */
export function exportDataToCSV(data, headers, filename = 'export.csv') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // בניית שורת הכותרות
  const headerRow = headers.map(header => `"${header}"`).join(',');

  // בניית שורות הנתונים
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // טיפול בערכים המכילים פסיקים או מרכאות
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return typeof value === 'string' ? `"${value}"` : `"${value || ''}"`;
    }).join(',');
  });

  // שילוב הכותרות והנתונים
  const csvContent = [headerRow, ...dataRows].join('\r\n');

  // הוספת UTF-8 BOM (Byte Order Mark) לתמיכה בעברית ותווים מיוחדים
  // זה מבטיח שExcel יתעמת עם הטקסט בעברית בצורה נכונה
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  // יצירה והורדת הקובץ
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function downloadTemplate(typeFile){
  if (typeFile === 'excel') {
    downloadTemplateExcel();
  } else if (typeFile === 'csv') {
    downloadTemplateCSV();
  }
}
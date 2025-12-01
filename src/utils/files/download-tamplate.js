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



export function downloadTemplate(typeFile){
  if (typeFile === 'excel') {
    downloadTemplateExcel();
  } else if (typeFile === 'csv') {
    downloadTemplateCSV();
  }
}
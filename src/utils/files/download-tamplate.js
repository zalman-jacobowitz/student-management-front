// excel:
import * as XLSX from 'xlsx';

import { columnsDetails } from "src/utils/uinqe_usege/columnsValid";

// Function to generate and download a template Excel file
export function downloadTemplateExcel(){
    // Define the columns for the template
    const columns = columnsDetails.map(col => col.name);
    
    // Create an example data row (optional)
    const exampleRow = ['ישראל', 'ישראלי', 'זכר', '1990', '0501234567', 'example@mail.com', 
                         'רחוב העצמאות 1, תל אביב', 'ישראל', 'פולין', 'כן'];
    
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
    const columns = columnsDetails.map(col => col.name);
    const example = ['ישראל','ישראלי','זכר','1990','0501234567','example@mail.com','רחוב העצמאות 1','ישראל','פולין'];
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
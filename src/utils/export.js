import * as XLSX from 'xlsx';

// Helper function for exporting data to Excel
export function exportToExcel(data, fileName = "export_data.xlsx") {
  if (!data) return;
  // Create worksheet from the data
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Set RTL direction for better Hebrew support
  ws['!dir'] = 'rtl';
  
  // Set column width based on content
  const columnWidths = {};
  // Examine all keys for the first row
  if (data.length > 0) {
    Object.keys(data[0]).forEach(key => {
      // Find maximum content length for this column
      const maxLength = Math.max(
        key.length,
        ...data.map(row => String(row[key] || "").length)
      );
      // Set width with some padding
      columnWidths[key] = { wch: Math.min(maxLength + 2, 30) }; // Max width 30 chars
    });
  }
  
  // Apply column widths
  ws['!cols'] = Object.values(columnWidths);
  
  // Create a workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "נתונים");
  
  // Write and download the file
  XLSX.writeFile(wb, fileName);
  
}

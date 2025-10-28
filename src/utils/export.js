import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

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



export async function exportToPDF(tableId, fileName = "export_data.pdf", title = "טבלת נתונים") {
  try {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // תפיסת הכותרות והגוף בנפרד
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // כותרת
    pdf.setFontSize(16);
    pdf.text(title, pageWidth / 2, 15, { align: 'center' });
    
    // צילום הכותרות
    const headerCanvas = await html2canvas(thead, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    const headerImg = headerCanvas.toDataURL('image/png');
    const headerHeight = (headerCanvas.height * (pageWidth - 20)) / headerCanvas.width;
    
    // מיקומים
    let currentY = 25;
    const maxY = pageHeight - 20;
    let pageNum = 1;
    
    // הוספת כותרות לעמוד ראשון
    pdf.addImage(headerImg, 'PNG', 10, currentY, pageWidth - 20, headerHeight);
    currentY += headerHeight + 2;
    
    // הוספת שורות
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < rows.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const rowCanvas = await html2canvas(rows[i], {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const rowImg = rowCanvas.toDataURL('image/png');
      const rowHeight = (rowCanvas.height * (pageWidth - 20)) / rowCanvas.width;
      
      // בדיקה אם צריך עמוד חדש
      if (currentY + rowHeight > maxY) {
        pdf.addPage();
        // eslint-disable-next-line no-plusplus
        pageNum++;
        currentY = 15;
        
        // הוספת כותרות בעמוד החדש
        pdf.addImage(headerImg, 'PNG', 10, currentY, pageWidth - 20, headerHeight);
        currentY += headerHeight + 2;
      }
      
      // הוספת השורה
      pdf.addImage(rowImg, 'PNG', 10, currentY, pageWidth - 20, rowHeight);
      currentY += rowHeight;
    }
    
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
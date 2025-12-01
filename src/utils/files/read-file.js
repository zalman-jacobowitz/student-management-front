import * as XLSX from 'xlsx';

import { fileType } from "./file-type";

// excel
export function parseExcel(file, fileData){
  const fileDataArray = new Uint8Array(fileData);
      try {
        const workbook = XLSX.read(fileDataArray, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          return {status: 'error', message: 'הקובץ ריק'};
        }
        
        // First row as columns
        const columns = jsonData[0].map(col => String(col).trim());
        
        // Rest of the rows as data
        const data = [];
        for (let i = 1; i < jsonData.length; i += 1) {
          const row = {};
          jsonData[i].forEach((value, index) => {
            if (index < columns.length) {
              row[columns[index]] = value !== undefined ? String(value).trim() : '';
            }
          });
          data.push(row);
        }
        
        return {status: 'success', data: {columns, data}};
      } catch (error) {
        console.error('שגיאה בניתוח קובץ Excel:', error);
        return {status: 'error', message: error};
        
      }
  };


// csv:


// Helper function to parse CSV data
function parseCSV(file, fileData){

  // eslint-disable-next-line consistent-return
    try { 
      const text = fileData;
      console.log({text})
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return {status: 'error', message: 'הקובץ ריק'};
      const [headerLine, ...rows] = lines;
      console.log({lines})
      const columns = headerLine.split(',').map(col => col.trim());
      const data = rows.map(line => {
        const values = line.split(',');
        const row = {};
        columns.forEach((col, i) => { row[col] = (values[i]||'').trim(); });
        return row;
      });
      return {status: 'success', data: {columns, data}};
    } catch (err) {
      console.error('שגיאה בפענוח CSV:', err);
      return {status: 'error', message: err};
    }
  };

export function readFile({fileDetils, types=['excel', 'csv'], fileData}){
    const type = fileType(fileDetils)

    if (!types.includes(type)) {
        return {status: 'error', message: 'נא להעלות קובץ Excel (.xlsx, .xls) או CSV בלבד.'};
    }
    const parser = type === 'excel' ? parseExcel : parseCSV;

    const data = parser(fileDetils, fileData)

    if (data.status === 'error') {
        return {status: 'error', message: data.message};
    }
    return {status: 'success', data: data.data};
}
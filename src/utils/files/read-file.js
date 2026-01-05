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
function parseCSV(file, fileData) {
  try {
    const text = new TextDecoder().decode(new Uint8Array(fileData));
    const lines = text.trim().split(/\r?\n/).filter(line => line.trim());
    
    if (!lines.length) {
      return { status: 'error', message: 'הקובץ ריק' };
    }
    
    // Find the "Running B" line which marks the start of the second table
    const secondTableIndex = lines.findIndex(line => 
      line.trim().startsWith('Running B') || line.includes('Date')
    );
    
    if (secondTableIndex === -1) {
      // If no second table found, use the first table
      const [headerLine, ...rows] = lines;
      const columns = headerLine.split(',').map(col => col.trim());
      
      const data = rows.map(line => {
        const values = line.split(',');
        const row = {};
        columns.forEach((col, i) => {
          row[col] = cleanValue(values[i] || '');
        });
        return row;
      });
      
      return { status: 'success', data: { columns, data } };
    }
    
    // Get the lines starting from the second table
    const secondTableLines = lines.slice(secondTableIndex);
    const [headerLine, ...rows] = secondTableLines;
    const columns = headerLine.split(',').map(col => col.trim());
    
    const data = rows.map(line => {
      const values = line.split(',');
      const row = {};
      columns.forEach((col, i) => {
        row[col] = cleanValue(values[i] || '');
      });
      return row;
    }).filter(row => Object.values(row).some(val => val)); // Filter out empty rows
    
    return { status: 'success', data: { columns, data } };
  } catch (err) {
    console.error('שגיאה בפענוח CSV:', err);
    return { status: 'error', message: err };
  }
}

// Helper function to clean CSV values
function cleanValue(value) {
  return value
    .trim()
    .replace(/^["']|["']$/g, '') // Remove surrounding quotes
    .replace(/\\"/g, '"') // Remove escaped quotes
    .trim();
}

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
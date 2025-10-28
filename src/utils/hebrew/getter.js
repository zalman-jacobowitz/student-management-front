import hebrewData from './hebrew.json';

/**
 * 
 * @param {string} day -  
 * @returns {string}
 */

export function readHebrewJson(day) {
    // Convert date to YYYY-MM-DD format if it's a Date object
    let dateStr;
    if (day instanceof Date) {
        dateStr = day
    } else if (typeof day === 'string') {
        // If it's already a string, make sure it's in YYYY-MM-DD format
        const parts = day.split('-');
        if (parts.length === 3) {
            // Assume it's already in the correct format
            dateStr = day;
        } else {
            // Try to parse and format
            const parsedDate = new Date(day);
            if (!Number.isNaN(parsedDate.getTime())) {
                dateStr = parsedDate.toISOString().split('T')[0];
            } else {
                console.error('Invalid date format:', day);
                return null;
            }
        }
    } else {
        console.error('Invalid date type:', day);
        return null;
    }
    
    // Find the matching date in the Hebrew data
    const hebrewInfo = hebrewData.find(item => item.יום === dateStr);
    
    return hebrewInfo || null;
}

/**
 * Gets Hebrew date information for a specific day
 * @param {Date|string} day - Date object or string in format YYYY-MM-DD
 * @returns {Object|null} - Hebrew date information in the format:
 * {
 *   "יום": "YYYY-MM-DD",
 *   "יום_בשבוע": "יום בשבוע",
 *   "יום_עברי": "א׳-ל׳",
 *   "חודש_עברי": "חודש עברי",
 *   "שנה_עברית": "שנה עברית",
 *   "פרשת_השבוע": "פרשת השבוע"
 * } or null if not found
 */

function describeHebrew(day){
    const today = new Date();
        const dateToCheck = new Date(day);
        // מחזיר: היום אתמול לפני X ימים 
        const diffTime = today - dateToCheck;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'היום';
        if (diffDays === 1) return 'אתמול';
        if (diffDays === 2) return 'לפני יומיים';
        if (diffDays === 7) return 'שבוע שעבר';
        if (diffDays <= 7) return `לפני ${diffDays} ימים`;
        if (diffDays <= 30) {
            const weeks = Math.ceil(diffDays / 7);
            return `לפני ${weeks} שבועות`;
        }
        const months = Math.ceil(diffDays / 30);
        if (months === 1) return 'לפני חודש';
        if (months === 2) return 'לפני חודשיים';
        if (months <= 13) return `שנה שעברה`;
        return `לפני ${months} חודשים`;
}


export function inHebrew(day, full=false, desc=false) {
    const hebrewJson = readHebrewJson(day);
    if (desc){
        return describeHebrew(day);
    }
    if (full === 'Dm'){
        return `${hebrewJson?.יום_עברי} ${hebrewJson?.חודש_עברי}`;
    }
    if (full === 'Dms'){
     return `${hebrewJson?.יום_בשבוע} ${hebrewJson?.יום_עברי} ${hebrewJson?.חודש_עברי}`;
    }
    if (full) {
        return `${hebrewJson?.יום_בשבוע} ${hebrewJson?.יום_עברי}  ${hebrewJson?.חודש_עברי} - ${hebrewJson?.שנה_עברית}`;
    }

    return hebrewJson;
}

 

export function getElul(index){
    const hebrewJson = getAllYear();
    const elul = hebrewJson.filter(item => item.חודש_עברי === "אלול");
    const dat = elul[index -1]
    return {
        day: dat.יום,
        full: `${dat.יום_עברי} ${dat.חודש_עברי}`
    }
}

/**
 * Gets all Hebrew date information for a specific Hebrew year
 * @param {string} year - Hebrew year (default: "תשפ״ה")
 * @returns {Array<Object>} - Array of Hebrew date information objects for the specified year
 */
export function getAllYear(year="תשפ״ה") {
    return hebrewData.filter(item => item.שנה_עברית === year);
}
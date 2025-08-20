/* eslint-disable no-bitwise */

// ----------------------------------------------------------------------

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    
    return v.toString(16);
  });
}

export function shortId() {
 const digits = Math.floor(Math.random() * 900) + 100; // 100-999
 const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // ללא O, I
 const letter = letters[Math.floor(Math.random() * letters.length)];
 
 return `${digits}-${letter}`;
}
// דוגמה: "5271"

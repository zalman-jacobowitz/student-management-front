/*
 * needs:
  * TYPE SAFETY ISSUES / בעיות TYPE SAFETY:
  * 1. No TypeScript interfaces for copy-paste button props / אין ממשקי TypeScript לפרופס כפתורי העתקה והדבקה
  * 2. Missing type definitions for previousData array / אין הגדרות טיפוס למערך previousData
  * 3. Untyped callback functions for onCopy and onPaste / פונקציות callback לא מוגדרות לטיפוס עבור onCopy ו-onPaste
  * 4. No validation for button click events / אין ולידציה לאירועי לחיצת כפתור
  * 5. No type safety for button icons / אין בטיחות טיפוסים לאייקוני הכפתורים
 */


import { RegularButton } from "src/components/form-elements";

interface CopyPasteButtonsProps {
  onCopy?: () => void;
  onPaste?: () => void;
  previousData?: any[];
}

export function CopyPasteButtons({
    onCopy = () => {},
    onPaste = () => {},
    previousData = []
}: CopyPasteButtonsProps) {
  return (
    <>
      { !previousData.length && (
        <RegularButton onClick={onCopy} icon="solar:copy-bold">העתק</RegularButton>
      )}
      { previousData.length > 0 && (
        <RegularButton onClick={onPaste} icon="solar:board">הדבק</RegularButton>
      )}
    </>
  );
}

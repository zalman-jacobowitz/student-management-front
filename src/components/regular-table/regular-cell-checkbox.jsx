import { Checkbox, TableCell } from "@mui/material";
/**
 * תא טבלה שמציג תיבת סימון
 * 
 * @param {CellCheckboxProps} props - פרמטרים של הפונקציה
 * @param {string} props.id - מזהה התלמיד
 * @param {boolean} props.checked - האם התלמיד נבחר
 * @param {() => void} props.onClick - פונקציה שיופעלת בעת בחירת התלמיד
 * 
 * @returns {JSX.Element} תא טבלה שמציג תיבת סימון
 * 
 * @example
 * <CellCheckbox
 *   id="123"
 *   checked={true}
 *   onClick={() => console.log("תלמיד נבחר")}
 * />
 * 
 */

export function CellCheckbox({ id, checked, onClick }) {
  return (
    <TableCell padding="checkbox">

      <Checkbox
        className="no-print"
        id={id}
        checked={checked}
        onClick={onClick}
      />
    </TableCell>
  )
}


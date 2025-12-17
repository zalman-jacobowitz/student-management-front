/**
 * Drag and Drop Functions for Column Reordering
 * מסמך נפרד שמכיל את הלוגיקה של סדר העמודות
 */

import { InfoColumn } from "src/serverTypes";
import { toast } from "sonner";
import { infoColumnsUpdate } from "src/actions/info_columns";
import { QueryClient } from "@tanstack/react-query";

/**
 * סוג נתונים לקטגוריית DnD (מגביל את ה-id)
 */
export type SortableColumnId = string & { readonly __brand: "SortableColumnId" };

/**
 * יצירת Branded Type עבור column IDs
 */
export const createSortableId = (columnName: string): SortableColumnId => {
  return columnName as SortableColumnId;
};

/**
 * מחזירה את הערך של column ID (הסרת הbranding)
 */
export const getSortableIdValue = (id: SortableColumnId): string => {
  return id as unknown as string;
};

/**
 * מיקום עמודה לפי אינדקס
 * מחזירה את האינדקס של העמודה בתוך המערך
 */
export function getColumnIndex(columns: InfoColumn[], columnId: SortableColumnId): number {
  return columns.findIndex((col) => col.name === getSortableIdValue(columnId));
}

/**
 * החלפת מקום שתי עמודות
 * חילוף מקום בין שתי עמודות בתוך המערך
 */
export function reorderColumns(
  columns: InfoColumn[],
  activeIndex: number,
  overIndex: number
): InfoColumn[] {
  if (activeIndex === overIndex) {
    return columns;
  }

  const reordered = Array.from(columns);
  const [movedColumn] = reordered.splice(activeIndex, 1);
  reordered.splice(overIndex, 0, movedColumn);

  return reordered;
}

/**
 * חישוב המיקום החדש עבור עמודה בעת גרירה
 */
export function getNewColumnIndex({
  id,
  items,
  activeIndex,
  overIndex,
}: {
  id: SortableColumnId;
  items: InfoColumn[];
  activeIndex: number;
  overIndex: number;
}): number {
  return reorderColumns(items, activeIndex, overIndex).findIndex(
    (col) => col.name === getSortableIdValue(id)
  );
}

/**
 * חישוב סדר עמודות חדש על בסיס סדר המערך
 * מוסיף priority שדה לכל עמודה בהתאם למיקום שלה
 */
export function calculateColumnOrder(columns: InfoColumn[]): InfoColumn[] {
  return columns.map((column, index) => ({
    ...column,
    order: index,
  }));
}

/**
 * שמירת סדר העמודות לשרת
 * משדרג את כל העמודות עם ערכי ה-order החדשים
 */
export async function saveColumnOrder(
  columns: InfoColumn[],
  queryClient: QueryClient
): Promise<void> {
  try {
    const orderedColumns = calculateColumnOrder(columns);
    const updateMutation = infoColumnsUpdate({ queryClient });

    await new Promise((resolve, reject) => {
      updateMutation.mutate(
        { data: orderedColumns, mode: "update" },
        {
          onSuccess: () => {
            toast.success("סדר העמודות נשמר בהצלחה");
            resolve(undefined);
          },
          onError: (error) => {
            console.error("Error saving column order:", error);
            toast.error("שגיאה בשמירת סדר העמודות");
            reject(error);
          },
        }
      );
    });
  } catch (error) {
    console.error("Failed to save column order:", error);
    throw error;
  }
}

/**
 * שחזור סדר עמודות לטעינה
 * מיון העמודות לפי ערך order שלהן
 */
export function restoreColumnOrder(columns: InfoColumn[]): InfoColumn[] {
  // מיון לפי order שדה אם קיים
  const sorted = [...columns].sort((a, b) => {
    const orderA = (a as any).order ?? 999;
    const orderB = (b as any).order ?? 999;
    return orderA - orderB;
  });

  return sorted;
}

/**
 * וידוא שכל העמודות בעלות order תקני
 */
export function validateColumnOrder(columns: InfoColumn[]): boolean {
  if (!columns || columns.length === 0) {
    return true;
  }

  const orders = columns
    .map((col) => (col as any).order)
    .filter((order) => order !== undefined && order !== null);

  // בדיקה שכל ה-orders הם ייחודיים ורצופים
  if (orders.length === columns.length) {
    const sorted = [...orders].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] !== i) {
        return false;
      }
    }
  }

  return true;
}

/**
 * איתור עמודות ללא order ותיקון שלהן
 */
export function fixMissingOrder(columns: InfoColumn[]): InfoColumn[] {
  return columns.map((column, index) => {
    if ((column as any).order === undefined || (column as any).order === null) {
      return {
        ...column,
        order: index,
      };
    }
    return column;
  });
}

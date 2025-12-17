/**
 * Type Definitions for Columns DnD System
 * ממשקים וטיפוסים לניהול DnD של עמודות
 */

import { InfoColumn } from "src/serverTypes";
import { QueryClient } from "@tanstack/react-query";

/**
 * Branded type עבור עמודה בסדר DnD
 */
export type SortableColumnId = string & { readonly __brand: "SortableColumnId" };

/**
 * תוצאת פעולת סדור
 */
export interface ReorderResult {
  success: boolean;
  error?: Error;
  columns?: InfoColumn[];
}

/**
 * תצורה של פעולת סדור
 */
export interface ReorderConfig {
  activeIndex: number;
  overIndex: number;
}

/**
 * פרמטרים לקביעת אינדקס חדש
 */
export interface NewIndexParams {
  id: SortableColumnId;
  items: InfoColumn[];
  activeIndex: number;
  overIndex: number;
}

/**
 * ממשק DnD Context event
 */
export interface DndContextEvent {
  active: {
    id: SortableColumnId;
    data?: any;
  };
  over?: {
    id: SortableColumnId;
    data?: any;
  };
}

/**
 * Props עבור קומפוננטת שורה שניתנת למיון
 */
export interface SortableColumnRowProps {
  column: InfoColumn;
  handleColumnClick: (column: InfoColumn) => void;
  getNewIndex?: (args: any) => number;
}

/**
 * Props עבור קומפוננטת רשימה שניתנת למיון
 */
export interface SortableColumnsListProps {
  columns: InfoColumn[];
  handleColumnClick: (column: InfoColumn) => void;
  onOrderChange?: (columns: InfoColumn[]) => void;
}

/**
 * Props עבור overlay component
 */
export interface DragOverlayProps {
  column: InfoColumn | null;
}

/**
 * Props עבור Chip של עמודה
 */
export interface ColumnChipProps {
  chip: {
    label: string;
    icon?: string;
    color?: string;
  };
}

/**
 * State של סדור (sorting state)
 */
export interface SortingState {
  activeColumn: InfoColumn | null;
  sortedColumns: InfoColumn[];
  isSaving: boolean;
  error?: Error;
}

/**
 * Result type עבור פעולות ניהול עמודות
 */
export type ColumnManagementResult<T = void> = Promise<T | { error: Error }>;

/**
 * Options עבור saveColumnOrder
 */
export interface SaveColumnOrderOptions {
  queryClient: QueryClient;
  onSuccess?: (columns: InfoColumn[]) => void;
  onError?: (error: Error) => void;
}

/**
 * Helper type לקבלת column IDs
 */
export type ColumnIds = SortableColumnId[];

/**
 * Type guard עבור InfoColumn
 */
export const isInfoColumn = (value: any): value is InfoColumn => {
  return (
    value &&
    typeof value === "object" &&
    typeof value.name === "string" &&
    typeof value.label === "string"
  );
};

/**
 * Type guard עבור מערך InfoColumn
 */
export const isInfoColumnArray = (value: any): value is InfoColumn[] => {
  return Array.isArray(value) && value.every(isInfoColumn);
};

/**
 * Utility type לכל האפשרויות של column field
 */
export type ColumnFieldKey = keyof InfoColumn;

/**
 * Mapping של field names לتوابع formatter
 */
export interface ColumnFormatterMap {
  [key: string]: (value: any) => string;
}

/**
 * State update function type
 */
export type UpdateSortedColumnsFn = (
  updater: (prev: InfoColumn[]) => InfoColumn[]
) => void;

/**
 * Event handler type לגרירה
 */
export type HandleDragStartFn = (event: DndContextEvent) => void;
export type HandleDragEndFn = (event: DndContextEvent) => void;

/**
 * Callback type לשינוי order
 */
export type OrderChangeCallback = (columns: InfoColumn[]) => void;

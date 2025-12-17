/**
 * Columns Reorder Module
 * Provides drag-and-drop functionality for reordering columns
 */

import { arrayMove } from '@dnd-kit/sortable';
import { toast } from 'sonner';

/**
 * Interface for a reorderable column
 */
export interface ReorderableColumn {
  id: string;
  name: string;
  label: string;
  order?: number;
  [key: string]: any;
}

/**
 * Interface for reorder result
 */
export interface ReorderResult {
  columns: ReorderableColumn[];
  hasChanged: boolean;
}

/**
 * Get the initial order of columns
 * @param columns - Array of columns
 * @returns Array of column IDs in current order
 */
export function getInitialColumnOrder(columns: ReorderableColumn[]): string[] {
  return columns.map((col) => col.id || col.name);
}

/**
 * Handle drag end event for column reordering
 * @param activeId - ID of dragged column
 * @param overId - ID of target column
 * @param items - Current column IDs
 * @returns New array of column IDs after reordering
 */
export function handleColumnReorder(
  activeId: string | number,
  overId: string | number,
  items: (string | number)[]
): (string | number)[] {
  if (!activeId || !overId || activeId === overId) {
    return items;
  }

  const activeIndex = items.indexOf(activeId);
  const overIndex = items.indexOf(overId);

  if (activeIndex === -1 || overIndex === -1) {
    return items;
  }

  return arrayMove(items, activeIndex, overIndex);
}

/**
 * Reorder columns array based on new order
 * @param columns - Original columns array
 * @param orderedIds - New order of column IDs
 * @returns Reordered columns array
 */
export function applyColumnOrder(
  columns: ReorderableColumn[],
  orderedIds: (string | number)[]
): ReorderableColumn[] {
  const columnMap = new Map(
    columns.map((col) => [String(col.id || col.name), col])
  );

  return orderedIds
    .map((id) => columnMap.get(String(id)))
    .filter((col): col is ReorderableColumn => col !== undefined);
}

/**
 * Check if columns have been reordered
 * @param originalIds - Original column IDs
 * @param newIds - New column IDs
 * @returns True if order changed
 */
export function hasColumnOrderChanged(
  originalIds: (string | number)[],
  newIds: (string | number)[]
): boolean {
  if (originalIds.length !== newIds.length) {
    return true;
  }

  return originalIds.some((id, index) => id !== newIds[index]);
}

/**
 * Update column order in data structure
 * @param columns - Columns to update
 * @param newOrder - New order indices or IDs
 * @returns Columns with updated order property
 */
export function updateColumnOrderProperty(
  columns: ReorderableColumn[],
  newOrder: (string | number)[]
): ReorderableColumn[] {
  const updateMap = new Map(
    newOrder.map((id, index) => [id, index])
  );

  return columns.map((col) => ({
    ...col,
    order: updateMap.get(col.id || col.name) ?? col.order ?? 0,
  }));
}

/**
 * Prepare columns for API submission
 * @param columns - Reordered columns
 * @param baseProperties - Additional properties to include for each column
 * @returns Formatted columns for API
 */
export function prepareColumnsForSubmit(
  columns: ReorderableColumn[],
  baseProperties?: Record<string, any>
): Array<Record<string, any>> {
  return columns.map((col, index) => ({
    name: col.name,
    label: col.label,
    order: index,
    ...baseProperties,
    ...col,
  }));
}

/**
 * Validate reorder operation
 * @param columns - Columns array
 * @param activeId - Active item ID
 * @param overId - Over item ID
 * @returns Validation result with message
 */
export function validateReorder(
  columns: ReorderableColumn[],
  activeId: string | number | null,
  overId: string | number | null
): { valid: boolean; message?: string } {
  if (!columns || columns.length === 0) {
    return { valid: false, message: 'לא קיימות עמודות לסידור' };
  }

  if (!activeId || !overId) {
    return { valid: true };
  }

  const columnIds = columns.map((col) => String(col.id || col.name));
  if (!columnIds.includes(String(activeId))) {
    return { valid: false, message: 'עמודה פעילה לא נמצאה' };
  }

  if (!columnIds.includes(String(overId))) {
    return { valid: false, message: 'עמודת יעד לא נמצאה' };
  }

  return { valid: true };
}

/**
 * Show notification for reorder action
 * @param message - Message to show
 * @param type - Notification type
 */
export function showReorderNotification(
  message: string,
  type: 'success' | 'error' | 'info' = 'info'
): void {
  if (type === 'success') {
    toast.success(message);
  } else if (type === 'error') {
    toast.error(message);
  } else {
    toast(message);
  }
}

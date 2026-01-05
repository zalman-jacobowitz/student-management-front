import { useState, useRef, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  sortableKeyboardCoordinates,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Portal,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import {
  getInitialColumnOrder,
  handleColumnReorder,
  applyColumnOrder,
  hasColumnOrderChanged,
  updateColumnOrderProperty,
  validateReorder,
  showReorderNotification,
  type ReorderableColumn,
} from './columns-reorder';

// ============================================================================
// Styled Column Item Component
// ============================================================================

const SortableColumnItem = ({ column, isDragging, isOverlay, listeners, transform, transition }) => {
  const { setNodeRef, attributes } = useSortable({ id: column.id || column.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 1.5,
        borderRadius: 1,
        backgroundColor: isDragging ? 'action.hover' : 'background.paper',
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'action.hover',
          borderColor: 'primary.main',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <Iconify icon="nimbus:drag-dots" width={20} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2">{column.label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {column.name}
        </Typography>
      </Box>

      {isOverlay && (
        <Chip
          label="סוחב"
          size="small"
          icon={<Iconify icon="solar:hand-up-bold" />}
          color="primary"
          variant="outlined"
        />
      )}
    </Box>
  );
};

// ============================================================================
// Main Column Reorder Step Component
// ============================================================================

export function ColumnReorderStep({ 
  columns = [], 
  onChange,
  onComplete,
  disabled = false 
}) {
  const [items, setItems] = useState<(string | number)[]>(() =>
    getInitialColumnOrder(columns)
  );

  const [activeId, setActiveId] = useState<string | number | null>(null);
  const isFirstAnnouncement = useRef(true);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  };

  const getIndex = (id: string | number) => items.indexOf(id);
  const activeIndex = activeId ? getIndex(activeId) : -1;

  const handleDragStart = useCallback(({ active }) => {
    if (!active) return;
    setActiveId(active.id);
  }, []);

  const handleDragEnd = useCallback(
    ({ over }: DragEndEvent) => {
      setActiveId(null);

      if (!over) return;

      const validation = validateReorder(columns, activeId, over.id);
      if (!validation.valid) {
        showReorderNotification(validation.message || 'שגיאה בסידור', 'error');
        return;
      }

      const overIndex = getIndex(over.id);
      if (activeIndex !== overIndex) {
        const newItems = arrayMove(items, activeIndex, overIndex);
        setItems(newItems);

        if (onChange) {
          const reorderedColumns = applyColumnOrder(columns, newItems);
          onChange(reorderedColumns);
        }
      }
    },
    [items, activeId, activeIndex, columns, onChange]
  );

  const handleReorderAll = useCallback((direction: 'asc' | 'desc') => {
    const sorted = [...items].sort((a, b) => {
      const colA = columns.find((c) => (c.id || c.name) === a);
      const colB = columns.find((c) => (c.id || c.name) === b);
      const labelA = (colA?.label || '').toLowerCase();
      const labelB = (colB?.label || '').toLowerCase();

      if (direction === 'asc') {
        return labelA.localeCompare(labelB, 'he');
      } else {
        return labelB.localeCompare(labelA, 'he');
      }
    });

    setItems(sorted);

    if (onChange) {
      const reorderedColumns = applyColumnOrder(columns, sorted);
      onChange(reorderedColumns);
    }

    showReorderNotification(
      direction === 'asc' ? 'עמודות מסודרות בסדר עולה' : 'עמודות מסודרות בסדר יורד',
      'success'
    );
  }, [items, columns, onChange]);

  const handleReset = useCallback(() => {
    const original = getInitialColumnOrder(columns);
    setItems(original);

    if (onChange) {
      onChange(columns);
    }

    showReorderNotification('סדר העמודות הותאם לחזרה', 'info');
  }, [columns, onChange]);

  const handleComplete = useCallback(() => {
    if (hasColumnOrderChanged(getInitialColumnOrder(columns), items)) {
      const reorderedColumns = applyColumnOrder(columns, items);
      const columnsWithOrder = updateColumnOrderProperty(reorderedColumns, items);

      if (onComplete) {
        onComplete({
          columns: columnsWithOrder,
          originalOrder: getInitialColumnOrder(columns),
          newOrder: items,
        });
      }

      showReorderNotification('סידור העמודות נשמר', 'success');
    } else {
      showReorderNotification('לא חל שינוי בסדר העמודות', 'info');
    }
  }, [columns, items, onComplete]);

  useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  const activeColumn = columns.find((col) => (col.id || col.name) === activeId);

  return (
    <Stack spacing={3}>
      <Alert severity="info" icon={<Iconify icon="solar:info-circle-bold" />}>
        <Typography variant="body2">
          משוך ושחרר עמודות לשינוי סדרן. ניתן גם להשתמש במקלדת עם חצים לנוויגציה.
        </Typography>
      </Alert>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:sort-bold" />}
          onClick={() => handleReorderAll('asc')}
          disabled={disabled}
        >
          סדר א&apos;-י
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:sort-bold" />}
          onClick={() => handleReorderAll('desc')}
          disabled={disabled}
        >
          סדר י&apos;-א
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:refresh-bold" />}
          onClick={handleReset}
          disabled={disabled}
        >
          אפס
        </Button>
      </Stack>

      <DndContext
        id="column-reorder-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <Scrollbar sx={{ maxHeight: 400 }}>
            <Stack
              spacing={1}
              sx={{
                padding: 2,
              }}
            >
              {items.map((id, index) => {
                const column = columns.find((c) => (c.id || c.name) === id) as
                  | ReorderableColumn
                  | undefined;
                if (!column) return null;

                return (
                  <SortableColumnItemWrapper
                    key={id}
                    column={column}
                    disabled={disabled}
                  />
                );
              })}
            </Stack>
          </Scrollbar>
        </SortableContext>

        <Portal>
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeColumn ? (
              <SortableColumnItem
                column={activeColumn}
                isDragging={true}
                isOverlay={true}
                listeners={{}}
                transform={null}
                transition={null}
              />
            ) : null}
          </DragOverlay>
        </Portal>
      </DndContext>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="soft"
          onClick={handleReset}
          disabled={disabled}
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          onClick={handleComplete}
          disabled={disabled}
          endIcon={<Iconify icon="solar:check-circle-bold" />}
        >
          אישור סידור
        </Button>
      </Box>
    </Stack>
  );
}

// Helper component for sortable item
function SortableColumnItemWrapper({ column, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id || column.name,
    disabled,
  });

  return (
    <SortableColumnItem
      ref={setNodeRef}
      column={column}
      isDragging={isDragging}
      isOverlay={false}
      listeners={listeners}
      transform={transform}
      transition={transition}
      {...attributes}
    />
  );
}

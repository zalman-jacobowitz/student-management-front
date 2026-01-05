/**
 * Sortable Columns List Component
 * קומפוננטה עם יכולת Drag and Drop לסדר עמודות
 */

import { useRef, useState, useEffect, useCallback } from "react";
import {
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import {
  useSensor,
  DndContext,
  useSensors,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  KeyboardSensor,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Typography,
  Stack,
  Box,
  Portal,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { CSS } from "@dnd-kit/utilities";

import { Iconify } from "src/components/iconify";
import { InfoColumn } from "src/serverTypes";
import { getChips } from "./columns-minimal-fucntions";
import {
  createSortableId,
  getSortableIdValue,
  getColumnIndex,
  reorderColumns,
  getNewColumnIndex,
  saveColumnOrder,
} from "./columns-dnd-functions";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

// -------- Configuration --------

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

// -------- Chip Component --------

function ColumnChip({ chip }: { chip: any }) {
  return (
    <Chip
      size="small"
      label={chip.label}
      icon={chip.icon ? <Iconify icon={chip.icon} width={14} /> : undefined}
      color={chip.color || "default"}
      variant="outlined"
      sx={{
        fontSize: "0.70rem",
        height: 20,
        "& .MuiChip-icon": {
          fontSize: "0.75rem",
        },
      }}
    />
  );
}

// -------- Sortable Row Component --------

const animateLayoutChanges = (args: any) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

interface SortableColumnRowProps {
  column: InfoColumn;
  handleColumnClick: (column: InfoColumn) => void;
  getNewIndex?: (args: any) => number;
}

function SortableColumnRow({
  column,
  handleColumnClick,
  getNewIndex,
}: SortableColumnRowProps) {
  const columnId = createSortableId(column.name);

  const {
    isSorting,
    transform,
    listeners,
    attributes,
    isDragging,
    setNodeRef,
    transition,
    setActivatorNodeRef,
  } = useSortable({
    id: columnId,
    getNewIndex,
    animateLayoutChanges,
  });

  const columnChips = getChips(column);

  const renderTypeIcon = (
    <ListItemIcon
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        cursor: isDragging ? "grabbing" : "grab",
        display: "flex",
        alignItems: "center",
        "&:hover": {
          opacity: 0.7,
        },
      }}
    >
      <Iconify icon="nimbus:drag-dots" width={24} />
    </ListItemIcon>
  );

  const renderChips = Object.keys(columnChips).map((chip, index) => (
    <ColumnChip key={index} chip={columnChips[chip]} />
  ));

  const renderPrimary = (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="subtitle2">{column.label || column.name}</Typography>
      <Typography variant="caption" color="text.secondary">
        ({column.name})
      </Typography>
    </Stack>
  );

  return (
    <ListItem
      ref={setNodeRef}
      key={column.name}
      disablePadding
      sx={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Box
        component="div"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          borderRadius: 1,
          mb: 0.5,
          backgroundColor: isSorting ? "action.hover" : "transparent",
          "&:hover": {
            backgroundColor: "action.hover",
          },
          transition: "background-color 0.2s",
        }}
      >
        {renderTypeIcon}
        <ListItemText
          primary={renderPrimary}
          secondary={
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}
            >
              {renderChips}
            </Stack>
          }
          sx={{ flex: 1, px: 1 }}
        />
        <Iconify
          icon="solar:alt-arrow-left-bold"
          width={20}
          sx={{ color: "text.disabled", mr: 2 }}
        />
      </Box>
    </ListItem>
  );
}

// -------- Overlay Component --------

function DragOverlayColumn({
  column,
}: {
  column: InfoColumn | null;
}) {
  if (!column) return null;

  const columnChips = getChips(column);
  const renderChips = Object.keys(columnChips).map((chip, index) => (
    <ColumnChip key={index} chip={columnChips[chip]} />
  ));

  const renderPrimary = (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="subtitle2">{column.label || column.name}</Typography>
      <Typography variant="caption" color="text.secondary">
        ({column.name})
      </Typography>
    </Stack>
  );

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: 3,
        width: 320,
        backdropFilter: "blur(6px)",
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        <Iconify icon="nimbus:drag-dots" width={24} sx={{ mt: 0.5 }} />
        <Stack flex={1} spacing={0.5}>
          {renderPrimary}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
            {renderChips}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

// -------- Main Component --------

interface SortableColumnsListProps {
  columns: InfoColumn[];
  handleColumnClick: (column: InfoColumn) => void;
  onOrderChange?: (columns: InfoColumn[]) => void;
}

export function SortableColumnsList({
  columns,
  handleColumnClick,
  onOrderChange,
}: SortableColumnsListProps) {
  const queryClient = useQueryClient();
  
  // סטייט לניהול העמודות
  const [sortedColumns, setSortedColumns] = useState<InfoColumn[]>(columns);
  const [activeColumn, setActiveColumn] = useState<InfoColumn | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update sorted columns when columns prop changes
  useEffect(() => {
    setSortedColumns(columns);
  }, [columns]);

  const isFirstAnnouncement = useRef(true);

  // Sensor configuration
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Get column index
  const getIndex = useCallback(
    (id: any) => {
      const value = getSortableIdValue(id);
      return sortedColumns.findIndex((col) => col.name === value);
    },
    [sortedColumns]
  );

  const activeIndex = activeColumn
    ? getIndex(createSortableId(activeColumn.name))
    : -1;

  // Handle drag start
  const handleDragStart = useCallback((active: any) => {
    if (!active) return;

    const columnName = getSortableIdValue(active.id);
    const column = sortedColumns.find((col) => col.name === columnName);
    if (column) {
      setActiveColumn(column);
    }
  }, [sortedColumns]);

  // Handle drag end
  const handleDragEnd = useCallback(
    async (event: any) => {
      const { over } = event;
      setActiveColumn(null);

      if (!over) return;

      const overIndex = getIndex(over.id);
      if (activeIndex === -1 || activeIndex === overIndex) return;

      // Reorder columns locally
      const newSortedColumns = arrayMove(sortedColumns, activeIndex, overIndex);
      setSortedColumns(newSortedColumns);

      // Callback to parent
      if (onOrderChange) {
        onOrderChange(newSortedColumns);
      }

      // Save to server
      setIsSaving(true);
      try {
        await saveColumnOrder(newSortedColumns, queryClient);
      } catch (error) {
        console.error("Failed to save column order:", error);
        // Revert on error
        setSortedColumns(columns);
      } finally {
        setIsSaving(false);
      }
    },
    [activeIndex, sortedColumns, columns, onOrderChange, queryClient, getIndex]
  );

  // Reset announcement on drag end
  useEffect(() => {
    if (!activeColumn) {
      isFirstAnnouncement.current = true;
    }
  }, [activeColumn]);

  const sortableColumnIds = sortedColumns.map((col) =>
    createSortableId(col.name)
  );

  return (
    <Box>
      {isSaving && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          icon={<CircularProgress size={20} />}
        >
          שומר סדר עמודות...
        </Alert>
      )}

      <DndContext
        id="dnd-columns"
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={({ active }) => handleDragStart(active)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableColumnIds}
          strategy={verticalListSortingStrategy}
        >
          <List
            sx={{
              maxHeight: 400,
              overflow: "auto",
            }}
          >
            {sortedColumns.map((column, index) => (
              <Box
                key={column.name}
                onClick={() => handleColumnClick(column)}
                sx={{ cursor: "pointer" }}
              >
                <SortableColumnRow
                  column={column}
                  handleColumnClick={handleColumnClick}
                  getNewIndex={({ items: currentItems }) =>
                    getNewColumnIndex({
                      id: createSortableId(column.name),
                      items: currentItems,
                      activeIndex,
                      overIndex: getIndex(
                        currentItems[currentItems.length - 1]?.name ||
                          column.name
                      ),
                    })
                  }
                />
              </Box>
            ))}
          </List>
        </SortableContext>

        <Portal>
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeColumn ? <DragOverlayColumn column={activeColumn} /> : null}
          </DragOverlay>
        </Portal>
      </DndContext>
    </Box>
  );
}

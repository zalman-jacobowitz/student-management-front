
import { useState } from "react";

import { Button, Stack, Fab, IconButton, Divider, Typography, Grid, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useBoolean } from "src/hooks/use-boolean";

import { PopoverActions } from "src/components/popover-actions";
import { RegularSelect, RegularButton, RegularSearch } from "src/components/form-elements";

import { changeBool } from "../functions";
import useInsertStore from "../insert-state";
import { CopyPasteButtons } from "../components/copy-paste-buttons";
import { InsertFilters } from "../components/filters";
import { DelayDialog } from "../delays/delays-edit-steps";
import { ButtonGreen } from "src/components/button-green";
import { ExceptionDialog } from "src/sections/exceptions/exceptions-edit-steps";
import { Iconify } from "src/components/iconify/iconify";
import { useForm, useFormContext } from "react-hook-form";
import { inHebrew } from "src/utils/hebrew/getter";




// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  { label: 'פשוט', value: 'simple', icon: 'solar:arrow-up-bold-duotone' },
  { label: 'פירוט', value: 'detailed', icon: 'solar:arrow-down-bold-duotone' },
];

const SORT_OPTIONS = [
  { label: 'עולה', value: 'up', icon: 'solar:arrow-up-bold-duotone' },
  { label: 'יורד', value: 'down', icon: 'solar:arrow-down-bold-duotone' },
  { label: 'שם', value: 'name', icon: 'solar:user-bold-duotone' },
];
const FILTER_OPTIONS = [
  { label: 'נוכחים', value: 'true', icon: 'solar:check-circle-bold-duotone', color: 'success' },
  { label: 'חסרים', value: 'false', icon: 'solar:close-circle-bold-duotone', color: 'error' },
  { label: 'מאחרים', value: 'delayed', icon: 'solar:clock-circle-bold-duotone', color: 'warning' },
  { label: 'הכל', value: 'all', icon: 'solar:list-bold-duotone', color: 'default' },
];

// Reusable FAB Button Component with Logic Separation
// Display modes:
// xs: icon only
// sm: text only (vertical)
// md: text with icon (horizontal)
// lg+: full display with subLabel
interface FabButtonProps {
  icon: string;
  label: string;
  subLabel?: string;
  color?: string;
  variant?: 'softExtended' | 'outlinedExtended' | 'extended';
  onClick: () => void;
  testId?: string;
  showSubLabel?: boolean;
  sizeMultiplier?: number;
  iconAfter?: boolean;
}

export const FabButton = ({
  icon,
  label,
  subLabel,
  iconAfter = false,
  color = 'default',
  variant = 'outlinedExtended',
  onClick,
  testId,
  showSubLabel = false,
  sizeMultiplier = 1,
  children = () => null,
}: FabButtonProps) => {
  const theme = useTheme();
  
  // Responsive breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  
  const baseWidth = 15;
  const width = `${baseWidth * sizeMultiplier}%`;

  // Mode 1: Icon only (xs)
  if (isXs) {
    return (
      <Fab
        color={color as any}
        onClick={onClick}
        variant="softExtended"
        sx={{ padding: 1.5, borderRadius: 1, width: 48, minWidth: 48, height: 48 }}
        data-testid={testId}
      >
        <Iconify icon={icon} width={24} />
      </Fab>
    );
  }

  // Mode 2: Text only (sm)
  if (isSm) {
    return (
      <Fab
        color={color as any}
        onClick={onClick}
        variant="softExtended"
        sx={{ padding: 1, borderRadius: 1, width, minWidth: width, height: 'auto', py: 1 }}
        data-testid={testId}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          {label}
        </Typography>
      </Fab>
    );
  }

  // Mode 3: Icon + Text horizontal (md)
  if (isMd) {
    return (
      <Fab
        color={color as any}
        variant="softExtended"
        onClick={onClick}
        sx={{ 
          pr: 2, 
          pl: 1, 
          borderRadius: 1, 
          width, 
          minWidth: width, 
          height: 'auto',
          gap: 1,
        }}
        data-testid={testId}
      >
        {!iconAfter && icon && <Iconify icon={icon} width={20} />}
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {label}
        </Typography>
        {iconAfter && icon && <Iconify icon={icon} width={20} />}
      </Fab>
    );
  }

  // Mode 4: Full display with subLabel (lg+)
  if (isLg && showSubLabel && subLabel) {
    return (
      <Fab
        color={color as any}
        variant={variant}
        onClick={onClick}
        sx={{ pr: 2, pl: 1, pt: 2, pb: 2, borderRadius: 1, borderColor: 'transparent', height: 'auto', width, minWidth: width }}
        data-testid={testId}
      >
        {!iconAfter ? <Iconify icon={icon} width={24} /> : null}
        {!iconAfter && children}
        <Stack direction="column" spacing={0} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {subLabel}
          </Typography>
          <Typography variant="body2">{label}</Typography>
        </Stack>
        {iconAfter ? <Iconify icon={icon} width={24} /> : null}
        {iconAfter && children}
      </Fab>
    );
  }

  // Fallback: Regular extended button
  return (
    <Fab
      color={color as any}
      variant="extended"
      onClick={onClick}
      sx={{ 
        pr: 2, 
        pl: 1, 
        borderRadius: 1, 
        width, 
        minWidth: width, 
        height: 'auto',
        gap: 1,
      }}
      data-testid={testId}
    >
      {!iconAfter && icon && <Iconify icon={icon} width={20} />}
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
      {iconAfter && icon && <Iconify icon={icon} width={20} />}
    </Fab>
  );
};

// ----------------------------------------------------------------------

interface InsertToolbarProps {
  delay: string,
  handleDelete: (data: any) => void;
  currentData: any[];
  reset?: (values: any) => void;
  filters: any;
  handleFilter: (data: any) => void;
  infoColumns: any[];
  infoStudents: any[];
  currentEventIndex?: number;
  allEvents?: any[];
  prevEvent?: () => void;
  nextEvent?: () => void;
}

export function InsertToolbar({
  header,
  summaryMode,
  setSortBy,
  exceptionDialog,
  selectedLabel,
  dialogDelay,
  handleDelete,
  currentData,
  reset,
  filters,
  handleFilter,
  infoColumns,
  infoStudents
}: InsertToolbarProps) {



  const [sortIndex, setSortIndex] = useState(0);
  const [filterIndex, setFilterIndex] = useState(3); // Start with 'הכל'


  const handleSortClick = () => {
    const nextIndex = (sortIndex + 1) % SORT_OPTIONS.length;
    setSortIndex(nextIndex);
    setSortBy(SORT_OPTIONS[nextIndex].value);
  };

  const handleFilterClick = () => {
    const nextIndex = (filterIndex + 1) % FILTER_OPTIONS.length;
    setFilterIndex(nextIndex);
    handleFilter('data', FILTER_OPTIONS[nextIndex].value);
  };



  const listActionsMap = [
    {
      icon: 'solar:trash-bin-trash-bold-duotone',
      label: 'מחק',
      onClick: () => {
        handleDelete(changeBool(currentData))
      }
    },
    {
      icon: 'solar:export-bold',
      label: 'ייצוא',
      onClick: () => {
        // exportToExcel([], 'students_export.xlsx');
      }
    },
    {
      icon: 'solar:copy-bold',
      label: 'העתק',
      component: <CopyPasteButtons infoStudents={infoStudents} reset={reset} />
    },
    {
      icon: 'solar:chart-bold-duotone',
      label: summaryMode ? 'מצב רגיל' : 'מצב סיכום',
      color: summaryMode ? 'primary' : 'default',
      onClick: () => {
        summaryMode.onToggle();
      }
    }
  ]

  const filterDrawer = useBoolean();

  const { selectedEvent, currentEventIndex, allEvents, nextEvent, prevEvent, onBack } = useInsertStore(state => state);

  return (
    <>
      <Stack
        spacing={0}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >

        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={.8} 


        >
           <FabButton
            icon="solar:round-alt-arrow-right-bold-duotone"
            label="חזרה"
            subLabel="לתפריט"
            color="default"
            variant="softExtended"
            onClick={onBack}
            testId="filter-drawer-fab"
            showSubLabel
          />
          <FabButton
            icon="solar:filter-bold-duotone"
            label="סנן"
            subLabel="הוסף"
            color="default"
            variant="outlinedExtended"
            onClick={filterDrawer.onTrue}
            testId="filter-drawer-fab"
            showSubLabel
          />
                              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } , ml: .5, mr: .5 }} />
<FabButton
            icon={SORT_OPTIONS[sortIndex].icon}
            subLabel="מיין"
            label={SORT_OPTIONS[sortIndex].label}
            color="default"
            variant="outlinedExtended"
            onClick={handleSortClick}
            testId="sort-fab"
            showSubLabel={true}
          />
          <FabButton
            icon={summaryMode.value ? 'solar:pie-chart-2-bold-duotone' : 'solar:hamburger-menu-bold-duotone'}
            subLabel="תצוגה"
            label={summaryMode.value ? 'פירוט' : 'פשוט'}
            color="default"
            variant={!summaryMode.value ? "outlinedExtended" : "softExtended"}
            onClick={() => {summaryMode.onToggle()}}
            testId="sort-fab"
            showSubLabel={true}
          />

          <FabButton
            icon={FILTER_OPTIONS[filterIndex].icon}
            label={FILTER_OPTIONS[filterIndex].label}
            subLabel="מציג"
            color={FILTER_OPTIONS[filterIndex].color}
            variant="outlinedExtended"
            onClick={handleFilterClick}
            testId="filter-fab"
            showSubLabel={true}
          />
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } , ml: .5, mr: .5 }} />

          <FabButton
            icon="solar:clock-circle-bold-duotone"
            label="איחור"
            subLabel="הוסף"
            color="warning"
            variant="outlinedExtended"
            onClick={dialogDelay.onTrue}
            testId="delay-fab"
            showSubLabel={true}
          />
          <FabButton
            icon="solar:user-check-rounded-bold-duotone"
            label="אישור"
            subLabel="הוסף"
            color="default"
            variant="outlinedExtended"
            onClick={exceptionDialog.onTrue}
            testId="exception-fab"
            showSubLabel={true}
          />
          <FabButton
            icon="solar:trash-bin-trash-bold-duotone"
            label="סדר"
            subLabel="מחק"
            color="error"
            variant="outlinedExtended"
            onClick={exceptionDialog.onTrue}
            testId="exception-fab"
            showSubLabel={true}
          />
        </Stack>

      </Stack>

      <InsertFilters
        open={filterDrawer.value}
        onClose={filterDrawer.onFalse}
        infoColumns={infoColumns}
        handleFilter={handleFilter}
        filters={filters}
        table={currentData}
      />

      <DelayDialog
        open={dialogDelay.value}
        onClose={dialogDelay.onFalse}
        delay={selectedLabel}
        onComplete={(data) => {
          dialogDelay.onFalse();
        }}

      />
      <ExceptionDialog
        open={exceptionDialog.value}
        onClose={exceptionDialog.onFalse}
        onComplete={(data) => {
          exceptionDialog.onFalse();
        }}
        column={selectedLabel}
      />

    </>
  );
}

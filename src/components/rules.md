# Component Development Rules and Guidelines

This document defines the standard patterns, conventions, and rules for developing and maintaining React components in the `/src/components/` directory. All components must follow these guidelines to ensure consistency, maintainability, and proper functionality within the Hebrew attendance management system.

## Core Architecture Principles

### Component Philosophy
- **Single Responsibility**: Each component should have one clear purpose
- **Reusability**: Design components to be reusable across different contexts
- **Accessibility**: Support keyboard navigation and screen readers
- **Hebrew/RTL First**: Design with Hebrew text and RTL layout as primary consideration
- **Material-UI Integration**: Leverage Material-UI as the foundation for all components

### Import Structure
```javascript
// External dependencies first
import { useState, useCallback, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Internal dependencies
import { Iconify } from 'src/components/iconify';
import { varFade } from 'src/components/animate';
import { CONFIG } from 'src/config-global';

// Local dependencies
import { useComponentName } from './use-component-name';
import { ComponentUtils } from './utils';
```

## File Organization Rules

### Standard Folder Structure
```
component-name/
├── index.js                    # Main export file
├── component-name.jsx          # Main component file
├── use-component-name.js       # Custom hook (optional)
├── utils.js                    # Utility functions (optional)
├── styles.jsx                  # Styled components (optional)
├── classes.js                  # CSS classes definitions (optional)
├── components/                 # Sub-components (optional)
│   ├── sub-component-a.jsx
│   └── sub-component-b.jsx
└── hooks/                      # Multiple hooks (optional)
    ├── use-feature-a.js
    └── use-feature-b.js
```

### Naming Conventions

#### Directory Names
- **kebab-case**: All directory names use kebab-case
- **Descriptive**: Names should clearly indicate component purpose
- **Prefixes**: Use consistent prefixes for related components

```
✅ Good Examples:
custom-popover/
hebrew-calendar/
button-green/
table-head-custom/

❌ Bad Examples:
customPopover/
MyComponent/
btn/
```

#### Component Names
- **PascalCase**: All React component names use PascalCase
- **Descriptive**: Names should be clear and specific
- **Consistent Prefixes**:
  - `RHF*` - React Hook Form components
  - `Custom*` - Enhanced versions of standard components
  - `Table*` - Table-related components
  - `Nav*` - Navigation components

```javascript
// ✅ Good Examples
export function ButtonGreen({ children, ...props }) { }
export function CustomPopover({ open, onClose }) { }
export function RHFTextField({ name, label }) { }
export function TableHeadCustom({ columns }) { }

// ❌ Bad Examples
export function btn({ children }) { }
export function popover({ open }) { }
export function textField({ name }) { }
```

#### File Names
- **kebab-case**: JavaScript/TypeScript files use kebab-case
- **Descriptive**: File names should match their primary export
- **Extensions**: Use `.jsx` for React components, `.js` for utilities and hooks

```
✅ Good Examples:
button-green.jsx
use-popover.js
utils.js
styles.jsx

❌ Bad Examples:
ButtonGreen.jsx
usePopover.js
Utilities.js
```

### Export Patterns

#### Index File Exports
```javascript
// Simple component
export * from './button-green';

// Component with utilities
export * from './custom-popover';
export * from './use-popover';

// Complex component system
export * from './table-head-custom';
export * from './table-pagination-custom';
export * from './table-selected-action';
export * from './use-table';
export * from './utils';
```

#### Component File Exports
```javascript
// Named exports only (no default exports)
export function ComponentName({ prop1, prop2, ...other }) {
  // Component implementation
}

// Multiple related exports
export function MainComponent({ children }) { }
export function SubComponent({ data }) { }
export const COMPONENT_CONSTANTS = { };
```

## Implementation Patterns

### Simple Component Pattern
Use for basic UI components with minimal logic:

```javascript
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
  // RTL support
  [theme.direction === 'rtl' ? 'marginLeft' : 'marginRight']: theme.spacing(1),
}));

export function ButtonGreen({ 
  children, 
  onClick, 
  disabled = false, 
  sx,
  ...other 
}) {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      sx={sx}
      {...other}
    >
      {children}
    </StyledButton>
  );
}
```

### Component with Hook Pattern
Use for components that need complex state or reusable logic:

```javascript
// Component file
import { Popover } from '@mui/material';
import { usePopover } from './use-popover';
import { getAnchorOrigin } from './utils';

export function CustomPopover({
  open,
  onClose,
  children,
  anchorEl,
  placement = 'bottom-center',
  sx,
  ...other
}) {
  const { anchorOrigin, transformOrigin } = getAnchorOrigin(placement);

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={{
        // RTL adjustments
        '& .MuiPopover-paper': {
          direction: 'rtl', // Force RTL for Hebrew content
          ...sx,
        },
      }}
      {...other}
    >
      {children}
    </Popover>
  );
}
```

```javascript
// Hook file (use-popover.js)
import { useState, useCallback } from 'react';

export function usePopover() {
  const [anchorEl, setAnchorEl] = useState(null);

  const onOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    open: Boolean(anchorEl),
    anchorEl,
    onOpen,
    onClose,
  };
}
```

### Compound Component Pattern
Use for related components that work together:

```javascript
// Main component file (table.jsx)
export function Table({ children, ...props }) {
  return (
    <TableContainer>
      <MuiTable {...props}>
        {children}
      </MuiTable>
    </TableContainer>
  );
}

// Sub-component files
export function TableHeadCustom({ 
  columns, 
  orderBy, 
  order, 
  onSort 
}) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            sortDirection={orderBy === column.id ? order : false}
            sx={{ 
              textAlign: 'right', // RTL alignment
              direction: 'rtl' 
            }}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={order}
              onClick={() => onSort(column.id)}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
```

### Form Component Pattern
Use for React Hook Form integration:

```javascript
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

export function RHFTextField({ 
  name, 
  label, 
  helperText,
  type = 'text',
  ...other 
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          label={label}
          error={!!error}
          helperText={error?.message || helperText}
          inputProps={{
            dir: type === 'email' ? 'ltr' : 'rtl', // Email fields should be LTR
          }}
          sx={{
            '& .MuiInputLabel-root': {
              right: 14, // RTL label positioning
              left: 'auto',
              transformOrigin: 'top right',
            },
          }}
          {...other}
        />
      )}
    />
  );
}
```

## Styling Guidelines

### Material-UI Theme Integration
```javascript
import { styled } from '@mui/material/styles';

const StyledComponent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  
  // Responsive design
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
  
  // RTL support
  marginRight: theme.direction === 'rtl' ? 0 : theme.spacing(1),
  marginLeft: theme.direction === 'rtl' ? theme.spacing(1) : 0,
  
  // Hebrew font support
  fontFamily: theme.typography.fontFamily,
  direction: 'rtl',
  textAlign: 'right',
}));
```

### CSS Classes Pattern
```javascript
// classes.js
export const componentClasses = {
  root: 'component-root',
  header: 'component-header',
  content: 'component-content',
  footer: 'component-footer',
};

// Usage in component
import { componentClasses } from './classes';

export function Component() {
  return (
    <Box className={componentClasses.root}>
      <Box className={componentClasses.header}>
        {/* Header content */}
      </Box>
    </Box>
  );
}
```

### Inline Styles for RTL
```javascript
// RTL-specific styling
const rtlStyles = {
  textAlign: 'right',
  direction: 'rtl',
  '& .MuiInputLabel-root': {
    right: 14,
    left: 'auto',
    transformOrigin: 'top right',
  },
  '& .MuiSelect-icon': {
    right: 'auto',
    left: 7,
  },
};
```

## Hebrew/RTL Considerations

### Text Direction
```javascript
// Automatic RTL detection
export function HebrewText({ children, ...props }) {
  const isHebrew = /[\u0590-\u05FF]/.test(children);
  
  return (
    <Typography
      dir={isHebrew ? 'rtl' : 'ltr'}
      sx={{
        textAlign: isHebrew ? 'right' : 'left',
        direction: isHebrew ? 'rtl' : 'ltr',
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
```

### Hebrew Calendar Integration
```javascript
import { HebrewDate } from '@hebcal/core';

export function HebrewDatePicker({ 
  value, 
  onChange, 
  label = 'תאריך עברי',
  ...props 
}) {
  const handleDateChange = (date) => {
    const hebrewDate = new HebrewDate(date);
    onChange(hebrewDate);
  };

  return (
    <Box sx={{ direction: 'rtl' }}>
      {/* Hebrew calendar implementation */}
    </Box>
  );
}
```

### Default Hebrew Labels
```javascript
// Constants for Hebrew labels
export const HEBREW_LABELS = {
  save: 'שמור',
  cancel: 'ביטול', 
  delete: 'מחק',
  edit: 'ערוך',
  add: 'הוסף',
  search: 'חיפוש',
  filter: 'סינון',
  export: 'ייצוא',
  import: 'ייבוא',
  noData: 'אין נתונים',
  loading: 'טוען...',
  error: 'שגיאה',
  success: 'בוצע בהצלחה',
};

// Usage
export function ActionButton({ action, ...props }) {
  return (
    <Button {...props}>
      {HEBREW_LABELS[action]}
    </Button>
  );
}
```

## Custom Hook Guidelines

### When to Create Custom Hooks
- **State Logic**: Complex state management that could be reused
- **Side Effects**: Data fetching, subscriptions, or cleanup logic
- **Utilities**: Reusable calculations or transformations
- **Integration**: Third-party library integration

### Hook Naming Convention
```javascript
// ✅ Good Examples
export function useTable() { }
export function usePopover() { }
export function useHebrewDate() { }
export function useFormValidation() { }

// ❌ Bad Examples
export function tableHook() { }
export function popover() { }
export function hebrewDate() { }
```

### Hook Implementation Pattern
```javascript
import { useState, useCallback, useEffect } from 'react';

export function useTable({
  defaultOrderBy = 'name',
  defaultOrder = 'asc',
  defaultPage = 0,
  defaultRowsPerPage = 10,
}) {
  const [page, setPage] = useState(defaultPage);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [order, setOrder] = useState(defaultOrder);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selected, setSelected] = useState([]);

  const onSort = useCallback((id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  }, [order, orderBy]);

  const onSelectRow = useCallback((id) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      }
      return [...prevSelected, id];
    });
  }, []);

  const onSelectAllRows = useCallback((checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    // State
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    
    // Actions
    onSort,
    onSelectRow,
    onSelectAllRows,
    onResetPage,
    setPage,
    setRowsPerPage,
    setSelected,
  };
}
```

## Testing and Documentation

### Component Documentation
```javascript
/**
 * ButtonGreen - Primary action button with green styling
 * 
 * @param {React.ReactNode} children - Button content
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Disable button
 * @param {Object} sx - Additional styling
 * @param {Object} other - Additional props passed to Button
 * 
 * @example
 * <ButtonGreen onClick={handleSave} disabled={isLoading}>
 *   שמור נתונים
 * </ButtonGreen>
 */
export function ButtonGreen({ children, onClick, disabled, sx, ...other }) {
  // Implementation
}
```

### Test IDs
```javascript
export function ButtonGreen({ children, 'data-testid': testId, ...props }) {
  return (
    <Button 
      data-testid={testId || 'button-green'}
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Storybook Integration
```javascript
// button-green.stories.js
export default {
  title: 'Components/ButtonGreen',
  component: ButtonGreen,
  parameters: {
    docs: {
      description: {
        component: 'Primary action button with green styling for the attendance system.',
      },
    },
  },
};

export const Default = {
  args: {
    children: 'שמור נתונים',
  },
};

export const Disabled = {
  args: {
    children: 'שמור נתונים',
    disabled: true,
  },
};
```

## Creating New Components

### Step-by-Step Guide

#### 1. Plan the Component
```javascript
// Define component requirements
const COMPONENT_REQUIREMENTS = {
  name: 'StudentCard',
  purpose: 'Display student information in card format',
  props: ['student', 'onEdit', 'onDelete', 'compact'],
  dependencies: ['Material-UI Card', 'Iconify icons'],
  hebrewSupport: true,
  responsive: true,
};
```

#### 2. Create Directory Structure
```
student-card/
├── index.js
├── student-card.jsx
├── use-student-card.js (if needed)
└── utils.js (if needed)
```

#### 3. Implement Index File
```javascript
// index.js
export * from './student-card';
export * from './use-student-card'; // if applicable
```

#### 4. Implement Main Component
```javascript
// student-card.jsx
import { Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function StudentCard({
  student,
  onEdit,
  onDelete,
  compact = false,
  sx,
  ...other
}) {
  return (
    <Card
      sx={{
        direction: 'rtl',
        textAlign: 'right',
        ...sx,
      }}
      {...other}
    >
      <CardContent>
        <Typography variant="h6" component="h3">
          {student.שם} {student.משפחה}
        </Typography>
        {!compact && (
          <>
            <Typography variant="body2" color="text.secondary">
              מזהה: {student.student_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              כיתה: {student.שיעור}
            </Typography>
          </>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'flex-start' }}>
        <IconButton 
          onClick={() => onEdit(student)} 
          aria-label="ערוך תלמיד"
        >
          <Iconify icon="eva:edit-fill" />
        </IconButton>
        <IconButton 
          onClick={() => onDelete(student)} 
          color="error"
          aria-label="מחק תלמיד"
        >
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </CardActions>
    </Card>
  );
}
```

#### 5. Add to Main Components Index
```javascript
// src/components/index.js (if exists)
export * from './student-card';
```

### Component Template
```javascript
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledRoot = styled(Box)(({ theme }) => ({
  // Base styles
  position: 'relative',
  
  // RTL support
  direction: 'rtl',
  textAlign: 'right',
  
  // Theme integration
  ...theme.typography.body1,
}));

// Main component
export function ComponentTemplate({
  children,
  variant = 'default',
  sx,
  ...other
}) {
  return (
    <StyledRoot
      sx={sx}
      {...other}
    >
      {children}
    </StyledRoot>
  );
}

// TypeScript props interface (if using TypeScript)
ComponentTemplate.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'outlined', 'filled']),
  sx: PropTypes.object,
};
```

## Reusing Existing Components

### Before Creating New Components

1. **Check Component Index** - Review `src/components/index.md` for existing components
2. **Search for Similar Patterns** - Look for components with similar functionality
3. **Consider Composition** - Can you combine existing components?
4. **Check Form Components** - Review `hook-form/` for form-related needs

### Common Reusable Components

#### Basic UI Elements
```javascript
// Instead of creating custom buttons
import { ButtonGreen } from 'src/components/button-green';
import { ConfirmDialog } from 'src/components/custom-dialog';

// Instead of custom tables
import { 
  Table, 
  TableHeadCustom, 
  TablePaginationCustom 
} from 'src/components/table';
```

#### Form Components
```javascript
// Use existing form components
import {
  RHFTextField,
  RHFSelect,
  RHFCheckbox,
  RHFHebrewDatePicker,
  FormProvider,
} from 'src/components/hook-form';
```

#### Layout and Navigation
```javascript
// Use existing layout components
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
```

### Extending Existing Components

#### Props Extension
```javascript
// Extend existing component with additional props
import { ButtonGreen as BaseButtonGreen } from 'src/components/button-green';

export function SubmitButton({ 
  isLoading, 
  children = 'שמור',
  ...props 
}) {
  return (
    <BaseButtonGreen
      disabled={isLoading}
      startIcon={isLoading && <CircularProgress size={20} />}
      {...props}
    >
      {isLoading ? 'שומר...' : children}
    </BaseButtonGreen>
  );
}
```

#### Composition Pattern
```javascript
// Combine existing components
import { Card, CardContent } from '@mui/material';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

export function DataCard({ data, isLoading, title, children }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        
        {isLoading && <LoadingScreen />}
        
        {!isLoading && !data?.length && (
          <EmptyContent 
            title="אין נתונים"
            description="לא נמצאו נתונים להצגה"
          />
        )}
        
        {!isLoading && data?.length > 0 && children}
      </CardContent>
    </Card>
  );
}
```

## Best Practices

### Performance Optimization
- Use `React.memo` for components that receive stable props
- Use `useCallback` and `useMemo` appropriately
- Avoid inline object/function creation in render
- Lazy load heavy components

```javascript
import { memo, useCallback, useMemo } from 'react';

export const OptimizedComponent = memo(function OptimizedComponent({
  data,
  onAction,
}) {
  const processedData = useMemo(
    () => data.map(item => ({ ...item, processed: true })),
    [data]
  );

  const handleAction = useCallback(
    (id) => onAction(id),
    [onAction]
  );

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleAction(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

### Accessibility Guidelines
```javascript
export function AccessibleButton({ children, onClick, disabled }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </Button>
  );
}
```

### Error Boundaries
```javascript
import { ErrorBoundary } from 'react-error-boundary';

export function SafeComponent({ children }) {
  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">
            אירעה שגיאה בטעינת הרכיב
          </Typography>
        </Box>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
```

## Common Pitfalls to Avoid

1. **Inconsistent Naming** - Follow established naming conventions
2. **Missing RTL Support** - Always consider Hebrew text direction
3. **Hardcoded Strings** - Use constants for Hebrew labels
4. **Missing Prop Validation** - Use PropTypes or TypeScript
5. **Overusing Styled Components** - Prefer Material-UI theme when possible
6. **Ignoring Accessibility** - Include proper ARIA labels and keyboard support
7. **Creating Duplicate Components** - Check existing components first
8. **Missing Error Handling** - Handle error states gracefully

## Migration Guidelines

### From Class to Function Components
```javascript
// OLD - Class component
class OldComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  render() {
    return <div>{this.state.count}</div>;
  }
}

// NEW - Function component
function NewComponent() {
  const [count, setCount] = useState(0);
  
  return <div>{count}</div>;
}
```

### From JavaScript to TypeScript
```typescript
// Add interface for props
interface ComponentProps {
  title: string;
  data: Array<{ id: string; name: string }>;
  onSelect?: (id: string) => void;
  variant?: 'default' | 'compact';
}

export function TypedComponent({ 
  title, 
  data, 
  onSelect, 
  variant = 'default' 
}: ComponentProps) {
  // Implementation with type safety
}
```

This comprehensive guide ensures consistency, maintainability, and proper Hebrew/RTL support across all components in the attendance management system.
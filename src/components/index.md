# Components Index

This document provides an overview of all components in the `/src/components/` directory, organized by business context and technical purpose for the attendance management system (ניהול נוכחות).

## Core Business Components

### **HebrewDatePicker**
**Business Purpose**: Custom Hebrew calendar component for selecting dates in the attendance system.  
**Technical Role**: Provides Hebrew date selection with lunar calendar support, displaying Hebrew months and dates.  
**Usage Context**: Used in attendance data entry forms and date filtering throughout the system.

### **RegularTable**
**Business Purpose**: Main table component for displaying student lists, attendance records, and system data.  
**Technical Role**: Wrapper around Material-UI Table with custom styling and theme support.  
**Usage Context**: Primary data display component in students list, attendance records, and user management.

### **RHFBoolianList**
**Business Purpose**: Boolean toggle component for marking student attendance (present/absent).  
**Technical Role**: React Hook Form controller for boolean values with visual feedback.  
**Usage Context**: Used in attendance recording forms for quick present/absent marking.

### **ButtonGreen**
**Business Purpose**: Primary action button with animated upload icon for form submissions.  
**Technical Role**: Floating action button with custom styling and animation.  
**Usage Context**: Main action buttons in forms, file uploads, and critical user actions.

### **ConfirmDialog**
**Business Purpose**: Dialog component for delete confirmations and critical actions.  
**Technical Role**: Modal dialog with Hebrew text for user confirmations.  
**Usage Context**: Used before deleting students, clearing data, or other destructive actions.

## Data Management Components

### **Upload**
**Business Purpose**: File upload component for Excel import/export of student data.  
**Technical Role**: Drag-and-drop file upload with multi-file support and validation.  
**Usage Context**: Student data import, attendance report export, and bulk data operations.

### **EmptyContent**
**Business Purpose**: Empty state component showing "אין נתונים" (no data) message.  
**Technical Role**: Standardized empty state with Hebrew text and custom icons.  
**Usage Context**: Displayed when tables, lists, or search results are empty.

### **SearchNotFound**
**Business Purpose**: Search results empty state component.  
**Technical Role**: Empty state specifically for search operations.  
**Usage Context**: Shown when student searches or filters return no results.

### **FiltersResult**
**Business Purpose**: Component showing applied filters and allowing filter removal.  
**Technical Role**: Filter management UI with active filter display.  
**Usage Context**: Used in student lists and attendance reports to show/manage active filters.

## Form Components (React Hook Form)

### **RHFTextField**
**Business Purpose**: Text input fields for student names, IDs, and other text data.  
**Technical Role**: React Hook Form controlled text input with validation.  
**Usage Context**: Student registration forms, search inputs, and data entry fields.

### **RHFSelect**
**Business Purpose**: Dropdown selections for classes, events, and categorical data.  
**Technical Role**: React Hook Form controlled select component.  
**Usage Context**: Class selection, event type selection, and category filtering.

### **RHFCheckbox**
**Business Purpose**: Checkbox inputs for permissions and boolean options.  
**Technical Role**: React Hook Form controlled checkbox with validation.  
**Usage Context**: User permissions, bulk selection, and boolean settings.

### **RHFDatePicker**
**Business Purpose**: Standard date picker for general date selection.  
**Technical Role**: React Hook Form controlled date picker integration.  
**Usage Context**: General date inputs where Hebrew calendar is not required.

### **RHFHebrewDatePicker**
**Business Purpose**: Hebrew calendar date picker for culturally appropriate date selection.  
**Technical Role**: Integration of Hebrew calendar with React Hook Form.  
**Usage Context**: Primary date selection in attendance forms and Hebrew date contexts.

### **FormProvider**
**Business Purpose**: Context provider for form state management across components.  
**Technical Role**: React Hook Form context wrapper for nested form components.  
**Usage Context**: Wraps complex forms with multiple sections and nested components.

## Navigation Components

### **NavSection**
**Business Purpose**: Main navigation sidebar for system navigation.  
**Technical Role**: Responsive navigation with vertical/horizontal/mini layouts.  
**Usage Context**: Primary navigation in dashboard layout for accessing different system sections.

### **NavBasic**
**Business Purpose**: Simple navigation for mobile and desktop layouts.  
**Technical Role**: Basic navigation component for simple page structures.  
**Usage Context**: Used in main layout for simple navigation needs.

### **MegaMenu**
**Business Purpose**: Complex menu structure with submenus for extensive navigation.  
**Technical Role**: Multi-level menu system with mobile/desktop responsiveness.  
**Usage Context**: Used when extensive navigation structure is needed.

### **CustomBreadcrumbs**
**Business Purpose**: Navigation breadcrumbs with Hebrew path support.  
**Technical Role**: Breadcrumb navigation with RTL support and custom styling.  
**Usage Context**: Page navigation indicators throughout the system.

## Table Components

### **RegularTable**
**Business Purpose**: Main table wrapper with theme support for data display.  
**Technical Role**: Enhanced Material-UI table with custom styling and responsive design.  
**Usage Context**: Core component for all tabular data display in the system.

### **TableHeadCustom**
**Business Purpose**: Sortable table headers for data organization.  
**Technical Role**: Custom table header with sorting and column management.  
**Usage Context**: Headers for student lists, attendance records, and data tables.

### **TablePaginationCustom**
**Business Purpose**: Pagination controls for large datasets.  
**Technical Role**: Custom pagination component with Hebrew text.  
**Usage Context**: Bottom of tables with large student lists or attendance records.

### **TableSelectedAction**
**Business Purpose**: Bulk action buttons for selected rows.  
**Technical Role**: Action bar appearing when table rows are selected.  
**Usage Context**: Bulk operations on selected students or attendance records.

### **TableEmptyRows**
**Business Purpose**: Empty row placeholders for consistent table height.  
**Technical Role**: Placeholder rows to maintain table structure.  
**Usage Context**: Maintains visual consistency in tables with variable data.

### **TableSkeleton**
**Business Purpose**: Loading skeleton for table data.  
**Technical Role**: Skeleton loading animation for table content.  
**Usage Context**: Shown while table data is loading from server.

## UI Enhancement Components

### **Animate**
**Business Purpose**: Animation components for enhanced user experience.  
**Technical Role**: Framer Motion based animations (CountUp, Avatar, Text, Logo).  
**Usage Context**: Statistics display, loading states, and interactive elements.

### **Carousel**
**Business Purpose**: Image/content carousel with navigation.  
**Technical Role**: Swiper-based carousel with custom controls.  
**Usage Context**: Image galleries, feature showcases, and content rotation.

### **Chart**
**Business Purpose**: Data visualization components for attendance analytics.  
**Technical Role**: Chart.js integration with custom styling.  
**Usage Context**: Attendance statistics, progress tracking, and data visualization.

### **Lightbox**
**Business Purpose**: Image gallery viewer for document and photo viewing.  
**Technical Role**: Modal image viewer with navigation controls.  
**Usage Context**: Viewing student photos, documents, and image attachments.

### **Scrollbar**
**Business Purpose**: Custom scrollbar styling for consistent UI.  
**Technical Role**: Custom scrollbar component with theme integration.  
**Usage Context**: Applied to scrollable areas throughout the application.

### **ProgressBar**
**Business Purpose**: Loading progress indicators for user feedback.  
**Technical Role**: Progress bar component with customizable styling.  
**Usage Context**: File uploads, data processing, and loading operations.

## Utility Components

### **Iconify**
**Business Purpose**: Icon component wrapper with custom icons.  
**Technical Role**: Icon library integration with custom SVG support.  
**Usage Context**: Icons throughout the system for actions, status, and navigation.

### **Image**
**Business Purpose**: Enhanced image component with lazy loading.  
**Technical Role**: Optimized image display with loading states.  
**Usage Context**: Student photos, profile images, and content images.

### **Logo**
**Business Purpose**: Application logo component.  
**Technical Role**: Responsive logo display with multiple variants.  
**Usage Context**: Header, login screens, and branding elements.

### **Label**
**Business Purpose**: Status labels and badges for data categorization.  
**Technical Role**: Customizable label component with color coding.  
**Usage Context**: Student status, attendance status, and categorical indicators.

### **CustomTabs**
**Business Purpose**: Tab navigation component for sectioned content.  
**Technical Role**: Enhanced Material-UI tabs with custom styling.  
**Usage Context**: Multi-section forms, settings panels, and content organization.

### **CustomPopover**
**Business Purpose**: Popover menus and tooltips for additional information.  
**Technical Role**: Floating content container with positioning logic.  
**Usage Context**: Action menus, help tooltips, and contextual information.

## Layout Components

### **Settings**
**Business Purpose**: Theme and layout configuration for user preferences.  
**Technical Role**: Settings management with context and local storage.  
**Usage Context**: User customization of interface appearance and behavior.

### **Snackbar**
**Business Purpose**: Toast notifications for user feedback.  
**Technical Role**: Notification system with Hebrew text support.  
**Usage Context**: Success messages, error notifications, and user feedback.

### **LoadingScreen**
**Business Purpose**: Full-screen loading states for major operations.  
**Technical Role**: Overlay loading component with animation.  
**Usage Context**: Application startup, major data operations, and page transitions.

### **SplashScreen**
**Business Purpose**: Application startup screen with branding.  
**Technical Role**: Initial loading screen with logo and progress indication.  
**Usage Context**: Application initialization and first-time loading.

## Hebrew/RTL Context

Many components include special handling for Hebrew text and RTL (Right-to-Left) layout:

- **Text Direction**: Components automatically handle RTL text direction
- **Hebrew Dates**: Specialized components for Hebrew calendar integration
- **Hebrew Labels**: Default Hebrew text for common UI elements
- **RTL Styling**: CSS and styling adjustments for RTL layouts

## Attendance Management Domain

Components are specifically designed for the attendance management system context:

- **Student-Centric**: Many components focus on student data and operations
- **Attendance Tracking**: Specialized components for attendance recording
- **Bulk Operations**: Support for managing multiple students simultaneously
- **Data Import/Export**: Excel integration for institutional data management
- **Hebrew Educational Context**: Cultural and linguistic considerations for Hebrew-speaking educational institutions

This index serves as a reference for understanding component purpose and usage within the attendance management system, helping developers and AI systems make informed decisions about component selection and implementation.
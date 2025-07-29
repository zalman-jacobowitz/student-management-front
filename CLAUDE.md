# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server on port 3030
- `npm run dev:host` - Start development server with host access
- `npm build` - Build for production
- `npm start` - Preview production build

### Code Quality
- `npm lint` - Run ESLint
- `npm lint:fix` - Fix ESLint issues automatically
- `npm fm:check` - Check Prettier formatting
- `npm fm:fix` - Fix Prettier formatting

### Testing
- `npx playwright test` - Run all Playwright E2E tests
- `npx playwright test --headed` - Run tests in headed mode
- `npx playwright test tests/specific-test.spec.js` - Run specific test file
- `npm storybook` - Start Storybook component documentation
- `npm build-storybook` - Build Storybook for production

### Maintenance
- `npm rm:all` - Remove all build artifacts and dependencies
- `npm re:start` - Clean install and start development
- `npm re:build` - Clean install and build

## Architecture Overview

### Tech Stack
- **Frontend**: React 18.3 + Vite 5.4 + Material-UI v5
- **Language**: JavaScript/TypeScript hybrid (mostly JS)
- **State Management**: Zustand + TanStack Query (React Query)
- **Authentication**: Supabase
- **Styling**: Emotion (CSS-in-JS) + Material-UI components
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6 with Hebrew paths
- **Testing**: Playwright (E2E) + Vitest (unit) + Storybook

### Key Features
- **Hebrew Interface**: App name "ניהול נוכחות" (Attendance Management)
- **Hebrew Routing**: URLs use Hebrew paths (e.g., `/ניהול/רשימה`)
- **RTL Support**: Right-to-left layout with `stylis-plugin-rtl`
- **Hebrew Calendar**: Custom Hebrew date picker integration

### Project Structure

#### Core Sections (`src/sections/`)

Each folder in the repo contains three context files.

1. index - contains all the functions or components in that folder.

2. ruls - explanation and rules on how to build a new function in the folder.

3. uses - explanation on how the user uses these things - mainly intended for creating tests.

These are intended to improve the context for LLMS

##### **students/** - Student Management Section
- **Business Purpose**: Complete student registry management in the attendance system
- **User Features**: 
  - Dynamic table with customizable columns
  - Quick edit dialogs for student details
  - Advanced search and filtering
  - Bulk operations (selection, deletion)
  - Excel export/import capabilities
- **Key Components**:
  - `students-list-view.jsx` - Main entry point with Suspense
  - `students-simple-table.jsx` - Main table with pagination and filtering
  - `student-new-edit-form.jsx` - Dynamic edit form
  - `students-simple-table-toolbar.jsx` - Search and filter toolbar
- **Technical Features**: Dynamic columns, React Query caching, responsive design

##### **insert/** - Attendance Data Entry Section  
- **Business Purpose**: Student attendance recording for various events
- **User Workflow**: Event selection → Attendance recording → Data saving
- **Key Features**:
  - Hebrew date picker integration
  - Copy/paste functionality between events
  - Dynamic form validation with Zod
  - Two-stage navigation (event selection ↔ attendance recording)
- **Key Components**:
  - `insert-view.tsx` - Main entry point with conditional rendering
  - `insert-form-defind-event.tsx` - Event selection form
  - `insert-screen.tsx` - Main attendance recording screen
  - `insert-state.ts` - Zustand store for state management
- **Technical Features**: Zustand state management, React Hook Form, bulk operations

##### **infoColumns/** - Dynamic Column Configuration
- **Business Purpose**: System-wide table column management and customization
- **User Features**: Configure which columns appear in tables across the application
- **Key Components**: Column visibility controls, column type definitions
- **Technical Features**: Dynamic column system affecting multiple sections

##### **users/** - User Management and Permissions
- **Business Purpose**: System user management with role-based access control
- **User Features**: User listing, permission assignment, user details management
- **Key Components**: User tables, permission forms, user details views
- **Technical Features**: Role-based security, user permission matrices

##### **profile/** - User Profile Management  
- **Business Purpose**: Individual user profile viewing and editing
- **User Features**: Personal profile display, quick edit capabilities, user information management
- **Key Components**: Profile screens, user edit forms, profile covers
- **Technical Features**: User context integration, profile data management

#### State Management
- **Zustand stores**: Located in individual sections (e.g., `src/sections/insert/insert-state.js`)
- **TanStack Query**: Server state management and caching
- **React Context**: Global app state (auth, settings, theme)

#### Authentication Flow
- **Provider**: Supabase with JWT tokens
- **Guards**: Route protection in `src/auth/guard/`
- **Context**: Auth state management in `src/auth/context/`
- **Auto-refresh**: Automatic token refresh handling

#### Routing Structure
- **Base path**: `/ניהול` (management)
- **Students**: `/ניהול/רשימה` (list)
- **Data Entry**: `/ניהול/הכנסת-נתונים` (data-entry)
- **User Management**: `/ניהול/הרשאות-משתמשים` (user-permissions)
- **Column Settings**: `/ניהול/הגדרת-עמודות` (column-settings)
- **Profile**: `/ניהול/פרופיל-אישי` (personal-profile)

### Development Patterns

#### Component Architecture
- **Compound Components**: Tables use compound pattern with separate row/header components
- **Custom Hooks**: Reusable logic in individual component folders
- **Form Components**: React Hook Form with Zod schemas

#### API Integration
- **Base Client**: `src/utils/manager-fetch.js` - Custom wrapper around axios
- **Interceptors**: Automatic JWT token attachment and refresh
- **Error Handling**: Centralized error handling with toast notifications

#### Testing Strategy
- **E2E Tests**: Playwright with authentication setup (`auth.setup.js`)
- **Storage State**: Persistent login state in `storageState.json`
- **Test Location**: `tests/` directory with Hebrew test descriptions
- **Component Tests**: Storybook integration with Vitest

### Configuration Notes

#### Environment Variables
- `VITE_SERVER_URL`: Backend API URL
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps integration

#### Build Configuration
- **Vite**: React SWC plugin for fast compilation
- **TypeScript**: Checker plugin enabled with ESLint integration
- **Path Aliases**: `src/*` mapped to `./src/*`
- **Port**: Development server runs on port 3030

#### Code Quality
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Code formatting with perfectionist plugin
- **Import Sorting**: Automatic import organization
- **TypeScript**: Gradual migration from JavaScript

### Important Notes

#### Hebrew/RTL Considerations
- All user-facing text should be in Hebrew
- Use RTL-compatible styling patterns
- Hebrew date handling with moment.js
- Proper text direction handling in forms

#### Data Management
- Students data is the primary entity
- Dynamic column configuration allows customizable views
- Bulk operations support for efficiency
- Excel import/export for data migration

#### Authentication
- Supabase handles user authentication
- JWT tokens are automatically managed
- Route guards protect authenticated pages
- User permissions control access to features

#### Testing
- Playwright tests assume Hebrew interface
- Authentication state is preserved between tests
- Tests use Hebrew selectors and labels
- E2E tests cover critical user workflows

## Section-Specific Documentation

For detailed information about each section's business context, component architecture, and usage patterns, refer to the README.md files in each section directory:

- **`src/sections/insert/README.md`** - Complete documentation for attendance data entry system
- **`src/sections/students/README.md`** - Complete documentation for student management system
- Additional README.md files will be created for other sections as needed

These documents provide:
- Business context and user workflows
- Technical architecture details  
- Component structure and relationships
- API integrations and dependencies
- Code examples and usage patterns

This documentation is specifically designed to help AI models understand the codebase context and make informed decisions when working with the code.

each llm he wants to change this code he need to look at the ruls of each folder.
and make minimlize that he can to achive the promt resalt.
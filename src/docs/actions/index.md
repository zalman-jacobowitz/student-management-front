# Actions Index

This document provides a comprehensive overview of all actions in the `/src/actions/` directory, serving as the data layer for the attendance management system (ניהול נוכחות). Each action includes business context, API details, caching strategies, and real response examples.

## Overview

The Actions layer serves as the central data management hub, connecting React components to the backend API through React Query. It provides a standardized interface for all CRUD operations, caching, and data transformations.

### Core Architecture
- **Single API Endpoint**: All requests go to `/all` with `{table_name, mode, data}` structure
- **React Query Integration**: Consistent patterns for queries and mutations
- **Authentication**: Automatic JWT token injection via `manager-fetch.js`
- **Caching Strategy**: Intelligent cache invalidation and background sync
- **Data Transformations**: Automatic data reshaping between frontend and backend formats

### Request/Response Pattern
```javascript
// Standard Request Format
{
  table_name: 'table_name',
  mode: 'select' | 'update' | 'delete',
  data: [] // array of records or query parameters
}

// Standard Response Format
{
  data: [...], // array of records
  success: true // for mutations
}
```

## Student Management Actions

### **apiInfoStudents()**
**Business Purpose**: Fetch all student records for display in student management tables.  
**Technical Role**: Primary query for student data with automatic caching.  
**Usage Context**: Student list views, search operations, and data export.

**API Details**:
- **Query Key**: `['info_students', 'all']`
- **Endpoint**: `POST /all`
- **Request**: `{table_name: 'info_students', mode: 'select', data: []}`
- **Cache Strategy**: Suspense-enabled with automatic background refresh
- **Invalidated By**: `infoStudentsUpdate` mutations

**Response Example**:
```json
[
  {
    "client": "kg_gdola",
    "student_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "user_id": "zalmanjacob@gmail.com",
    "ארץ_לידה": "ישראל",
    "ארץ_לידה_הורים": "פולין",
    "בן_מתחת_גיל_18": "",
    "דואל": "rivka.gutman10@gmail.com",
    "כתובת_מגורים": "דרך מנחם בגין 20, באר שבע",
    "מין": "נקבה",
    "מספר_טלפון": "525678901",
    "משפחה": "גוטמן",
    "שם": "רבקה",
    "שנת_לידה": "2010"
  }
]
```

**Key Fields**:
- `student_id`: Unique identifier (UUID)
- `user_id`: Creator's email for permission filtering
- `client`: Institution identifier
- **Hebrew Fields**: `שם` (name), `משפחה` (surname), `מין` (gender), etc.

### **infoStudentsUpdate()**
**Business Purpose**: Update student information with complex data transformation.  
**Technical Role**: Mutation that converts flat student objects to key-value pairs.  
**Usage Context**: Student edit forms, bulk updates, and data import operations.

**API Details**:
- **Mutation Key**: `['info_students']`
- **Endpoint**: `POST /all`
- **Data Transformation**: Converts `{student_id, field1, field2}` → `[{student_id, group_name: 'field1', value}, {student_id, group_name: 'field2', value}]`
- **Cache Invalidation**: Invalidates `['info_students']` queries
- **Modes**: `'update'`, `'insert'`, `'delete'`

**Transformation Example**:
```javascript
// Input
{
  student_id: "abc-123",
  שם: "דוד",
  משפחה: "כהן"
}

// Transformed for API
[
  {student_id: "abc-123", group_name: "שם", value: "דוד"},
  {student_id: "abc-123", group_name: "משפחה", value: "כהן"}
]
```

### **apiDataStudentsEvent()**
**Business Purpose**: Retrieve attendance data for specific students and events.  
**Technical Role**: Conditional query with boolean data conversion.  
**Usage Context**: Attendance recording screens and event participation tracking.

**API Details**:
- **Query Key**: `['data_students', tamplateData]`
- **Endpoint**: `POST /all`
- **Request**: `{table_name: 'data_students', mode: 'select', data: tamplateData}`
- **Enabled Condition**: `!!tamplateData.length` (only runs when template data provided)
- **Data Transformation**: Converts `"100"` → `true`, `"0"` → `false`
- **Cache Dependencies**: Invalidated by `dataStudentsEventUpdate`

**Response Example**:
```json
[
  {
    "student_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "event_id": "event_123",
    "event_name": "סעודת שבת",
    "date": "2024-01-12",
    "data": true  // converted from "100"
  }
]
```

### **dataStudentsEventUpdate()**
**Business Purpose**: Update attendance records for events.  
**Technical Role**: Mutation for attendance data with cross-query invalidation.  
**Usage Context**: Attendance marking, bulk attendance updates, and event data management.

**API Details**:
- **Mutation Key**: `['data_students']`
- **Alert Debug**: Shows `DATA-DELETE: ${mode}` for debugging
- **Cache Invalidation**: 
  - Invalidates `['data_students']` queries
  - Cancels `['list_of_events']` queries (related data)
- **Data Flow**: Boolean values converted back to "100"/"0" strings for server

## System Configuration Actions

### **apiInfoColumns()**
**Business Purpose**: Fetch dynamic column definitions for all tables in the system.  
**Technical Role**: System configuration query enabling dynamic table generation.  
**Usage Context**: Table rendering, form generation, and column visibility controls.

**API Details**:
- **Query Key**: `['info_columns']`
- **Endpoint**: `POST /all`
- **Request**: `{table_name: 'info_columns', mode: 'select', data: []}`
- **Cache Strategy**: Suspense-enabled, long-lived cache
- **Usage Pattern**: Combined with `apiSelectOptions()` in `useInfoColumns()`

**Response Example**:
```json
[
  {
    "client": "kg_gdola",
    "filters": "regular",
    "group_name": "primary",
    "hidden": "",
    "label": "שם",
    "name": "שם",
    "required": "",
    "sorting": 1,
    "table_name": "info_students",
    "type": "text"
  },
  {
    "client": "kg_gdola",
    "filters": "",
    "group_name": "",
    "hidden": "",
    "label": "מגדר",
    "name": "מין",
    "required": "",
    "sorting": 17,
    "table_name": "info_students",
    "type": "select"
  }
]
```

**Column Configuration Fields**:
- `table_name`: Which table the column belongs to
- `name`: Field name in data (Hebrew)
- `label`: Display label for UI (Hebrew)
- `type`: Field type (`text`, `select`, `date`, `checkbox`, etc.)
- `sorting`: Display order in tables
- `hidden`: Hide column (`"t"`, `"1"` = hidden)
- `filters`: Filter type (`"regular"`, `"extra"`, `""` = no filter)
- `group_name`: Column grouping (`"primary"`, `"secondary"`)
- `required`: Required field indicator

### **apiSelectOptions()**
**Business Purpose**: Fetch dropdown options for select fields throughout the system.  
**Technical Role**: Configuration data for dynamic select field population.  
**Usage Context**: Form select fields, filters, and dropdown menus.

**API Details**:
- **Query Key**: `['select_options']`
- **Endpoint**: `POST /all`
- **Request**: `{table_name: 'select_options', mode: 'select', data: []}`
- **Cache Strategy**: Suspense-enabled, shared across components
- **Usage Pattern**: Filtered and merged in `useInfoColumns()`

**Response Example**:
```json
[
  {
    "client": "kg_gdola",
    "label": "שיעור א",
    "name": "שיעור",
    "table_name": "info_students",
    "value": "א"
  },
  {
    "client": "kg_gdola",
    "label": "זכר",
    "name": "מין",
    "table_name": "info_students",
    "value": "Male"
  },
  {
    "client": "kg_gdola",
    "label": "נקבה",
    "name": "מין",
    "table_name": "info_students",
    "value": "Female"
  },
  {
    "client": "kg_gdola",
    "label": "ישראל",
    "name": "location",
    "table_name": "users",
    "value": "Asia/Jerusalem"
  }
]
```

**Option Fields**:
- `table_name`: Which table the option belongs to
- `name`: Which field the option is for
- `value`: Stored value (often English/technical)
- `label`: Display text (Hebrew)
- `client`: Institution identifier

### **useInfoColumns(tableName)**
**Business Purpose**: Combined hook providing columns with integrated select options.  
**Technical Role**: Merges column definitions with their select options for complete table schema.  
**Usage Context**: Dynamic table rendering and form generation.

**API Details**:
- **Dependencies**: `useSuspenseQueries([apiInfoColumns(), apiSelectOptions()])`
- **Data Processing**:
  1. Filters columns by `tableName`
  2. Sorts by `sorting` field
  3. Filters select options by `tableName`
  4. Merges options into select-type columns
- **Returns**: `{infoColumns, selectOptions, newData}`

**Processing Logic**:
```javascript
// Filter columns for specific table
const infoThisTable = infoColumnsData
  .filter((c) => c.table_name === tableName)
  .sort((a, b) => a.sorting - b.sorting);

// Filter options for specific table
const selectThisTable = selectOptionsData.filter(
  (o) => o.table_name === tableName
);

// Merge options into select columns
const newData = infoThisTable.map((col) => {
  if (col.type === 'select') {
    return {
      ...col,
      options: selectThisTable
        .filter((o) => o.name === col.name)
        .map((o) => ({ value: o.value, label: o.label }))
    };
  }
  return col;
});
```

## Event Management Actions

### **apiListEvents(students_ids)**
**Business Purpose**: Fetch events list filtered by student participation.  
**Technical Role**: Event data query for attendance tracking interface.  
**Usage Context**: Event selection in attendance forms and event management.

**API Details**:
- **Query Key**: `['list_of_events']`
- **Endpoint**: `POST /all`
- **Request**: `{table_name: 'list_of_events', mode: 'select', data: students_ids}`
- **Parameters**: `students_ids` array for filtering
- **Cache Relationship**: Cancelled by `dataStudentsEventUpdate`

### **apiEventsToday(day)**
**Business Purpose**: Fetch events scheduled for a specific day.  
**Technical Role**: Date-filtered event query for daily attendance tracking.  
**Usage Context**: Daily attendance screens and today's events dashboard.

**API Details**:
- **Query Key**: `['events_today', '1']`
- **Endpoint**: `POST /all`
- **Request**: `{table_name: 'events_today', mode: 'select', data: {day}}`
- **Parameters**: `day` parameter for date filtering
- **Cache Strategy**: Short-lived cache for real-time data

## User Management Actions

### **apiUsers()**
**Business Purpose**: Fetch user accounts with permissions and screen access.  
**Technical Role**: User management data with complex permission structures.  
**Usage Context**: User administration, permissions management, and access control.

**API Details**:
- **Query Key**: `['users']`
- **Endpoint**: `POST /all`
- **Request**: `{table_name: 'users', mode: 'select', data: []}`
- **Cache Strategy**: Suspense-enabled for user management screens
- **Data Source**: Maps to `supabase_users` table

**Response Example**:
```json
[
  {
    "id": "89588098-774c-4b6c-8f39-5102b0618d90",
    "email": "totalshj@gmail.com",
    "raw_user_meta_data": {
      "user": {
        "email": "totalshj@gmail.com",
        "firstName": "כהן",
        "lastName": "יוסף",
        "country": "Asia/Jerusalem"
      },
      "screens": {
        "info": true,
        "users": false,
        "insert": true,
        "profile": true,
        "userPermissions": false
      },
      "permissions": [
        {
          "side": "server",
          "label": "מייל",
          "table": "info_students",
          "values": ["totalshj@gmail.com"],
          "operator": "and",
          "columnName": "user_id"
        }
      ],
      "stepAccess": {
        "events": {
          "סעודות ליל שבת": true,
          "סעודת ראש השנה": true,
          "מפגשי בר בת מצווה": true
        }
      }
    }
  }
]
```

**User Permission Structure**:
- **screens**: Access to different system sections (info, users, insert, etc.)
- **permissions**: Data-level permissions (which students user can see)
- **stepAccess.events**: Event-specific access control
- **stepUser**: Personal user information
- **user**: Basic profile information with Hebrew names

## Utility Actions

### **useGetTable(table, more)**
**Business Purpose**: Generic table operations with Excel import/export support.  
**Technical Role**: Reusable hook for any table with optimistic updates and error handling.  
**Usage Context**: General table operations, Excel integration, and legacy code compatibility.

**API Details**:
- **Query Key**: `[table, more]`
- **Endpoint**: `POST /all`
- **Features**: 
  - Optimistic updates with rollback
  - Excel integration via `xlsx` library
  - Error handling with user alerts
  - Generic CRUD operations
- **Data Transformation**: Automatic via `editData()` function

**Hook Returns**:
```javascript
{
  data,           // Query result
  error,          // Error state
  isLoading,      // Loading state
  mutate,         // Direct mutation function
  mutateAsync     // Async mutation with mode parameter
}
```

### **editData(newData, table, mode)**
**Business Purpose**: Transform data before sending to API based on table type and operation mode.  
**Technical Role**: Central data transformation utility handling different table schemas.  
**Usage Context**: Called automatically by `useGetTable` and other update operations.

**Transformation Logic**:
```javascript
// Delete operations
if (mode === 'delete') {
  if (table === 'users') {
    return newData.map(item => ({uuid: item.id, user_id: item.email}))
  }
  if (table === 'info_students') {
    return newData.map(item => ({student_id: item.student_id}))
  }
  return isArray(newData) ? newData : [newData]
}

// Student data transformation (flat → key-value pairs)
if (table === 'info_students') {
  const students = isArray(newData) ? newData : [newData]
  const newValue = []
  students.forEach(student => {
    Object.keys(student).forEach(key => {
      if (key !== 'student_id') {
        newValue.push({
          student_id: student.student_id,
          group_name: key,
          value: student[key] || ''
        })
      }
    })
  })
  return newValue
}

// Default: pass through as array
return isArray(newData) ? newData : [newData]
```

## Mock Data System

### **Mock Handlers (MSW)**
**Business Purpose**: Development and testing infrastructure mimicking real API behavior.  
**Technical Role**: In-memory database with persistent state across requests.  
**Usage Context**: Development mode, unit tests, and component testing.

**Features**:
- **Single Endpoint**: `/all` handles all table operations
- **In-Memory Persistence**: State maintained between requests
- **Real Data**: Realistic Hebrew student data for development
- **Authentication Mock**: Fake Supabase session management
- **Error Simulation**: Proper error responses for edge cases

**Mock Database Tables**:
- `info_students`: Student records with Hebrew fields
- `info_columns`: Column configuration data
- `select_options`: Dropdown option definitions
- `users`: User accounts with permission structures

## Caching Strategy

### Query Key Patterns
- **Static Data**: `['table_name']` for configuration data
- **Parameterized**: `['table_name', parameters]` for filtered data
- **Versioned**: `['table_name', 'version']` for cache busting

### Cache Invalidation Rules
- **Student Updates**: Invalidates `['info_students']`
- **Attendance Updates**: Invalidates `['data_students']` and cancels `['list_of_events']`
- **Cross-Table Dependencies**: Manual invalidation for related data

### Performance Optimizations
- **Suspense Queries**: Non-blocking UI with `suspense: true`
- **Background Sync**: Automatic data freshening
- **Optimistic Updates**: Immediate UI feedback with rollback
- **Shared Cache**: Multiple components share same query results

## Authentication & Permissions

### Automatic JWT Injection
All requests automatically include:
- **Authorization Header**: `Bearer ${jwt_token}`
- **User Context**: `user_id`, `user_email` in request body
- **Timestamp**: Request timestamp for logging
- **Error Handling**: Automatic token refresh on expiry

### Permission-Based Filtering
- **Server-Side**: Data filtered by user permissions before response
- **Client-Side**: UI elements hidden based on screen permissions
- **Event Access**: Fine-grained event-level permissions
- **Data Scope**: Users only see their permitted student records

## Data Transformation Patterns

### Student Data Flow
```
Frontend (Flat Object) ↔ Actions (Key-Value Transformation) ↔ Backend (Normalized)

{student_id: "123", שם: "דוד", משפחה: "כהן"}
                    ↓
[{student_id: "123", group_name: "שם", value: "דוד"},
 {student_id: "123", group_name: "משפחה", value: "כהן"}]
```

### Boolean Attendance Data
```
Frontend (Boolean) ↔ Actions (String Conversion) ↔ Backend (String)

true/false ↔ "100"/"0" ↔ Database Storage
```

### Dynamic Column System
```
Column Definitions + Select Options = Complete Table Schema

info_columns (structure) + select_options (values) = Dynamic Tables
```

## Hebrew/RTL Context

### Hebrew Field Names
Most database fields use Hebrew names reflecting the educational context:
- `שם` (name), `משפחה` (surname)
- `מין` (gender), `ארץ_לידה` (birth country)
- `כתובת_מגורים` (address), `מספר_טלפון` (phone)

### Educational Institution Context
- **Client System**: Multi-tenant with `client` field
- **Event Types**: Hebrew event names (סעודת שבת, מפגשי בר מצווה)
- **Permission Labels**: Hebrew permission descriptions
- **User Interface**: RTL-optimized data structures

## Best Practices

### Using Actions in Components
```javascript
// Query Pattern
import { useSuspenseQuery } from '@tanstack/react-query';
import { apiInfoStudents } from 'src/actions/info_students';

function StudentsComponent() {
  const { data: students } = useSuspenseQuery(apiInfoStudents());
  // Component logic
}

// Mutation Pattern
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { infoStudentsUpdate } from 'src/actions/info_students';

function EditComponent() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(infoStudentsUpdate({ queryClient }));
  // Mutation logic
}

// Dynamic Columns Pattern
import { useInfoColumns } from 'src/actions/columns_with_select';

function DynamicTable() {
  const { newData: columns } = useInfoColumns('info_students');
  // Table rendering with dynamic columns
}
```

### Error Handling
- Always use optional chaining: `res?.data ?? null`
- Provide user-friendly Hebrew error messages
- Implement proper loading states
- Handle network failures gracefully

### Performance Tips
- Use `useSuspenseQuery` for critical data
- Batch related queries with `useSuspenseQueries`
- Implement proper query keys for cache efficiency
- Use optimistic updates for better UX

This comprehensive index serves as the definitive reference for understanding and working with the data layer of the attendance management system, providing both technical details and business context for effective development.
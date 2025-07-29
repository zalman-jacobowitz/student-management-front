# API Actions Rules and Development Guidelines

This document defines the standard patterns, conventions, and rules for developing and maintaining API actions in the `/src/actions/` directory. All API interactions must follow these guidelines to ensure consistency, maintainability, and proper functionality.

## Core Architecture

### Single Endpoint Pattern
All API calls use a single endpoint (`/all`) with a standardized request structure:

```javascript
// Standard Request Format
{
  table_name: 'table_name',    // Target table/resource
  mode: 'select' | 'update' | 'delete',  // Operation type
  data: []                     // Query parameters or update data
}

// Standard Response Format
{
  data: [...],                 // Array of records
  success: true                // For mutations (optional)
}
```

### Authentication Integration
All requests automatically include:
- **JWT Token**: Bearer token in Authorization header
- **User Context**: `user_id` and `user_email` in request body
- **Timestamp**: Request timestamp for logging
- **Error Handling**: Automatic token refresh on expiry

### Import Structure
```javascript
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from 'src/utils/manager-fetch';
```

## Query Implementation Rules

### Standard Query Pattern
```javascript
export function apiTableName(parameters = {}) {
  const postData = { 
    table_name: 'table_name', 
    mode: 'select', 
    data: parameters 
  };
  
  return queryOptions({
    queryKey: ['table_name', parameters],
    queryFn: async () => {
      const res = await apiFetch('all', postData);
      return res?.data ?? null;
    },
    suspense: true,
    // Add conditional enabling if needed
    enabled: !!parameters.someRequiredField
  });
}
```

### Query Key Conventions
- **Static Data**: `['table_name']` or `['table_name', 'all']`
- **Parameterized**: `['table_name', parameters]` 
- **Conditional**: `['table_name', specificValue]`
- **Versioned**: `['table_name', 'version']` for cache busting

### Suspense vs Regular Queries
- Use `suspense: true` for critical data that blocks UI rendering
- Use regular `useQuery` for optional or background data
- Always provide fallback values: `res?.data ?? null`

### Conditional Queries
```javascript
// Only run query when required data is available
return queryOptions({
  queryKey: ['table_name', requiredData],
  queryFn: async () => {
    const res = await apiFetch('all', postData);
    return res?.data ?? null;
  },
  enabled: !!requiredData.length, // or other condition
  suspense: true
});
```

## Mutation Implementation Rules

### Standard Mutation Pattern
```javascript
export const tableNameUpdate = ({ queryClient }) => ({
  mutationKey: ['table_name'],
  
  mutationFn: async ({ data, mode = 'update' }) => {
    // Apply data transformation if needed
    const transformedData = transformData(data, mode);
    
    const res = await apiFetch('all', {
      table_name: 'table_name',
      mode,
      data: transformedData
    });
    
    return res?.data ?? null;
  },
  
  onSuccess: (data, variables, context) => {
    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['table_name'] });
    
    // Cancel related queries if needed
    queryClient.cancelQueries({ queryKey: ['related_table'] });
  },
  
  onError: (error, variables, context) => {
    // Handle errors appropriately
    console.error('Mutation error:', error);
  }
});
```

### Data Transformation Rules

#### Student Data Transformation
For `info_students` table, convert flat objects to key-value pairs:

```javascript
// Input: Flat object
{
  student_id: "abc-123",
  שם: "דוד",
  משפחה: "כהן"
}

// Output: Key-value pairs
[
  { student_id: "abc-123", group_name: "שם", value: "דוד" },
  { student_id: "abc-123", group_name: "משפחה", value: "כהן" }
]

// Implementation
const transformedData = [];
data.forEach(item => {
  const { student_id } = item;
  Object.keys(item).forEach(key => {
    if (key !== 'student_id') {
      transformedData.push({
        student_id,
        group_name: key,
        value: item[key] || ''
      });
    }
  });
});
```

#### Boolean Data Transformation
For attendance data, convert between boolean and string:

```javascript
// Frontend → Backend: true/false → "100"/"0"
const toBackend = (value) => value ? "100" : "0";

// Backend → Frontend: "100"/"0" → true/false
const fromBackend = (value) => value === "100";
```

#### Delete Operations
```javascript
// Delete transformations by table
if (mode === 'delete') {
  if (table === 'users') {
    return data.map(item => ({ uuid: item.id, user_id: item.email }));
  }
  if (table === 'info_students') {
    return data.map(item => ({ student_id: item.student_id }));
  }
  return Array.isArray(data) ? data : [data];
}
```

## Cache Management Rules

### Invalidation Strategy
```javascript
// Basic invalidation
queryClient.invalidateQueries({ queryKey: ['table_name'] });

// Partial invalidation
queryClient.invalidateQueries({ queryKey: ['table_name', 'specific'] });

// Cancel ongoing queries
queryClient.cancelQueries({ queryKey: ['related_table'] });
```

### Cross-Table Dependencies
```javascript
// Example: Attendance updates affect events list
onSuccess: (data, variables, context) => {
  queryClient.invalidateQueries({ queryKey: ['data_students'] });
  queryClient.cancelQueries({ queryKey: ['list_of_events'] });
}
```

### Cache Key Consistency
- Use consistent naming: `['table_name']` not `['tableName']`
- Include relevant parameters: `['table_name', parameters]`
- Avoid dynamic keys that change frequently

## Composite Hooks Rules

### Multi-Query Patterns
```javascript
export function useTableWithOptions(tableName) {
  const [tableQuery, optionsQuery] = useSuspenseQueries({
    queries: [apiTable(), apiOptions()]
  });
  
  const tableData = tableQuery.data ?? [];
  const optionsData = optionsQuery.data ?? [];
  
  // Merge data logic
  const enrichedData = mergeTableWithOptions(tableData, optionsData, tableName);
  
  return { tableData, optionsData, enrichedData };
}
```

### Data Merging Logic
```javascript
function mergeTableWithOptions(tableData, optionsData, tableName) {
  // Filter for current table
  const tableColumns = tableData
    .filter(col => col.table_name === tableName)
    .sort((a, b) => a.sorting - b.sorting);
  
  const tableOptions = optionsData.filter(
    opt => opt.table_name === tableName
  );
  
  // Merge options into select columns
  return tableColumns.map(col => {
    if (col.type === 'select') {
      return {
        ...col,
        options: tableOptions
          .filter(opt => opt.name === col.name)
          .map(opt => ({ value: opt.value, label: opt.label }))
      };
    }
    return col;
  });
}
```

## Generic Table Hook Rules

### Universal Table Hook
```javascript
export function useGetTable(table, parameters = {}) {
  const queryClient = useQueryClient();
  
  const { data, error, isLoading } = useQuery({
    queryKey: [table, parameters],
    queryFn: async () => {
      const response = await apiFetch('all', {
        table_name: table,
        mode: 'select',
        data: parameters
      });
      return response?.data ?? null;
    },
    keepPreviousData: true
  });
  
  const { mutate, mutateAsync: originalMutateAsync } = useMutation({
    mutationFn: (params) => updateTableData(params, table),
    onMutate: async (newData) => {
      await queryClient.cancelQueries([table]);
      const previousData = queryClient.getQueryData([table]);
      return { previousData };
    },
    onError: (err, variables, context) => {
      alert(err.message); // Consider using toast notifications
      queryClient.setQueryData([table], context.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([table]);
    }
  });
  
  const mutateAsync = (newData, mode = 'update') => 
    originalMutateAsync({ data: newData, mode });
  
  return { data, error, isLoading, mutate, mutateAsync };
}
```

## Error Handling Standards

### Consistent Error Patterns
```javascript
// In queryFn
queryFn: async () => {
  try {
    const res = await apiFetch('all', postData);
    return res?.data ?? null;
  } catch (error) {
    console.error('Query error:', error);
    return null; // Return null instead of throwing
  }
}

// In mutationFn
mutationFn: async (variables) => {
  try {
    const res = await apiFetch('all', postData);
    return res?.data ?? null;
  } catch (error) {
    console.error('Mutation error:', error);
    throw error; // Re-throw for mutation error handling
  }
}
```

### User-Friendly Error Messages
```javascript
onError: (error, variables, context) => {
  const userMessage = error.message.includes('Authentication') 
    ? 'יש להתחבר מחדש למערכת'
    : `שגיאה בעדכון: ${error.message}`;
    
  toast.error(userMessage);
  
  // Rollback optimistic updates
  if (context?.previousData) {
    queryClient.setQueryData([table], context.previousData);
  }
}
```

## Creating New Actions

### Step-by-Step Guide

1. **Identify the Table/Resource**
   ```javascript
   // Determine table name and data structure
   const TABLE_NAME = 'new_table';
   ```

2. **Create Query Function**
   ```javascript
   export function apiNewTable(parameters = {}) {
     const postData = { 
       table_name: 'new_table', 
       mode: 'select', 
       data: parameters 
     };
     
     return queryOptions({
       queryKey: ['new_table', parameters],
       queryFn: async () => {
         const res = await apiFetch('all', postData);
         return res?.data ?? null;
       },
       suspense: true
     });
   }
   ```

3. **Create Mutation Function**
   ```javascript
   export const newTableUpdate = ({ queryClient }) => ({
     mutationKey: ['new_table'],
     
     mutationFn: async ({ data, mode = 'update' }) => {
       // Apply table-specific transformations
       const transformedData = transformDataForTable(data, mode);
       
       const res = await apiFetch('all', {
         table_name: 'new_table',
         mode,
         data: transformedData
       });
       
       return res?.data ?? null;
     },
     
     onSuccess: (data, variables, context) => {
       queryClient.invalidateQueries({ queryKey: ['new_table'] });
       // Invalidate related queries
     }
   });
   ```

4. **Add Data Transformation (if needed)**
   ```javascript
   function transformDataForTable(data, mode) {
     if (mode === 'delete') {
       return data.map(item => ({ id: item.id }));
     }
     
     // Apply table-specific transformations
     return Array.isArray(data) ? data : [data];
   }
   ```

5. **Test with Mock Data**
   - Add sample data to `moks/mokes.js`
   - Test query and mutation functions
   - Verify cache invalidation works

### File Naming Conventions
- **Simple queries**: `table_name.js`
- **Complex combinations**: `table_with_feature.js`
- **Utilities**: `table_utils.js`

### Export Conventions
```javascript
// Query functions: api + PascalCase
export function apiTableName() { }

// Mutation functions: camelCase + Update
export const tableNameUpdate = ({ queryClient }) => ({ });

// Utility functions: camelCase
export function useTableName() { }
```

## Reusing Existing Actions

### Before Creating New Actions

1. **Check index.md** - Review existing actions and their purposes
2. **Search for similar patterns** - Look for tables with similar data structures
3. **Identify reusable hooks** - Check if generic hooks like `useGetTable` suffice
4. **Review transformation logic** - See if existing transformations apply

### Common Reusable Patterns

#### Generic Table Operations
```javascript
// Instead of creating custom action
import { useGetTable } from 'src/actions/table';

function MyComponent() {
  const { data, mutateAsync } = useGetTable('my_table');
  // Use generic functionality
}
```

#### Column Configuration
```javascript
// Reuse column system
import { useInfoColumns } from 'src/actions/columns_with_select';

function DynamicTable() {
  const { newData: columns } = useInfoColumns('my_table');
  // Get columns with select options
}
```

#### Existing Transformations
```javascript
// Reuse student data transformation
import { infoStudentsUpdate } from 'src/actions/info_students';

// Use the same transformation logic for similar flat-to-keyvalue conversions
```

### Extending Existing Actions

#### Adding Parameters
```javascript
// Extend existing query with parameters
export function apiTableNameWithFilter(filterParams) {
  const postData = { 
    table_name: 'table_name', 
    mode: 'select', 
    data: filterParams 
  };
  
  return queryOptions({
    queryKey: ['table_name', 'filtered', filterParams],
    queryFn: async () => {
      const res = await apiFetch('all', postData);
      return res?.data ?? null;
    },
    enabled: !!filterParams.requiredField,
    suspense: true
  });
}
```

#### Adding Modes
```javascript
// Extend existing mutation with new modes
export const tableNameBulkUpdate = ({ queryClient }) => ({
  mutationKey: ['table_name', 'bulk'],
  
  mutationFn: async ({ data, mode = 'bulk_update' }) => {
    // Handle bulk operations
    const transformedData = transformForBulkOperation(data, mode);
    
    const res = await apiFetch('all', {
      table_name: 'table_name',
      mode,
      data: transformedData
    });
    
    return res?.data ?? null;
  },
  
  onSuccess: (data, variables, context) => {
    // Invalidate all related queries for bulk operations
    queryClient.invalidateQueries({ queryKey: ['table_name'] });
  }
});
```

## Best Practices

### Performance Optimization
- Use `suspense: true` for blocking queries
- Implement `keepPreviousData: true` for pagination
- Batch related queries with `useSuspenseQueries`
- Use proper query keys for cache efficiency

### Code Organization
- Group related actions in same file
- Use consistent naming conventions
- Document complex transformation logic
- Keep functions focused and single-purpose

### Testing Considerations
- Use mock data for development
- Test both success and error paths
- Verify cache invalidation works
- Test conditional query enabling

### Hebrew/RTL Considerations
- Use Hebrew field names in data structures
- Handle RTL text in error messages
- Consider Hebrew date formatting
- Test with Hebrew input data

## Common Pitfalls to Avoid

1. **Inconsistent Query Keys** - Use consistent naming patterns
2. **Missing Error Handling** - Always handle API errors gracefully
3. **Forgetting Cache Invalidation** - Mutations must invalidate related queries
4. **Improper Data Transformation** - Follow table-specific transformation rules
5. **Hardcoded Values** - Use constants and configuration
6. **Missing Conditional Queries** - Use `enabled` for dependent queries
7. **Overusing Generic Hooks** - Create specific hooks for complex logic

## Migration from Legacy Patterns

### From Direct API Calls
```javascript
// OLD - Direct API calls
const fetchData = async () => {
  const res = await apiFetch('all', { table_name: 'table' });
  return res.data;
};

// NEW - React Query pattern
const { data } = useSuspenseQuery(apiTable());
```

### From Manual Cache Management
```javascript
// OLD - Manual state management
const [data, setData] = useState([]);

// NEW - Automatic cache management
const { data, mutateAsync } = useMutation(tableUpdate({ queryClient }));
```

This comprehensive guide ensures consistency, maintainability, and proper functionality across all API actions in the attendance management system.
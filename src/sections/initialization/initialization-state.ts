import { create } from 'zustand';

// ----------------------------------------------------------------------

// Interface for column configuration following existing pattern
interface ColumnConfig {
  filters: string;
  group_name: string;
  hidden: boolean;
  label: string;
  name: string;
  required: string;
  sorting: number;
  type: string;
}

// Main state interface
interface InitializationState {
  // א. Students data from Excel file
  studentsData: any[];
  
  // ב. Raw columns list from Excel headers  
  columnsList: string[];
  
  // ג. Formatted columns with required structure
  formattedColumns: ColumnConfig[];
  
  // Actions:
  // ד. Update all three initial variables
  setStudentsData: (data: any[]) => void;
  setColumnsList: (columns: string[]) => void;
  updateInitializationData: (studentsData: any[], columnsList: string[]) => void;
  
  // ה. Generate formatted columns from columnsList
  generateFormattedColumns: () => void;
  
  // ו. Update specific column property by key-value pair
  updateColumnProperty: (columnName: string, key: string, value: any) => void;
  
  // Reset state
  resetState: () => void;
}

// ----------------------------------------------------------------------

const useInitializationStore = create<InitializationState>((set, get) => ({
  // Initial state
  studentsData: [],
  columnsList: [],
  formattedColumns: [],

  // ד. Individual setters for the three main variables
  setStudentsData: (data: any[]) => {
    set({ studentsData: data });
  },

  setColumnsList: (columns: string[]) => {
    set({ columnsList: columns });
  },

  // ד. Update both students data and columns list together
  updateInitializationData: (studentsData: any[], columnsList: string[]) => {
    set({ 
      studentsData, 
      columnsList 
    });
    // Auto-generate formatted columns after data update
    get().generateFormattedColumns();
  },

  // ה. Generate formatted columns from columnsList
  generateFormattedColumns: () => {
    const { columnsList } = get();
    
    const formattedColumns: ColumnConfig[] = columnsList.map((column, index) => ({
      filters: "",
      group_name: "",
      hidden: false,
      label: column,
      name: column,
      required: "",
      sorting: index,
      type: "text",
    }));

    set({ formattedColumns });
  },

  // ו. Update specific column property by key-value pair
  updateColumnProperty: (columnName: string, key: string, value: any) => {
    const { formattedColumns } = get();
    
    const updatedColumns = formattedColumns.map(column => {
      if (column.name === columnName) {
        return {
          ...column,
          [key]: value
        };
      }
      return column;
    });

    set({ formattedColumns: updatedColumns });
  },

  // Reset all state to initial values
  resetState: () => {
    set({
      studentsData: [],
      columnsList: [],
      formattedColumns: []
    });
  }
}));

export default useInitializationStore;
export type { ColumnConfig, InitializationState };
// state with zustand.

import { create } from 'zustand';
import { TableConfig } from './types';
  


type useTableConfigState = TableConfig & {
    initialize: (config: TableConfig) => void;
}

const useTableConfig = create<useTableConfigState>((set, get) => ({
  // Initialize with default values
  headingLinks: [],
  headingTitle: '',
  importButton: false,
  listActionsMap: undefined,
  removeAction: false,
  onDelete: undefined,
  specialRow: [],
  rowId: '',
  EditComponent: () => null,
  DetailsComponent: undefined,
  styleTable: 'default',
  pagination: false,
  addButton: false,
  defaultValues: undefined,
  tableData: [],
  tableColumns: [],
  //
  isHeader: false,
  isToolbar: false,
  initialize: (config) => {
    set(config)
    set({isHeader: config.headingTitle})
    set({isToolbar: config.listActionsMap })
  }
}))  

export default useTableConfig;
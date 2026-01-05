import { User } from "./components/full-table/user-type";


export type InfoStudent = {
  student_id: string;
  client: string;
  [key: string]: string;
}

type Row =  InfoColumn | InfoStudent | User | Template
export type Table = Row[]
 

export interface TableConfig {
  headingLinks:
    { name: string;
      href?: string
    }[];
  headingTitle: string;
  importButton?: boolean;
  listActionsMap?: FastAction[];
  removeAction?: boolean;
  onDelete?: (selected: string[]) => void;
  specialRow: ('checkbox' | 'avatar' | 'edit')[];
  rowId: string;
  EditComponent: React.ComponentType<{
    open: boolean;
    onClose: () => void;
    column: Row | Record<string, never>;
  }>;
  DetailsComponent?: React.ComponentType<{
    open: boolean;
    onClose: () => void;
    column: Row | Record<string, never>;
  }>;
  styleTable: 'default' | 'striped' | 'bordered' | 'transparent' | 'background.paper';
  pagination?: boolean;
  addButton?: boolean;
  defaultValues?: {
    [key: string]: string;
  };
  tableData: Table;
  tableColumns: InfoColumn[];
}

// Legacy types for backward compatibility
export type toolbarType = {
  listActionsMap?: FastAction[];
  removeAction?: boolean;
  onDelete?: (selected: string[]) => void;
}


export interface InfoColumn {
  client: string;
  filters: 'extra' | 'regular' | '';
  group_name: 'primary' | 'secondary' | '';
  hidden: boolean;
  label: string;
  name: string;
  required: boolean;
  sorting: number;
  table_name: string;
  type: 'text' | 'number' | 'select' | 'date' | 'address' | 'checkbox';
  options?: { value: string; label: string; icon?: string }[];
  width?: number;
}

export interface Template {
  template_id: string;
  tamplate_name: string;
  event_id: string;
  event_name: string;
  event_start: string;
  event_end: string;
  client: string;
}

export interface FastAction {
  label: string;
  icon?: string;
  onClick: () => void;
}
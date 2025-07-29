import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { expect, within } from '@storybook/test';
import { mswDecorator } from 'msw-storybook-addon';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import { FullTableWrapper } from './view';
import { TableConfig } from './types';
import { info_students, info_columns } from 'src/actions/moks/mokes';
import { handlers } from 'src/actions/moks/handlers';

// Providers
import { I18nProvider } from 'src/locales/i18n-provider';
import { LocalizationProvider } from 'src/locales';
import { ThemeProvider } from 'src/theme/theme-provider';
import { SettingsProvider, defaultSettings } from 'src/components/settings';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { Snackbar } from 'src/components/snackbar';

// Global CSS
import 'src/global.css';

// Mock EditComponent עבור הסטוריים
const MockEditComponent = ({ open, onClose, column }: { open: boolean; onClose: () => void; column: any }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>עריכת תלמיד</DialogTitle>
    <DialogContent>
      <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
        {JSON.stringify(column, null, 2)}
      </pre>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>סגור</Button>
    </DialogActions>
  </Dialog>
);

// Mock DetailsComponent עבור הסטוריים
const MockDetailsComponent = ({ open, onClose, column }: { open: boolean; onClose: () => void; column: any }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>פרטי תלמיד</DialogTitle>
    <DialogContent>
      <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
        {JSON.stringify(column, null, 2)}
      </pre>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>סגור</Button>
    </DialogActions>
  </Dialog>
);

// QueryClient עבור TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

// Mock AuthProvider עבור Storybook - פשוט יותר מהמקורי
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => children;

// Wrapper מפושט עבור Storybook
function FullTableStoryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div>טוען...</div>}>
          <I18nProvider>
            <LocalizationProvider>
              <MockAuthProvider>
                <QueryClientProvider client={queryClient}>
                  <SettingsProvider settings={defaultSettings}>
                    <ThemeProvider>
                      <MotionLazy>
                        <Snackbar />
                        {children}
                      </MotionLazy>
                    </ThemeProvider>
                  </SettingsProvider>
                </QueryClientProvider>
              </MockAuthProvider>
            </LocalizationProvider>
          </I18nProvider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

// נתוני עמודות מסוננות עבור info_students
const studentsColumns = info_columns.filter(col => col.table_name === 'info_students');

// קונפיגורציה בסיסית עבור הטבלה
const createTableConfig = (overrides: Partial<TableConfig> = {}): TableConfig => ({
  headingLinks: [
    { name: 'בית', href: '/dashboard' },
    { name: 'ניהול', href: '/management' },
    { name: 'תלמידים' }
  ],
  headingTitle: 'רשימת תלמידים',
  importButton: true,
  listActionsMap: [
    {
      label: 'ייצוא לאקסל',
      icon: 'solar:export-bold',
      onClick: action('export-clicked')
    },
    {
      label: 'הדפסה',
      icon: 'solar:printer-bold',
      onClick: action('print-clicked')
    }
  ],
  removeAction: true,
  onDelete: action('delete-clicked'),
  specialRow: ['checkbox', 'avatar', 'edit'],
  rowId: 'student_id',
  EditComponent: MockEditComponent,
  DetailsComponent: MockDetailsComponent,
  styleTable: 'default',
  pagination: true,
  addButton: true,
  defaultValues: {
    client: 'kg_gdola',
    user_id: 'storybook-user@example.com'
  },
  tableData: info_students,
  tableColumns: studentsColumns,
  ...overrides
});

const meta: Meta<typeof FullTableWrapper> = {
  title: 'מערכת/טבלה מלאה',
  component: FullTableWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'קומפוננטת FullTable - טבלה מלאה עם תמיכה בעריכה, מחיקה, פילטור ועוד'
      }
    },
    msw: {
      handlers
    }
  },
  decorators: [
    mswDecorator,
    (Story) => (
      <FullTableStoryWrapper>
        <Story />
      </FullTableStoryWrapper>
    ),
  ],
  argTypes: {
    config: {
      control: false,
      description: 'קונפיגורציה של הטבלה'
    }
  }
};

export default meta;
type Story = StoryObj<typeof FullTableWrapper>;

// סיפור בסיסי - טבלה פשוטה
export const Basic: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'טבלה בסיסית',
      importButton: false,
      listActionsMap: [],
      removeAction: false,
      pagination: false,
      addButton: false,
      specialRow: [],
      styleTable: 'default'
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה בסיסית עם נתונים מינימליים, ללא פעולות מיוחדות'
      }
    }
  }
};

// סיפור מלא - טבלה עם כל התכונות
export const FullFeatured: Story = {
  args: {
    config: createTableConfig()
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה מלאה עם כל התכונות: עריכה, מחיקה, פילטור, pagination ועוד'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // בדיקה שהטבלה נטענה
    await expect(canvas.getByText('רשימת תלמידים')).toBeInTheDocument();
    
    // בדיקה שיש נתונים בטבלה
    const rows = canvas.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // יותר מהשורה של header
  }
};

// סיפור טבלה ריקה
export const Empty: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'טבלה ריקה',
      tableData: [],
      pagination: false
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה ריקה - מצב בו אין נתונים להצגה'
      }
    }
  }
};

// סיפור עם עמודות מוסתרות
export const WithHiddenColumns: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'עמודות מוסתרות',
      tableColumns: studentsColumns.map(col => ({
        ...col,
        hidden: ['student_id', 'client', 'user_id'].includes(col.name) || col.hidden
      }))
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה עם עמודות מוסתרות (student_id, client, user_id)'
      }
    }
  }
};

// סיפור עם סגנון טבלה שונה
export const StripedTable: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'טבלה מפוספסת',
      styleTable: 'striped'
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה עם סגנון מפוספס'
      }
    }
  }
};

// סיפור ללא pagination
export const WithoutPagination: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'ללא עמוד',
      pagination: false
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה ללא pagination - כל הנתונים מוצגים בעמוד אחד'
      }
    }
  }
};

// סיפור עם פעולות מוגבלות
export const LimitedActions: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'פעולות מוגבלות',
      specialRow: ['checkbox'],
      removeAction: false,
      addButton: false,
      importButton: false,
      listActionsMap: []
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה עם פעולות מוגבלות - רק checkbox לבחירה'
      }
    }
  }
};

// סיפור עם נתונים מועטים
export const SmallDataset: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'נתונים מועטים',
      tableData: info_students.slice(0, 3),
      pagination: false
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה עם מספר מועט של נתונים (3 שורות)'
      }
    }
  }
};

// סיפור עם רק עמודות עיקריות
export const PrimaryColumnsOnly: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'עמודות עיקריות',
      tableColumns: studentsColumns.filter(col => 
        col.group_name === 'primary' || ['שם', 'משפחה', 'מספר_טלפון'].includes(col.name)
      )
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה עם עמודות עיקריות בלבד'
      }
    }
  }
};

// סיפור עם רקע שקוף
export const TransparentBackground: Story = {
  args: {
    config: createTableConfig({
      headingTitle: 'רקע שקוף',
      styleTable: 'transparent'
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'טבלה עם רקע שקוף'
      }
    }
  }
};
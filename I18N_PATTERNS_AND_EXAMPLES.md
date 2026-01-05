# i18n Implementation Examples & Patterns

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Form Integration](#form-integration)
3. [Dynamic Lists](#dynamic-lists)
4. [Error Handling](#error-handling)
5. [Advanced Patterns](#advanced-patterns)
6. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## Basic Usage

### Simple Component Translation

```jsx
import { useTranslate } from 'src/locales/use-locales';

export function MyComponent() {
  const { t } = useTranslate();
  
  return (
    <Box>
      <Typography variant="h6">{t('screens.overview')}</Typography>
      <Button>{t('common.save')}</Button>
      <Button>{t('common.cancel')}</Button>
    </Box>
  );
}
```

### Page Title Translation

```jsx
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales/use-locales';

export default function DetailsPage() {
  const { t } = useTranslate();
  const metadata = { 
    title: `${t('screens.details')} | ${CONFIG.appName}` 
  };
  
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      {/* Page content */}
    </>
  );
}
```

---

## Form Integration

### Form Field Labels

```jsx
import { useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';
import { useTranslate } from 'src/locales/use-locales';

export function UserForm() {
  const { t } = useTranslate();
  const methods = useForm();
  
  return (
    <Form methods={methods}>
      <Field.Text
        name="firstName"
        label={t('users.firstName')}
        required
      />
      
      <Field.Text
        name="lastName"
        label={t('users.lastName')}
        required
      />
      
      <Field.Text
        name="email"
        label={t('users.email')}
        type="email"
      />
      
      <Button type="submit">{t('common.save')}</Button>
      <Button>{t('common.cancel')}</Button>
    </Form>
  );
}
```

### Form Validation Messages

```jsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from 'src/locales/use-locales';

export function ExceptionForm() {
  const { t } = useTranslate();
  
  const schema = z.object({
    startDate: z.string().min(1, t('exceptions.startDate') + ' ' + t('common.required')),
    endDate: z.string().min(1, t('exceptions.endDate') + ' ' + t('common.required')),
    reason: z.string().min(1, t('exceptions.reason') + ' ' + t('common.required')),
    students: z.array(z.string()).min(1, t('exceptions.students') + ' ' + t('common.required')),
  });
  
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  
  return (
    <Form methods={methods}>
      {/* Form fields */}
    </Form>
  );
}
```

---

## Dynamic Lists

### Status/Type Lists with Translations

```jsx
import { useTranslate } from 'src/locales/use-locales';

function AttendanceStatusList() {
  const { t } = useTranslate();
  
  const statusList = [
    {
      value: 'present',
      label: t('attendance.present'),
      tooltip: t('attendance.presentTooltip'),
    },
    {
      value: 'absent',
      label: t('attendance.absent'),
      tooltip: t('attendance.absentTooltip'),
    },
    {
      value: 'delayed',
      label: t('attendance.delayed'),
      tooltip: t('attendance.delayedTooltip'),
    },
    {
      value: 'exceptional',
      label: t('attendance.exceptional'),
      tooltip: t('attendance.exceptionalTooltip'),
    },
  ];
  
  return (
    <>
      {statusList.map(status => (
        <Tooltip key={status.value} title={status.tooltip}>
          <Chip label={status.label} color={getColor(status.value)} />
        </Tooltip>
      ))}
    </>
  );
}
```

### Dynamic Map Creation

```jsx
import { useTranslate } from 'src/locales/use-locales';

const getAttendanceText = (t) => ({
  'present': t('attendance.present'),
  'absent': t('attendance.absent'),
  'delayed': t('attendance.delayed'),
  'exceptional': t('attendance.exceptional'),
});

const getColumnTypes = (t) => ({
  'text': t('columns.typeText'),
  'number': t('columns.typeNumber'),
  'date': t('columns.typeDate'),
  'email': t('columns.typeEmail'),
});

export function MyComponent() {
  const { t } = useTranslate();
  const attendanceText = getAttendanceText(t);
  const columnTypes = getColumnTypes(t);
  
  // Use attendanceText and columnTypes
}
```

---

## Error Handling

### Error Page Components

```jsx
import { useTranslate } from 'src/locales/use-locales';
import { RouterLink } from 'src/routes/components';

export function ErrorView403() {
  const { t } = useTranslate();
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        {t('errors.forbidden')}
      </Typography>
      
      <Typography sx={{ color: 'text.secondary' }}>
        {t('errors.forbiddenMessage')}
      </Typography>
      
      <Button 
        component={RouterLink} 
        href="/"
      >
        {t('errors.goHome')}
      </Button>
    </Box>
  );
}
```

### Toast Notifications

```jsx
import { toast } from 'sonner';
import { useTranslate } from 'src/locales/use-locales';

export function SaveAction() {
  const { t } = useTranslate();
  
  const handleSave = async (data) => {
    const savePromise = apiSave(data);
    
    toast.promise(savePromise, {
      loading: t('common.loading'),
      success: t('common.success'),
      error: t('common.error'),
    });
    
    await savePromise;
  };
  
  return <Button onClick={handleSave}>{t('common.save')}</Button>;
}
```

---

## Advanced Patterns

### Multi-Level Navigation Keys

```jsx
import { useTranslate } from 'src/locales/use-locales';

export function Navigation() {
  const { t } = useTranslate();
  
  const menuItems = [
    {
      label: t('screens.overview'),
      href: '/dashboard',
      icon: 'overview',
    },
    {
      label: t('screens.insert'),
      href: '/attendance',
      icon: 'attendance',
    },
    {
      label: t('groups.attendance'),
      section: true,
      items: [
        {
          label: t('screens.summary'),
          href: '/summary',
        },
        {
          label: t('screens.exceptions'),
          href: '/exceptions',
        },
      ],
    },
  ];
  
  return (
    <List>
      {menuItems.map(item => (
        <ListItem key={item.label}>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );
}
```

### Conditional Translation

```jsx
import { useTranslate } from 'src/locales/use-locales';
import { useAuthContext } from 'src/auth/hooks';

export function UserRole() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  
  const roleKey = user.role === 'admin' ? 'users.admin' : 'users.user';
  
  return <Chip label={t(roleKey)} />;
}
```

### Parameter Interpolation

```jsx
// common.json
{
  "welcome": "Welcome, {{name}}!",
  "itemCount": "You have {{count}} items"
}

// Component
export function Dashboard() {
  const { t } = useTranslate();
  
  return (
    <>
      <Typography>{t('welcome', { name: 'John' })}</Typography>
      <Typography>{t('itemCount', { count: 5 })}</Typography>
    </>
  );
}
```

---

## Common Mistakes to Avoid

### ❌ WRONG: Hardcoded strings

```jsx
// DON'T DO THIS
export function BadComponent() {
  return (
    <>
      <Button>Save</Button>
      <Typography>Welcome to the system</Typography>
    </>
  );
}
```

### ✅ CORRECT: Use i18n

```jsx
// DO THIS
export function GoodComponent() {
  const { t } = useTranslate();
  
  return (
    <>
      <Button>{t('common.save')}</Button>
      <Typography>{t('initialization.welcome')}</Typography>
    </>
  );
}
```

---

### ❌ WRONG: Forgetting to use t function

```jsx
export function BadForm() {
  const { t } = useTranslate();
  
  return (
    <Field.Text
      name="email"
      label="Email"  // ❌ Not translated!
      placeholder={t('users.email')}  // ✅ Partially translated
    />
  );
}
```

### ✅ CORRECT: All text translated

```jsx
export function GoodForm() {
  const { t } = useTranslate();
  
  return (
    <Field.Text
      name="email"
      label={t('users.email')}  // ✅ Translated
      placeholder={t('users.email')}  // ✅ Translated
    />
  );
}
```

---

### ❌ WRONG: Creating text outside component

```jsx
// DON'T DO THIS - t is not available here
const statusLabels = {
  'present': t('attendance.present'),  // ❌ Error! t is not in scope
  'absent': t('attendance.absent'),
};

export function Component() {
  return <div>{statusLabels.present}</div>;
}
```

### ✅ CORRECT: Create text inside component or as function

```jsx
// DO THIS - create function that receives t
const getStatusLabels = (t) => ({
  'present': t('attendance.present'),
  'absent': t('attendance.absent'),
});

export function Component() {
  const { t } = useTranslate();
  const labels = getStatusLabels(t);
  
  return <div>{labels.present}</div>;
}
```

---

### ❌ WRONG: Inconsistent key naming

```jsx
// DON'T MIX NAMING CONVENTIONS
{
  "Save": "שמור",           // ❌ Inconsistent
  "user.firstName": "שם",   // ✓
  "Users_LastName": "שם",   // ❌ Wrong format
  "common.cancel": "ביטול", // ✓
}
```

### ✅ CORRECT: Consistent naming

```jsx
// USE CONSISTENT PATTERN: category.subcategory.item
{
  "common": {
    "save": "שמור",
    "cancel": "ביטול"
  },
  "users": {
    "firstName": "שם פרטי",
    "lastName": "שם משפחה"
  }
}
```

---

### ❌ WRONG: Not handling missing translations

```jsx
// ASSUMES TRANSLATION EXISTS
export function Component() {
  const { t } = useTranslate();
  
  return <Button>{t('some.nonexistent.key')}</Button>;  // ❌ Might show fallback
}
```

### ✅ CORRECT: Use existing keys or add them

```jsx
// ALWAYS VERIFY KEY EXISTS IN ALL LANGUAGE FILES
export function Component() {
  const { t } = useTranslate();
  
  return <Button>{t('common.save')}</Button>;  // ✅ Key verified in all files
}
```

---

## Testing Patterns

### Component Test with i18n

```jsx
import { render, screen } from '@testing-library/react';
import { I18nProvider } from 'src/locales/i18n-provider';
import MyComponent from './my-component';

describe('MyComponent', () => {
  it('should display translated text', () => {
    render(
      <I18nProvider>
        <MyComponent />
      </I18nProvider>
    );
    
    expect(screen.getByText('Save')).toBeInTheDocument();  // English
  });
});
```

### Language Switching Test

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTranslate } from 'src/locales/use-locales';

describe('Language Switching', () => {
  it('should update UI when language changes', async () => {
    const TestComponent = () => {
      const { t, i18n } = useTranslate();
      
      return (
        <>
          <div>{t('common.save')}</div>
          <button onClick={() => i18n.changeLanguage('en')}>
            English
          </button>
          <button onClick={() => i18n.changeLanguage('he')}>
            Hebrew
          </button>
        </>
      );
    };
    
    render(<TestComponent />);
    
    expect(screen.getByText('Save')).toBeInTheDocument();
    
    await userEvent.click(screen.getByText('Hebrew'));
    expect(screen.getByText('שמור')).toBeInTheDocument();
  });
});
```

---

## Key Structure Reference

```
NAMESPACE: common
├── common
│   ├── save
│   ├── cancel
│   ├── delete
│   ├── edit
│   ├── add
│   ├── search
│   ├── filter
│   ├── export
│   ├── import
│   ├── loading
│   ├── error
│   ├── success
│   └── required
│
├── screens
│   ├── overview
│   ├── insert
│   ├── profile
│   ├── info
│   ├── users
│   ├── templates
│   ├── days
│   ├── exceptions
│   ├── details
│   ├── scan
│   ├── download
│   ├── summary
│   └── tests
│
├── groups
│   ├── attendance
│   ├── dataManagement
│   └── timeManagement
│
├── attendance
│   ├── present
│   ├── absent
│   ├── delayed
│   ├── exceptional
│   ├── presentTooltip
│   ├── absentTooltip
│   ├── delayedTooltip
│   └── exceptionalTooltip
│
├── errors
│   ├── forbidden
│   ├── forbiddenMessage
│   ├── notFound
│   ├── serverError
│   └── goHome
│
└── [additional categories...]
```

---

## Migration Checklist for New Features

When adding new features, ensure:

- [ ] All UI text uses `t('key')` pattern
- [ ] All translation keys added to he/common.json
- [ ] All translation keys added to en/common.json
- [ ] All translation keys added to fr/common.json
- [ ] All translation keys added to yi/common.json
- [ ] Consistent key naming convention followed
- [ ] No hardcoded strings in components
- [ ] Form labels translated
- [ ] Error messages translated
- [ ] Tooltips translated
- [ ] Tested in at least 2 languages

---

*Last Updated: December 28, 2025*

# מדריך לכתיבת טפסים במערכת

## מבנה בסיסי

### 1. יבואים נדרשים
```jsx
import { z as zod } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Field } from 'src/components/hook-form';
import { schemaHelper } from 'src/components/hook-form/schema-helper';
```

### 2. הגדרת סכמת ולידציה
```jsx
const FormSchema = zod.object({
  name: zod.string().min(1, { message: 'שדה חובה!' }),
  email: zod.string().email({ message: 'כתובת דואר אלקטרוני לא תקינה!' }),
  phone: schemaHelper.phoneNumber({ message: { required_error: 'נדרש מספר טלפון!' } }),
  date: schemaHelper.date({ message: { required_error: 'נדרש תאריך!' } }),
});
```

### 3. ערכי ברירת מחדל
```jsx
const defaultValues = {
  name: '',
  email: '',
  phone: '',
  date: null,
};
```

## יצירת טופס

### 1. הגדרת useForm
```jsx
const methods = useForm({
  mode: 'onChange', // או 'onBlur' / 'onSubmit'
  resolver: zodResolver(FormSchema),
  defaultValues,
});

const { handleSubmit, formState: { isSubmitting } } = methods;
```

### 2. פונקציית שליחה
```jsx
const onSubmit = handleSubmit(async (data) => {
  try {
    await apiCall(data);
    toast.success('הפעולה בוצעה בהצלחה!');
  } catch (error) {
    toast.error('שגיאה בביצוע הפעולה');
  }
});
```

### 3. רינדור הטופס
```jsx
return (
  <Form methods={methods} onSubmit={onSubmit}>
    <Field.Text 
      name="name" 
      label="שם מלא"
      variant="filled"
      fullWidth
    />
    
    <Field.Text 
      name="email" 
      label="דואר אלקטרוני"
      type="email"
      variant="filled"
      fullWidth
    />
    
    <Field.PhoneInput 
      name="phone" 
      label="טלפון"
      variant="filled"
      fullWidth
    />
    
    <Field.HebrewDatePicker 
      name="date" 
      label="תאריך"
    />
    
    <LoadingButton
      type="submit"
      variant="contained"
      loading={isSubmitting}
    >
      שלח
    </LoadingButton>
  </Form>
);
```

## רכיבי Form זמינים

### שדות טקסט
- `Field.Text` - שדה טקסט רגיל
- `Field.Editor` - עורך טקסט עשיר
- `Field.Code` - קוד/OTP

### בחירות
- `Field.Select` - תפריט נפתח
- `Field.Autocomplete` - חיפוש אוטומטי
- `Field.RadioGroup` - כפתורי רדיו
- `Field.Checkbox` - תיבת סימון
- `Field.Switch` - מתג

### תאריכים
- `Field.DatePicker` - בחירת תאריך
- `Field.HebrewDatePicker` - תאריך עברי

### אחרים
- `Field.PhoneInput` - מספר טלפון
- `Field.CountrySelect` - בחירת מדינה
- `Field.Upload` - העלאת קובץ
- `Field.Rating` - דירוג
- `Field.Slider` - מחוון

## סוגי ולידציה נפוצים

### schemaHelper - עוזרים למגוון סוגים
```jsx
// טלפון
phone: schemaHelper.phoneNumber()

// תאריך
date: schemaHelper.date()

// קובץ
file: schemaHelper.file()

// קבצים (מרובים)
files: schemaHelper.files({ minFiles: 2 })

// אובייקט
object: schemaHelper.objectOrNull()

// בוליאני
isRequired: schemaHelper.boolean()
```

### ולידציה מותאמת אישית
```jsx
const FormSchema = zod.object({
  password: zod.string()
    .min(8, 'סיסמה חייבת להכיל לפחות 8 תווים')
    .regex(/[A-Z]/, 'סיסמה חייבת להכיל אות גדולה'),
  
  confirmPassword: zod.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות אינן תואמות",
  path: ["confirmPassword"],
});
```

## טיפים נוספים

### שימוש ב-TanStack Query
```jsx
const mutate = useMutation({
  mutationFn: apiCall,
  onSuccess: () => {
    toast.success('הפעולה בוצעה בהצלחה!');
    queryClient.invalidateQueries(['key']);
  },
  onError: () => {
    toast.error('שגיאה בביצוע הפעולה');
  }
});

const onSubmit = handleSubmit(async (data) => {
  mutate.mutate(data);
});
```

### שימוש ב-Toast להודעות
```jsx
import { toast } from 'sonner';

// הודעה עם Promise
toast.promise(apiCall(data), {
  loading: 'מעדכן...',
  success: 'העדכון הצליח!',
  error: 'העדכון נכשל!',
});
```

### מצבי טעינה
```jsx
<LoadingButton
  type="submit"
  variant="contained"
  loading={isSubmitting}
>
  שלח
</LoadingButton>
```
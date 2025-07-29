
export const INFO_TABLE = [
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: true,
        label: "טבלה",
        name: "table_name",
        required: "",
        sorting: "1.0",
        table_name: "info_columns",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "secondary",
        hidden: true,
        label: "שם עמודה",
        name: "name",
        required: "",
        sorting: "2.0",
        table_name: "info_columns",
        type: "text",

    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "",
        label: "תיאור עמודה",
        name: "label",
        required: "",
        sorting: "3.0",
        table_name: "info_columns",
        type: "text",
        width: 120
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "",
        label: "סוג עמודה",
        name: "type",
        required: "",
        sorting: "4.0",
        table_name: "info_columns",
        type: "text",
        width: 120,
        options: [
          { value: 'text', label: 'טקסט חופשי' , icon: 'solar:text-field-bold'},
          { value: 'number', label: 'מספר' , icon: 'solar:calculator-bold'},
          { value: 'select', label: 'בחירה' , icon: 'solar:list-check-bold'},
          { value: 'relationship', label: 'קשר' , icon: 'solar:share-bold'},
          { value: 'date', label: 'תאריך' , icon: 'solar:calendar-date-bold'},
          { value: 'hidden', label: 'מוסתר' , icon: 'solar:eye-closed-bold'},
          { value: 'address', label: 'כתובת' , icon: 'solar:location-bold'},
          { value: 'checkbox', label: 'תיבת סימון' , icon: 'solar:check-square-bold'}
        ]
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "",
        label: "סינון",
        name: "filters",
        required: "",
        sorting: "5.0",
        table_name: "info_columns",
        type: "text",
        options: [
          { value: 'extra', label: 'נגיש' , icon: 'solar:verified-check-bold'},
          { value: 'regular', label: 'רגיל' , icon: 'solar:filter-bold'},
          { value: '', label: '-' , icon: 'solar:forbidden-bold'}
        ]
         
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "",
        label: "הסתרה",
        name: "hidden",
        required: "",
        sorting: "6.0",
        table_name: "info_columns",
        type: "text",
        options: [
          { value: '1.0', label: 'מוסתר' , icon: 'solar:eye-closed-bold'},
          { value: '', label: 'גלוי' , icon: 'solar:eye-bold'}
        ]
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "",
        label: "חובה",
        name: "required",
        required: "",
        sorting: "7.0",
        table_name: "info_columns",
        type: "text",
        options: [
          { value: 'true', label: 'חובה' , icon: 'solar:check-square-bold'},
          { value: 'false', label: 'לא חובה' , icon: 'solar:document-text-bold'}
        ]
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "",
        label: "סדר",
        name: "sorting",
        required: "",
        sorting: "8.0",
        table_name: "info_columns",
        type: "text",

    },
    {
        client: "kg_gdola",
        filters: "extra",
        group_name: "",
        hidden: "",
        label: "תיאור",
        name: "group_name",
        required: "",
        sorting: "11.0",
        table_name: "info_columns",
        type: "select",
        options: [
          { value: 'primary', label: 'ראשי' , icon: 'solar:check-square-bold'},
          { value: 'secondary', label: 'משני' , icon: 'solar:document-text-bold'},
          { value: '', label: '-' , icon: 'solar:minus-bold'}
        ]
    }
  ]
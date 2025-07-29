
export const columnsTypes = {
    text: {
        type: 'text',
        icon: 'mdi:format-text',
        label: 'טקסט',
        description: 'שדה טקסט חופשי',
    },
    number: {
        type: 'number',
        icon: 'mdi:numeric',
        label: 'מספר',
        description: 'שדה מספרי',
    },
    date: {
        type: 'date',
        icon: 'mdi:calendar',
        label: 'תאריך',
        description: 'שדה תאריך',
    },
    email: {
        type: 'email',
        icon: 'mdi:email',
        label: 'אימייל',
        description: 'שדה אימייל',
    },
    phone: {
        type: 'phone',
        icon: 'mdi:phone',
        label: 'טלפון',
        description: 'שדה טלפון',
    },
    select: {
        type: 'select',
        icon: 'mdi:chevron-down',
        label: 'בחירה מתוך רשימה',
        description: 'שדה בחירה מתוך רשימה',
    },
    checkbox: {
        type: 'checkbox',
        icon: 'mdi:check-box-outline-blank',
        label: 'תיבת סימון',
        description: 'שדה תיבת סימון',
    },
    address: {
        type: 'address',
        icon: 'mdi:map-marker',
        label: 'כתובת',
        description: 'שדה כתובת עם Google Maps API',
    },
    country: {
        type: 'country',
        icon: 'mdi:earth',
        label: 'מדינה',
        description: 'שדה בחירת מדינה',
    }
}
export const columnTypeOptions =  Object.values(columnsTypes).map((type) => ({
    value: type.type,
    label: type.label,
    icon: type.icon,
    description: type.description
}))
  
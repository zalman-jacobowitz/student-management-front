
/*
table form server 
{
    "client": "client1",
    "event_end": "12:00:00",
    "event_id": "EV001",
    "event_name": "Morning Session",
    "event_start": "08:00:00",
    "template_id": "TEMP001"
}
 * 
 */


export const INFO_TEMPLATES = [
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "מזהה תבנית",
        name: "template_id",
        required: "",
        sorting: "0.0",
        table_name: "templates",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "שם תבנית",
        name: "template_name",
        required: "",
        sorting: "1.0",
        table_name: "templates",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: true,
        label: "מזהה אירוע",
        name: "event_id",
        required: "",
        sorting: "1.0",
        table_name: "templates",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "secondary",
        hidden: true,
        label: "שם אירוע",
        name: "event_name",
        required: "",
        sorting: "2.0",
        table_name: "templates",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: true,
        hidden: "",
        label: "תאריך התחלה",
        name: "event_start",
        required: "",
        sorting: "3.0",
        table_name: "templates",
        type: "date",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name:true,
        hidden: "",
        label: "תאריך סיום",
        name: "event_end",
        required: "",
        sorting: "4.0",
        table_name: "templates",
        type: "date",
    }
    
  ]
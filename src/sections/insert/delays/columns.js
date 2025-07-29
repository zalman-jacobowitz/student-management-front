
/*
Table delays {
  delay_id varbinary
  arrival_time varchar
  delay_minutes varchar
  reason varchar
  student_id varbinary
}

 */


export const INFO_DELAYS = [
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: true,
        label: "מזהה איחור",
        name: "delay_id",
        required: "",
        sorting: "0.0",
        table_name: "delays",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "שעת הגעה",
        name: "arrival_time",
        required: "required",
        sorting: "1.0",
        table_name: "delays",
        type: "time",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "דקות איחור",
        name: "delay_minutes",
        required: "required",
        sorting: "2.0",
        table_name: "delays",
        type: "number",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "סיבה",
        name: "reason",
        required: "",
        sorting: "3.0",
        table_name: "delays",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: true,
        label: "מזהה תלמיד",
        name: "student_id",
        required: "required",
        sorting: "4.0",
        table_name: "delays",
        type: "text",
    },
  ]
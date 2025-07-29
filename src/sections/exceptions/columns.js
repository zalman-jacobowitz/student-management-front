/*
Table exceptions {
student_id varchar
  exception_id varchar
  start varchar
  end varchar
  reason varchar
}
*/

export const INFO_EXCEPTIONS = [
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "תלמיד",
        name: "student_id",
        required: "",
        sorting: "0.0",
        table_name: "exceptions",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "מזהה אישור",
        name: "exception_id",
        required: "",
        sorting: "0.0",
        table_name: "exceptions",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "תחילת אישור",
        name: "start",
        required: "true",
        sorting: "1.0",
        table_name: "exceptions",
        type: "date",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "primary",
        hidden: "",
        label: "סיום אישור",
        name: "end",
        required: "true",
        sorting: "2.0",
        table_name: "exceptions",
        type: "date",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "secondary",
        hidden: "",
        label: "סיבה",
        name: "reason",
        required: "true",
        sorting: "3.0",
        table_name: "exceptions",
        type: "text",
    }
]
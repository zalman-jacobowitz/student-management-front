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
        name: "students",
        required: "",
        width: 250,
        sorting: 1,
        table_name: "exceptions",
        type: "text",
    },
      {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "1",
        label: "מזהה אישור",
        name: "exception_id",
        required: "true",
        sorting: 10,
        table_name: "exceptions",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "",
        label: "תחילת אישור",
        name: "start",
        required: "true",
        sorting: 3,
        table_name: "exceptions",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "",
        hidden: "",
        label: "סיום אישור",
        name: "end",
        required: "true",
        sorting: 4,
        table_name: "exceptions",
        type: "text",
    },
    {
        client: "kg_gdola",
        filters: "",
        group_name: "secondary",
        hidden: "",
        label: "סיבה",
        name: "reason",
        required: "true",
        sorting: 5,
        table_name: "exceptions",
        type: "text",
    }
]
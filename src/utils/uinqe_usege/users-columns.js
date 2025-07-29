
export const USERS_COLUMNS = [
    {
           "filters": "extra",
           "group_name": "primary",
           "hidden": "1",
           "label": "שם",
           "name": "firstName",
           "required": "",
           "sorting": "",
           "table_name": "info_students",
           "type": "checkbox"
       },
    {
           "filters": "regular",
           "group_name": "primary",
           "hidden": "1",
           "label": "משפחה",
           "name": "lastName",
           "required": "t",
           "sorting": 1,
           "table_name": "info_students",
           "type": "text"
       },
    {
           "filters": "",
           "group_name": "",
           "hidden": "",
           "label": "ארץ",
           "name": "country",
           "required": "",
           "sorting": 2,
           "table_name": "info_students",
           "type": "text"
       },
    {
           "filters": "extra",
           "group_name": "",
           "hidden": "",
           "label": "בתאריך",
           "name": "created_at",
           "required": "",
           "sorting": 4,
           "table_name": "info_students",
           "type": "text"
       },
       {
         "filters": "",
         "group_name": "",
         "hidden": "",
         "label": "אומת",
         "name": "verified",
         "required": "",
         "sorting": 5,
         "table_name": "info_students",
         "type": "text"
     },
     {
       "filters": "",
       "group_name": "secondary",
       "hidden": "",
       "label": "אימייל",
       "name": "email",
       "required": "",
       "sorting": 6,
       "table_name": "info_students",
       "type": "text"
   }
   ]
// קומפוננטה להצגת משתמש אחד

import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiUsers } from "src/actions/users";
import { useBoolean } from "src/hooks/use-boolean";
import { NewDialog } from "./new-form";
import { useState } from "react";

// קומפוננטה להצגת פרטים נוספים על כל משתמש - סרגל צד


// טופס הוספה ועריכה של משתמשים:

/*
מבנה של טופס לצורך עריכה:

    user: {
        email,
        country,
        lastName,
        firstName
    },
    screens: {
      "info": true,
      "insert": true,
    },
    permissions: [
      {
        // צד שרת או לקוח
        "side": "server",
        // שם העמודה
        "label": "מייל",
        // שם הטבלה
        "table": "info_students",
        // הערכים לסינון
        "values": [
          "chabadbyronshire@gmail.com"
        ],
        // אופרטור לסינון
        "operator": "and",
        // שם העמודה במערכת - המזהה של העמודה
        "columnName": "user_id"
      }
    ]
*/

// שלב ראשון - נתוני משתמש
// מסכים אפשריים
// רשימת הגבלות למשתמש



export function NewList() {
    // קריאה לרשימת המשתמשים
    const users = useSuspenseQuery(apiUsers()).data;
    const dialogOpen = useBoolean();
    const [user, setUser] = useState(null);

    return (
    <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, m:2 }}>
        {
    users.map((user) => (
        <ListItem key={user.id} onClick={() => { setUser(user); dialogOpen.onTrue(); }} sx={{ cursor: 'pointer', border: '1px solid #ddd', borderRadius: 1 }}>
             <ListItemAvatar >
                <Avatar src={user.avatarUrl || ''} alt={`${user.firstName} ${user.lastName}`} />
              </ListItemAvatar>
            <ListItemText
                primary={`${user.firstName} ${user.lastName}`}
                secondary={user.email}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <div>מסכים: {user.screens ? Object.keys(user.screens).filter(screen => user.screens[screen]).join(', ') : 'אין'}</div>
              <div>הרשאות: {user.permissions ? user.permissions.length : 0}</div>
            </Box>
        </ListItem>
    ))
        }
    <NewDialog
          open={dialogOpen.value}
          onClose={dialogOpen.onFalse}
          onComplete={(data) => console.log('Dialog complete:', data)}
          existingUser={user}
          editMode={false}
        />
    </List>
);}
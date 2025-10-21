import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useInfoColumns } from "src/actions/columns_with_select";

import { LoadingScreen } from "src/components/loading-screen";
import { apiInfoStudents } from "src/actions/info_students";

import useInsertStore from "../insert-state";
import { InsertListView } from "../insert-screen/insert-screen";
import { InsertForm } from "../form-event/insert-form-defind-event";




function InsertView() {
  // המסך הכנסת הנתונים מורכב משניים לכן מנוהל על ידי סטייט גלובאלי
  // כמו כן כדי לשמור על הנתונים בין סדרים שונים

  //  המסך שנבחר לתצוגה הוא
  const screen = useInsertStore((state) => state.screen);
  
  // אם המסך הוא של הכנסת אירוע
  if (screen === 'form') {
    // BUG: יש לשפר את הטייפים
    // אין צורך בשליפת הנתונים מחדש כי הם כבר קיימים במטמון - אפשר לקרואלהם בקומפוננטה
    return (
      <InsertForm />
    );
  }
  return (
    <InsertListView />
  );
}


export default function InsertViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}> 
      <InsertView />
    </Suspense>
  );
}
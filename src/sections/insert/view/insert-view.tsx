import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useInfoColumns } from "src/actions/columns_with_select";

import { LoadingScreen } from "src/components/loading-screen";
import { apiInfoStudents } from "src/actions/info_students";

import useInsertStore from "../insert-state";
import { InsertListView } from "../insert-screen/insert-screen";
import { InsertForm } from "../form-event/insert-form-defind-event";




function InsertView() {
  const selectEventScreen = useInsertStore((state) => state.selectEventScreen);
  
  const { newData: infoColumns } = useInfoColumns('info_students');
  const infoStudents = useSuspenseQuery(apiInfoStudents())
  if (selectEventScreen) {
    return (
      <InsertForm infoStudents={(infoStudents.data as any[]) || []} infoColumns={infoColumns}/>
    );
  }
  return (
    <InsertListView infoStudents={(infoStudents.data as any[]) || []} infoColumns={infoColumns} />
  );
}


export default function InsertViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}> 
      <InsertView />
    </Suspense>
  );
}
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useInfoColumns } from "src/actions/columns_with_select";

import { LoadingScreen } from "src/components/loading-screen";
import { apiInfoStudents } from "src/actions/info_students";

import useInsertStore from "../insert-state";
import { InsertListView } from "../insert-screen/insert-screen";
import { InsertForm } from "../form-event/insert-form-defind-event";




export default function InsertViewWrapper() {
  const { screen } = useInsertStore();

  return (
    <Suspense fallback={<LoadingScreen />}> 
      { screen === 'form' ? <InsertForm /> : <InsertListView /> }
    </Suspense>
  );
}
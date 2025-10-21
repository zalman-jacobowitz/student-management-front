import { Suspense } from "react";
import { LoadingScreen } from "src/components/loading-screen";

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
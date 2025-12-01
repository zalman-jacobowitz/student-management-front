import { Suspense } from "react";
import { LoadingScreen } from "src/components/loading-screen";
import { useWalktour, Walktour } from "src/components/walktour";

import useInsertStore from "../insert-state";
import { InsertListView } from "../insert-screen/insert-screen";

import { InsertForm } from "../form-event/insert-form-defind-event";



const walktourSteps = [
  // TODO: Add walktour steps here
];

export default function InsertViewWrapper() {
  const { screen } = useInsertStore();
  const walktour = <Walktour {...useWalktour({steps: walktourSteps})} />

  return (
    <Suspense fallback={<LoadingScreen />}> 
      <>
        { screen === 'form' ? <InsertForm /> : <InsertListView /> }
        {walktour}
      </>
    </Suspense>
  );
}
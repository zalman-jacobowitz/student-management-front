import { Suspense } from "react";
import { LoadingScreen } from "src/components/loading-screen";

export function TestsViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      tests
    </Suspense>
  );
}
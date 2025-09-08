import { Suspense } from "react";
import { LoadingScreen } from "src/components/loading-screen";

export function DetailsViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      213
    </Suspense>
  );
}
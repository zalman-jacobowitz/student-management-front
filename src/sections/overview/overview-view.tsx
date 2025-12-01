import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { apiInfoStudents } from "src/actions/info_students";
import { LoadingScreen } from "src/components/loading-screen";
import { useWalktour, Walktour } from "src/components/walktour";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { AboutView } from "../about/view/about-view";
import { FileUploadStep } from "./overview-bank";



function OverviewMainView() {
  const infoStudents = useSuspenseQuery(apiInfoStudents());
  const router = useRouter()

  if (infoStudents.data.length === 0){
    router.push(paths.dashboard.initialization)
  }
  return <>{infoStudents.data.length}</>
}

const walktourSteps = [
  // TODO: Add walktour steps here
];

export function OverviewViewWrapper() {
  const walktour = <Walktour {...useWalktour({steps: walktourSteps})} />
  return (
    <Suspense fallback={<LoadingScreen />}>
      <>
        <FileUploadStep />
        {walktour}
      </>
    </Suspense>
  );
}
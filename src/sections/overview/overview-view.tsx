import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { apiInfoStudents } from "src/actions/info_students";
import { LoadingScreen } from "src/components/loading-screen";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";



function OverviewMainView() {
  const infoStudents = useSuspenseQuery(apiInfoStudents());
  const router = useRouter()

  if (infoStudents.data.length === 0){
    router.push(paths.dashboard.initialization)
  }
  return <>{infoStudents.data.length}</>
}


export function OverviewViewWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OverviewMainView />
    </Suspense>
  );
}
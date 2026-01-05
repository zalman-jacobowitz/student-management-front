import { Suspense, useState } from "react";
import { LoadingScreen } from "src/components/loading-screen";
import { AppWelcome } from "./dash-welcome";
import { Button, Grid } from "@mui/material";
import { CONFIG } from "src/config-global";
import { useCarousel } from "src/components/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Image } from "src/components/image";
import { DashboardContent } from "src/layouts/dashboard";
import { useUserDetails } from "src/hooks/use-user-details";
import { useTranslate } from "src/locales/use-locales";
import { AppFeatured } from "./app-featured";
import { AppWidgetSummary } from "./app-widget-summary";
import { AppCurrentDownload } from "./app-current-download";
import { AppAreaInstalled } from "./app-area-installed";
import { AppNewInvoice } from "./app-new-invoice";
import { useTheme } from "@emotion/react";
import { useAppAreaInstalledData } from "./hooks/use-app-area-installed-data";
import { Scrollbar } from "src/components/scrollbar";
import { SummaryEditDialog } from "../insert/delays/summary-edit-steps";
import { useBoolean } from "src/hooks/use-boolean";
import { AppSummaryEditDialog } from "./app-summary-edit-steps";
import { groupBy } from "../profile/profile-main";

function getGreetingByTimeInIsrael(t) {
  // הגדרת אזור הזמן של ישראל
  const israelTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
  const currentHour = new Date(israelTime).getHours();

  // קביעת ההודעה לפי השעה
  if (currentHour >= 5 && currentHour < 12) {
    return t('overview.goodMorning');
  }
  if (currentHour >= 12 && currentHour < 18) {
    return t('overview.goodAfternoon');
  }
  return t('overview.goodEvening');
}

const _appFeatured = [
    {
        id: '1',
        title: 'Manage Your Students',
        description: 'Easily keep track of student information and progress.',
        coverUrl: `${CONFIG.assetsDir}/assets/images/featured/manage-students.jpg`,
    },
    {
        id: '2',
        title: 'Generate Reports',
        description: 'Create customized reports to analyze student performance.',
        coverUrl: `${CONFIG.assetsDir}/assets/images/featured/generate-reports.jpg`,
    }
]
    

function OverviewView() {
    // Implementation of the OverviewView component
  const { t } = useTranslate();
  const { userDetails } = useUserDetails()
  const email = userDetails?.user_metadata?.display_name || '';
   const user = { email };
    const carousel = useCarousel({
    align: 'center',
    loop: true,
    dragFree: true,
    slideSpacing: '20px',
    direction: 'rtl',
    slidesToShow: { xs: 1, sm: 2, md: '32%' },
  }, [Autoplay({ playOnInit: false, delay: 2000 })])

  const theme = useTheme();
  const [summaryDetails, setSummaryDetails] = useState(null);
  const appAreaData = useAppAreaInstalledData(summaryDetails);
  
  const groupedSeries = groupBy(appAreaData.mergedData, appAreaData.selectedSeries, 'data', 'average');
  
  console.log('groupedSeries', groupedSeries);
  const listDashData = appAreaData.chartData.series[0].data.map((item) => ({
          title: item.fullName,
            percent: 2.6,
            total: groupedSeries.find((series) => series[appAreaData.selectedSeries] === item.name)?.data_average || 0,
            
            chart:{
              categories: appAreaData.uniqueColumns,
              series: item.data,
            }
          }));


    const summaryDialog = useBoolean(false);

    return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <AppWelcome
            title={`${user.email} 👋 \n ${getGreetingByTimeInIsrael(t)} `}
            description={t('overview.welcomeDescription')}
            img={<Image alt="" src={`${CONFIG.assetsDir}/assets/images/about/sign-page-abstract-concept-illustration-b.png`} ratio="8/6" sx={{ borderRadius: 1 }} />}
            action={
              <Button variant="contained" color="primary" onClick={summaryDialog.onTrue}>
                {t('overview.start')}
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
            <AppFeatured list={_appFeatured} />
        </Grid>
        <Grid item xs={12} md={12}>
          <AppWidgetSummary list={listDashData}/>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="יחס בין סדרים"
            subheader="בהתקנות בחודש האחרון"
            data={appAreaData}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="סיכום מפורט"
            subheader="יותר מהתקנות בחודש האחרון"
            data={appAreaData}
          />
        </Grid>


    </Grid>
          <AppSummaryEditDialog
            setSummaryDetails={setSummaryDetails}
            open={summaryDialog.value}
            onClose={summaryDialog.onFalse}
            onComplete={summaryDialog.onFalse}
          />
    </DashboardContent>
    )
}

export function OverviewWrapper() {

  return (
    <Suspense fallback={<LoadingScreen />}>
      
        <OverviewView />
        
    </Suspense>
  );
}
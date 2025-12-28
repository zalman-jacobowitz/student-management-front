import { Suspense } from "react";
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
  console.log('User Details in OverviewView:', userDetails);
    const user = { email };
    const carousel = useCarousel({
    align: 'center',
    loop: true,
    dragFree: true,
    slideSpacing: '20px',
    direction: 'rtl',
    slidesToShow: { xs: 1, sm: 2, md: '32%' },
  }, [Autoplay({ playOnInit: false, delay: 2000 })])

    return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <AppWelcome
            title={`${user.email} 👋 \n ${getGreetingByTimeInIsrael(t)} `}
            description={t('overview.welcomeDescription')}
            img={<Image alt="" src={`${CONFIG.assetsDir}/assets/images/about/sign-page-abstract-concept-illustration-b.png`} ratio="8/6" sx={{ borderRadius: 1 }} />}
            action={
              <Button variant="contained" color="primary" onClick={carousel.autoplay.onTogglePlay}>
                {t('overview.start')}
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
            <AppFeatured list={_appFeatured} />
        </Grid>
                <Grid item xs={12} md={4}>
          <AppWidgetSummary
            title="Total active users"
            percent={2.6}
            total={18765}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>
    </Grid>
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
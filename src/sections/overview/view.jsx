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

function getGreetingByTimeInIsrael() {
  // הגדרת אזור הזמן של ישראל
  const israelTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
  const currentHour = new Date(israelTime).getHours();

  // קביעת ההודעה לפי השעה
  if (currentHour >= 5 && currentHour < 12) {
    return "בוקר טוב"
  }
  if (currentHour >= 12 && currentHour < 18) {
    return "צהריים טובים"
  }
  return "ערב טוב"
}

function OverviewView() {
    // Implementation of the OverviewView component

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
            title={`${user.email} 👋 \n ${getGreetingByTimeInIsrael()} `}
            description="ברוך הבא למערכת! כאן תוכל לנהל נתונים, ליצור דוחות מותאמים אישית, ועוד."
            img={<Image alt="" src={`${CONFIG.assetsDir}/assets/images/about/sign-page-abstract-concept-illustration-b.png`} ratio="8/6" sx={{ borderRadius: 1 }} />}
            action={
              <Button variant="contained" color="primary" onClick={carousel.autoplay.onTogglePlay}>
                התחל
              </Button>
            }
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
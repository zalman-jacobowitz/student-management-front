import { Suspense } from "react";
import { LoadingScreen } from "src/components/loading-screen";
import { useWalktour, Walktour } from "src/components/walktour";

import useInsertStore from "../insert-state";
import { InsertListView } from "../insert-screen/insert-screen";

import { InsertForm } from "../form-event/insert-form-defind-event";
import { Box, Button, Icon, Link, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";


const formSteps = [
  {
    target: '.insert-form__card',
    title: 'כאן נתחיל את רישום הנוכחות',
    content: 'בחר את היום ואת הסדר שעליו אתה הולך לעשות רישום נוכחות',
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '.insert-form__date-picker',
    title: 'יום הרישום',
    content: 'בחר את יום הרישום. ברירת המחדל היא היום',
    placement: 'bottom',
  },
  {
    target: '.insert-form__event-select',
    title: 'בחירת סדר',
    content: <Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
      בחר את הסדר שעליו אתה רוצה לעשות רישום נוכחות.
      </Typography>
      <Button
        variant="soft"
        className="insert-form__prev-events-button"
        sx={{ mt: 2 }}
        
        color="success"
      >
        <Iconify icon="solar:alarm-bold-duotone" sx={{ mr: 1 }} />
            <Link component={RouterLink} href={paths.dashboard.templates} variant="subtitle2">
           לחץ כאן לשנות את הזמנים    
            </Link>
      </Button>
    </Box>,

    placement: 'bottom',
  },
  {
    target: '.insert-form__prev-events-button',
    title: 'כאן ניתן לראות את הסדרים שנעשה בהם רישום',
    content: 'אם הסדר הרצוי כבר קיים, ניתן לבחור אותו מרשימת הסדרים הקודמים',
    placement: 'bottom',
  },
  {
    target: '.insert-form__submit-button',
    title: 'התחל רישום נוכחות',
    content: 'לחץ כדי להתחיל ברישום',
    placement: 'bottom',
  },
];

const listSteps = [
  {
    target: '.insert-list__form',
    title: 'רישום נוכחות',
    content: 'בחר את הנוכחות של התלמידים',
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '.insert-list__container',
    title: 'רשימת התלמידים',
    content: 'בחר את סטטוס הנוכחות של כל תלמיד',
    placement: 'bottom',
  },
  {
    target: '.insert-list__submit-button',
    title: 'עדכן נוכחות',
    content: 'לחץ כדי לשמור את השינויים',
    placement: 'top',
  },
];

export default function InsertViewWrapper() {
  const { screen } = useInsertStore();
  const walktourSteps = screen === 'form' ? formSteps : listSteps;
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
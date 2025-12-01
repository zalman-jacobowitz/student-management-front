import { Suspense } from "react";
import { LoadingScreen } from "src/components/loading-screen";
import { useWalktour, Walktour } from "src/components/walktour";

import useInsertStore from "../insert-state";
import { InsertListView } from "../insert-screen/insert-screen";

import { InsertForm } from "../form-event/insert-form-defind-event";


const formSteps = [
  {
    target: '.insert-form__card',
    title: 'טופס רישום',
    content: 'מלא את פרטי האירוע',
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '.insert-form__alert',
    title: 'אירוע שנבחר',
    content: 'זהו האירוע שנבחרת לרישום',
    placement: 'bottom',
  },
  {
    target: '.insert-form__date-picker',
    title: 'תאריך עברי',
    content: 'בחר את התאריך העברי',
    placement: 'bottom',
  },
  {
    target: '.insert-form__event-select',
    title: 'בחירת אירוע',
    content: 'בחר אירוע מהרשימה',
    placement: 'bottom',
  },
  {
    target: '.insert-form__prev-events-button',
    title: 'אירועים קיימים',
    content: 'לחץ כדי לבחור מאירועים קודמים',
    placement: 'bottom',
  },
  {
    target: '.insert-form__submit-button',
    title: 'שליחת הטופס',
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
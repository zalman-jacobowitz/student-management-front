import { STATUS } from 'react-joyride';
import { useRef, useState, useEffect } from 'react';
import { useWalktourStore } from './walktour-store';

// ----------------------------------------------------------------------

export function useWalktour({ steps, defaultRun=true }) {
  const helpers = useRef();

  const [run, setRun] = useState(!!defaultRun);
  const { isHelpActive, setHelpActive } = useWalktourStore();

  // כאשר isHelpActive משתנה, הפעל/בטל את ההדרכה
  useEffect(() => {
    if (isHelpActive) {
      setRun(true);
    }
  }, [isHelpActive]);

  const setHelpers = (storeHelpers) => {
    helpers.current = storeHelpers;
  };

  const onCallback = (data) => {
    const { status } = data;

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      setHelpActive(false);
    }
  };

  return {
    run,
    steps,
    setRun,
    onCallback,
    setHelpers,
  };
}

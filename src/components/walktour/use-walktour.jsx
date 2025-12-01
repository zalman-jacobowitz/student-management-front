import { STATUS } from 'react-joyride';
import { useRef, useState, useEffect } from 'react';
import { useWalktourStore } from './walktour-store';

// ----------------------------------------------------------------------

export function useWalktour({ steps, defaultRun=false }) {
  const helpers = useRef();
  const { isHelpActive, setHelpActive } = useWalktourStore();

  const [run, setRun] = useState(!!isHelpActive || defaultRun);

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

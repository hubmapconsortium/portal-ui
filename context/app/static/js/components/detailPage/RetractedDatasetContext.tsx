import React, { PropsWithChildren, useMemo } from 'react';

import { createContext, useContext } from 'js/helpers/context';

interface RetractedDatasetContextType {
  isRetracted: boolean;
}

// A default value is supplied so that shared detail-page components (sections, accordions) can
// safely read this context on non-retracted pages without a provider — they simply see `false`.
const RetractedDatasetContext = createContext<RetractedDatasetContextType>('RetractedDatasetContext', {
  isRetracted: false,
});

export function useRetractedDatasetContext() {
  return useContext(RetractedDatasetContext);
}

export function RetractedDatasetProvider({ isRetracted, children }: PropsWithChildren<RetractedDatasetContextType>) {
  const value = useMemo(() => ({ isRetracted }), [isRetracted]);
  return <RetractedDatasetContext.Provider value={value}>{children}</RetractedDatasetContext.Provider>;
}

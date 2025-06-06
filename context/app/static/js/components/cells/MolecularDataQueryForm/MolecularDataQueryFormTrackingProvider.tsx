import React, { useCallback, useMemo, useRef } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import { trackEvent } from 'js/helpers/trackers';
import { v4 } from 'uuid';

interface MolecularDataQueryFormTrackingProviderProps extends React.PropsWithChildren {
  category?: string;
}

interface MolecularDataQueryFormTrackingContext {
  track: (action: string, name?: string) => void;
  sessionId: string;
  category: string;
  isDefaultCategory: boolean;
}

const MolecularDataQueryFormTrackingContext = createContext<MolecularDataQueryFormTrackingContext>(
  'MolecularDataQueryFormTrackingContext',
);

const defaultCategory = 'Molecular and Cellular Query';

export default function MolecularDataQueryFormTrackingProvider({
  children,
  category = defaultCategory,
}: MolecularDataQueryFormTrackingProviderProps) {
  // This generates a unique session ID for each instance of the form
  // to track the session of the user filling out the form.
  const sessionId = useRef<string>(`{${v4()}}`);

  const isDefaultCategory = category === defaultCategory;

  const track = useCallback(
    (action: string, name?: string) => {
      const id = sessionId.current;
      const molecularQueryTrackingLabel = name ? `${id} ${name}` : id;
      trackEvent({
        category,
        action,
        label: isDefaultCategory ? molecularQueryTrackingLabel : name,
      });
    },
    [category, isDefaultCategory],
  );

  const value = useMemo(
    () => ({
      track,
      sessionId: sessionId.current,
      category,
      isDefaultCategory,
    }),
    [category, isDefaultCategory, track],
  );

  return (
    <MolecularDataQueryFormTrackingContext.Provider value={value}>
      {children}
    </MolecularDataQueryFormTrackingContext.Provider>
  );
}

export const useMolecularDataQueryFormTracking = () => useContext(MolecularDataQueryFormTrackingContext);

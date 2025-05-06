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
}

const MolecularDataQueryFormTrackingContext = createContext<MolecularDataQueryFormTrackingContext>(
  'MolecularDataQueryFormTrackingContext',
);

export default function MolecularDataQueryFormTrackingProvider({
  children,
  category = 'Molecular and Cellular Query',
}: MolecularDataQueryFormTrackingProviderProps) {
  // This generates a unique session ID for each instance of the form
  // to track the session of the user filling out the form.
  const sessionId = useRef<string>(`{${v4()}}`);

  const track = useCallback(
    (action: string, name?: string) => {
      const id = sessionId.current;
      trackEvent({
        category,
        action,
        label: name ? `${id} ${name}` : id,
      });
    },
    [category],
  );

  const value = useMemo(() => ({ track, sessionId: sessionId.current }), [track]);

  return (
    <MolecularDataQueryFormTrackingContext.Provider value={value}>
      {children}
    </MolecularDataQueryFormTrackingContext.Provider>
  );
}

export const useMolecularDataQueryFormTracking = () => useContext(MolecularDataQueryFormTrackingContext);

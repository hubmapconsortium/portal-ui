import React, { useCallback, useMemo, useRef } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import { trackEvent } from 'js/helpers/trackers';
import { v4 } from 'uuid';
import { useOptionalGenePageContext } from 'js/components/genes/GenePageContext';

export type MolecularDataQueryFormTrackingCategory = 'Molecular and Cellular Query' | 'Gene Detail Page';
const defaultCategory: MolecularDataQueryFormTrackingCategory = 'Molecular and Cellular Query';
const geneDetailPageCategory: MolecularDataQueryFormTrackingCategory = 'Gene Detail Page';
export const molecularDataQueryFormTrackingCategories: MolecularDataQueryFormTrackingCategory[] = [
  defaultCategory,
  geneDetailPageCategory,
];

interface MolecularDataQueryFormTrackingProviderProps extends React.PropsWithChildren {
  category?: MolecularDataQueryFormTrackingCategory;
}

interface MolecularDataQueryFormTrackingContext {
  track: (action: string, name?: string) => void;
  sessionId: string;
  category: MolecularDataQueryFormTrackingCategory;
  isDefaultCategory: boolean;
  isGenePageCategory: boolean;
  label: string;
}

const MolecularDataQueryFormTrackingContext = createContext<MolecularDataQueryFormTrackingContext>(
  'MolecularDataQueryFormTrackingContext',
);

export default function MolecularDataQueryFormTrackingProvider({
  children,
  category = defaultCategory,
}: MolecularDataQueryFormTrackingProviderProps) {
  // This generates a unique session ID for each instance of the form
  // to track the session of the user filling out the form.
  const sessionId = useRef<string>(`{${v4()}}`);
  const genePageContext = useOptionalGenePageContext();

  const track = useCallback(
    (action: string, name?: string) => {
      const id = sessionId.current;
      const geneSymbol = genePageContext?.geneSymbolUpper ?? '';
      const molecularQueryTrackingLabel = name ? `${id} ${name}` : id;
      const genePageContextTrackingLabel = name ? `${geneSymbol} ${name}` : geneSymbol;
      const label =
        {
          'Molecular and Cellular Query': molecularQueryTrackingLabel,
          'Gene Detail Page': genePageContextTrackingLabel,
        }[category] || name;
      trackEvent({
        category,
        action,
        label,
      });
    },
    [category, genePageContext?.geneSymbolUpper],
  );

  const value = useMemo(
    () => ({
      track,
      sessionId: sessionId.current,
      category,
      label: category === defaultCategory ? sessionId.current : (genePageContext?.geneSymbolUpper ?? ''),
      isDefaultCategory: category === defaultCategory,
      isGenePageCategory: category === geneDetailPageCategory,
    }),
    [category, genePageContext?.geneSymbolUpper, track],
  );

  return (
    <MolecularDataQueryFormTrackingContext.Provider value={value}>
      {children}
    </MolecularDataQueryFormTrackingContext.Provider>
  );
}

export const useMolecularDataQueryFormTracking = () => useContext(MolecularDataQueryFormTrackingContext);

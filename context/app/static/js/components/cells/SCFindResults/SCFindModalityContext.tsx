import { createContext, useContext } from 'react';
import { SCFindModality } from '../MolecularDataQueryForm/types';

const SCFindModalityContext = createContext<SCFindModality>(undefined);
SCFindModalityContext.displayName = 'SCFindModalityContext';

export const SCFindModalityProvider = SCFindModalityContext.Provider;

/**
 * Returns the current scFind modality from context.
 * `undefined` means RNA (default), `'ATAC'` means ATACseq.
 * Safe to use both inside and outside the provider (returns `undefined` when no provider).
 */
export const useSCFindModality = (): SCFindModality => useContext(SCFindModalityContext);

// Alias for clarity in components that may render outside the provider
export const useOptionalSCFindModality = useSCFindModality;

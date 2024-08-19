import React, { useState, PropsWithChildren, useMemo } from 'react';

import { createContext, useContext } from 'js/helpers/context';

interface CollectionsSectionContextType {
  processedDatasetHasCollections: boolean;
  setProcessedDatasetHasCollections: (value: boolean) => void;
}

const CollectionsSectionContext = createContext<CollectionsSectionContextType>('CollectionsSectionContext');

export const useCollectionsSectionContext = () => useContext(CollectionsSectionContext);

/**
 * This context helps deal with tab logic specific to the collections section.
 * If no collections are found for any of the datasets, the section should not be displayed
 * If the primary dataset is not found in any collections but the processed dataset is, the section should be displayed
 * If the primary dataset is found in a collection, but none of the processed datasets are, the section should be displayed as a single tab
 */
export default function CollectionsSectionProvider({ children }: PropsWithChildren) {
  const [processedDatasetHasCollections, setProcessedDatasetHasCollections] = useState(false);

  const value = useMemo(
    () => ({ processedDatasetHasCollections, setProcessedDatasetHasCollections }),
    [processedDatasetHasCollections, setProcessedDatasetHasCollections],
  );

  return <CollectionsSectionContext.Provider value={value}>{children}</CollectionsSectionContext.Provider>;
}

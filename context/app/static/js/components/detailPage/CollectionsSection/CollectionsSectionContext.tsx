import React, { useState, PropsWithChildren, useMemo } from 'react';

import { createContext, useContext } from 'js/helpers/context';

interface CollectionsSectionContextType {
  processedDatasetHasCollections: boolean;
  setProcessedDatasetHasCollections: (value: boolean) => void;
}

const CollectionsSectionContext = createContext<CollectionsSectionContextType>('CollectionsSectionContext');

export const useCollectionsSectionContext = () => useContext(CollectionsSectionContext);

export default function CollectionsSectionProvider({ children }: PropsWithChildren) {
  const [processedDatasetHasCollections, setProcessedDatasetHasCollections] = useState(false);

  const value = useMemo(
    () => ({ processedDatasetHasCollections, setProcessedDatasetHasCollections }),
    [processedDatasetHasCollections, setProcessedDatasetHasCollections],
  );

  return <CollectionsSectionContext.Provider value={value}>{children}</CollectionsSectionContext.Provider>;
}

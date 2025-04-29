import React from 'react';

import CollectionsSearchBar from 'js/components/collections/CollectionsSearchBar';
import CollectionsPanelList from 'js/components/collections/CollectionsPanelList';
import CollectionsSearchProvider from 'js/components/collections/CollectionsSearchContext';
import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import CollectionsDescription from 'js/components/collections/CollectionsDescription';
import { useCollections } from 'js/components/collections/hooks';

const description =
  'HuBMAP collections group datasets from related experiments, such as assays performed on the same organ or datasets with shared research relevance. Each collection is assigned a Document Object Identifier (DOI) for citation and reference.';

function Collections() {
  const { collections, isLoading } = useCollections();

  return (
    <CollectionsSearchProvider>
      <PanelListLandingPage
        title="Collections"
        subtitle={collections.length > 0 ? `${collections.length} Collections` : undefined}
        description={description}
        data-testid="collections-title"
      >
        <CollectionsDescription />
        <CollectionsSearchBar />
        <CollectionsPanelList collections={collections} isLoading={isLoading} />
      </PanelListLandingPage>
    </CollectionsSearchProvider>
  );
}

export default Collections;

import React from 'react';

import CollectionsSearchBar from 'js/components/collections/CollectionsSearchBar';
import CollectionsPanelList from 'js/components/collections/CollectionsPanelList';
import CollectionsSearchProvider from 'js/components/collections/CollectionsSearchContext';
import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import { useCollectionHits } from 'js/components/collections/hooks';

const text = {
  title: 'Collections',
  description:
    'HuBMAP collections group datasets from related experiments, such as assays performed on the same organ or datasets with shared research relevance. Each collection is assigned a Document Object Identifier (DOI) for citation and reference.',
  sectionTitle: 'Collections of HuBMAP Data',
  sectionDescription:
    'Explore collections of HuBMAP datasets. This table can be downloaded in TSV format. Collection pages provide context on why the datasets are grouped and include a list of the associated HuBMAP datasets.',
};

function Collections() {
  const { collections } = useCollectionHits();

  return (
    <CollectionsSearchProvider>
      <PanelListLandingPage
        title={text.title}
        subtitle={collections.length > 0 ? `${collections.length} Collections` : undefined}
        description={text.description}
        sectionTitle={text.sectionTitle}
        sectionDescription={text.sectionDescription}
        data-testid="collections-title"
      >
        <CollectionsSearchBar />
        <CollectionsPanelList />
      </PanelListLandingPage>
    </CollectionsSearchProvider>
  );
}

export default Collections;

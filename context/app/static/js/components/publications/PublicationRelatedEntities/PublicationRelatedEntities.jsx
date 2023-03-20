import React, { useState } from 'react';

import RelatedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionHeader from 'js/components/detailPage/related-entities/RelatedEntitiesSectionHeader';
import DerivedDatasetsTable from 'js/components/detailPage/derivedEntities/DerivedDatasetsTable';
import DerivedSamplesTable from 'js/components/detailPage/derivedEntities/DerivedSamplesTable';

import { useAncestorSearchHits } from './hooks';

function PublicationRelatedEntities({ uuid }) {
  const [openIndex, setOpenIndex] = useState(0);

  const { searchHits: ancestorHits, isLoading } = useAncestorSearchHits(uuid);

  const ancestorsSplitByEntityType = ancestorHits.reduce(
    (acc, ancestor) => {
      const {
        _source: { entity_type },
      } = ancestor;

      if (!entity_type) {
        return acc;
      }

      acc[entity_type].push(ancestor);
      return acc;
    },
    { Donor: [], Sample: [], Dataset: [] },
  );

  const entities = [
    {
      entityType: 'Sample',
      tabLabel: 'Samples',
      data: ancestorsSplitByEntityType.Sample,
      Component: DerivedSamplesTable,
    },
    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: ancestorsSplitByEntityType.Dataset,
      Component: DerivedDatasetsTable,
    },
  ];

  return (
    <RelatedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId="publication-entities"
      headerComponent={
        <RelatedEntitiesSectionHeader
          header="Data"
          uuid={uuid}
          searchPageHref={`/search?descendant_ids[0]=${uuid}&entity_type[0]=${entities[openIndex].entityType}`}
        />
      }
    >
      <RelatedEntitiesTabs
        entities={entities}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        ariaLabel="Publication Entities Tabs"
        renderWarningMessage={(tableEntityType) =>
          `No derived ${tableEntityType.toLowerCase()}s for this publication}.`
        }
      />
    </RelatedEntitiesSectionWrapper>
  );
}

export default PublicationRelatedEntities;

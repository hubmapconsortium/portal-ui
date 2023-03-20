import React, { useState } from 'react';

import RelatedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionHeader from 'js/components/detailPage/related-entities/RelatedEntitiesSectionHeader';
import DerivedDatasetsTable from 'js/components/detailPage/derivedEntities/DerivedDatasetsTable';
import DerivedSamplesTable from 'js/components/detailPage/derivedEntities/DerivedSamplesTable';

function DerivedEntitiesSection({ samples, datasets, uuid, isLoading, sectionId, entityType }) {
  const [openIndex, setOpenIndex] = useState(0);

  const entities = [
    {
      entityType: 'Sample',
      tabLabel: 'Samples',
      data: samples,
      Component: DerivedSamplesTable,
    },
    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: datasets,
      Component: DerivedDatasetsTable,
    },
  ];

  return (
    <RelatedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId={sectionId}
      headerComponent={
        <RelatedEntitiesSectionHeader
          header="Derived Samples and Datasets"
          uuid={uuid}
          searchPageHref={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${entities[openIndex].entityType}`}
        />
      }
    >
      <RelatedEntitiesTabs
        entities={entities}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        ariaLabel="Derived Datasets and Samples Tabs"
        renderWarningMessage={(tableEntityType) =>
          `No derived ${tableEntityType.toLowerCase()}s for this ${entityType.toLowerCase()}.`
        }
      />
    </RelatedEntitiesSectionWrapper>
  );
}

export default DerivedEntitiesSection;

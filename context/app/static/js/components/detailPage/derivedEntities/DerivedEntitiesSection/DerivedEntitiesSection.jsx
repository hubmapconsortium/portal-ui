import React, { useState } from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/detailPage/derivedEntities/DerivedEntitiesSectionWrapper';
import DerivedEntitiesTabs from 'js/components/detailPage/derivedEntities/DerivedEntitiesTabs';
import DerivedEntitiesSectionHeader from 'js/components/detailPage/derivedEntities/DerivedEntitiesSectionHeader';
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
    <DerivedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId={sectionId}
      headerComponent={
        <DerivedEntitiesSectionHeader
          header="Derived Samples and Datasets"
          entityCountsText={`${samples.length} Samples | ${datasets.length} Datasets`}
          uuid={uuid}
          entityType={entities[openIndex].entityType}
        />
      }
    >
      <DerivedEntitiesTabs
        entities={entities}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        entityType={entityType}
      />
    </DerivedEntitiesSectionWrapper>
  );
}

export default DerivedEntitiesSection;

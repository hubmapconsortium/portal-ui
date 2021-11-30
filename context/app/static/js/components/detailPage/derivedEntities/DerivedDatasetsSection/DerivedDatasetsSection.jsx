import React from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/detailPage/derivedEntities/DerivedEntitiesSectionWrapper';
import DerivedDatasetsTable from 'js/components/detailPage/derivedEntities/DerivedDatasetsTable';
import DerivedEntitiesSectionHeader from 'js/components/detailPage/derivedEntities/DerivedEntitiesSectionHeader';

function DerivedDatasetsSection({ datasets, uuid, isLoading, sectionId }) {
  const entityType = 'Dataset';
  return (
    <DerivedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId={sectionId}
      headerComponent={
        <DerivedEntitiesSectionHeader
          header="Derived Datasets"
          entityCountsText={`${datasets.length} Datasets`}
          uuid={uuid}
          entityType={entityType}
        />
      }
    >
      <DerivedDatasetsTable entities={datasets} />
    </DerivedEntitiesSectionWrapper>
  );
}

export default DerivedDatasetsSection;

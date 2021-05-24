import React from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/Detail/derivedEntities/DerivedEntitiesSectionWrapper';
import DerivedDatasetsTable from 'js/components/Detail/derivedEntities/DerivedDatasetsTable';
import DerivedEntitiesSectionHeader from 'js/components/Detail/derivedEntities/DerivedEntitiesSectionHeader';

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

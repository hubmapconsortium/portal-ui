import React from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/Detail/DerivedEntitiesSectionWrapper';
import DerivedDatasetsTable from 'js/components/Detail/DerivedDatasetsTable';
import DerivedEntitiesSectionHeader from 'js/components/Detail/DerivedEntitiesSectionHeader';

function DerivedDatasetsSection({ datasets, uuid, isLoading, sectionId }) {
  const entityType = 'Dataset';
  return (
    <DerivedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId={sectionId}
      header={
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

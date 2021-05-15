import React from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/Detail/DerivedEntitiesSectionWrapper';
import DerivedEntitiesTable from 'js/components/Detail/DerivedEntitiesTable';
import DerivedEntitiesSectionHeader from 'js/components/Detail/DerivedEntitiesSectionHeader';

function DerivedDatasetsSection({ datasets, uuid, isLoading, sectionId }) {
  const entityType = 'Dataset';
  return (
    <DerivedEntitiesSectionWrapper isLoading={isLoading} sectionId={sectionId}>
      <DerivedEntitiesSectionHeader
        header="Datasets"
        entityCountsText={`${datasets.length} Datasets`}
        uuid={uuid}
        entityType="Dataset"
      />
      <DerivedEntitiesTable entities={datasets} entityType={entityType} />
    </DerivedEntitiesSectionWrapper>
  );
}

export default DerivedDatasetsSection;
